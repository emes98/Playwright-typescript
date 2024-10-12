import { test, expect, Locator } from '@playwright/test';
import { SideBar } from '../pages/components/side-bar.component';
import { LoginPage } from '../pages/login.page';
import { CreateBrandData } from '../test-data/create-brand-data';
import { LeftMenu } from '../pages/components/left-menu.component';
import { RabbitLoginPage } from '../services/rabbitmq-service/pages/rabbit-login.page';
import { PimcoreMainPage } from '../pages/main.page';

test.describe('Pimcore Brands tests', () => {

  let brandData: CreateBrandData;
  let leftMenu: LeftMenu;
  let sideBar: SideBar;

  test.beforeEach(async ({ page }) => {

    brandData = new CreateBrandData();
    leftMenu = new LeftMenu(page);
    sideBar = new SideBar(page);

    const loginPage = new LoginPage(page);
    await loginPage.userStandardLogin(page);
    await sideBar.expandDataObjectsTab();
  });

  test.afterEach(async ({ page }) => {

    //Logout as user Standard
    await leftMenu.logout();

    // Login as admin user and delete created brand from pimcore
    const loginPage = new LoginPage(page);
    await loginPage.userAdminLogin(page);
    const mainPage = new PimcoreMainPage(page);
    await mainPage.sideBar.expandDataObjectsTab();
    const brandGridPage = await mainPage.sideBar.openBrandGridPage();
    await brandGridPage.deleteBrandObjectFromGrid(brandData.x1);
  });

  test('Should create new brand', async ({ page }) => {

    test.setTimeout(3 * 60 * 1000);
    const brandPage = await sideBar.goToCreationNewBrandPage(brandData.x1);

    await brandPage.addInput1Name(brandData.x2);
    await brandPage.addInput2Name(brandData.x3);
    await brandPage.addInput3DescriptionName(brandData.x4);
    await brandPage.attachFotoToLogo(brandData.xLogoPath);
    await brandPage.addInput4(brandData.x5);

    await page.waitForTimeout(5000);
    await brandPage.publishObject();

    await brandPage.popupMessage.assertObjectSavedSuccessfully();
    await brandPage.assertBrandFieldValues(brandData.x2, brandData.x3, brandData.x4, brandData.x5)
  });
});

test.describe('RabbitMQ Brands tests', () => {

  let brandData: CreateBrandData;
  let pimcoreLeftMenu: LeftMenu;
  let pimcoreSideBar: SideBar;
  let rabbitLoginPage: RabbitLoginPage;
  let pimcoreLoginPage: LoginPage;

  test.beforeEach(async ({ page }) => {

    brandData = new CreateBrandData();
    pimcoreLeftMenu = new LeftMenu(page);
    pimcoreSideBar = new SideBar(page);
    rabbitLoginPage = new RabbitLoginPage(page);
    pimcoreLoginPage = new LoginPage(page);
  });


  test('Should send create and delete brand message on rabbit queue', async ({ page }) => {

    test.setTimeout(5 * 60 * 1000);

    // Create new brand using RabbitMQ and make sure it appeared in pimcore
    let rabbitMainPage = await rabbitLoginPage.userLogin(page);
    let brandX1QueuePage = await rabbitMainPage.goToX1Queue();
    await brandX1QueuePage.sendCreateNewBrandMessage(brandData.x1);
    await page.waitForTimeout(1 * 60 * 1000);
    await brandX1QueuePage.userPanel.logout();

    await pimcoreLoginPage.userStandardLogin(page);
    await pimcoreSideBar.expandDataObjectsTab();
    let gridPage = await pimcoreSideBar.openBrandGridPage();
    await gridPage.assertBrandObjectVisibilityOnGrid(brandData.x1, true);
    await gridPage.leftMenu.logout();

    // Send delete brand message using RabbitMQ and make sure it disappeared from pimcore
    rabbitMainPage = await rabbitLoginPage.userLogin(page);
    brandX1QueuePage = await rabbitMainPage.goToX1Queue();
    await brandX1QueuePage.sendDeleteBrandMessage(brandData.x1);
    await page.waitForTimeout(1 * 60 * 1000);
    await brandX1QueuePage.userPanel.logout();

    await pimcoreLoginPage.userStandardLogin(page);
    await pimcoreSideBar.expandDataObjectsTab();
    gridPage = await pimcoreSideBar.openBrandGridPage();
    await gridPage.assertBrandObjectVisibilityOnGrid(brandData.x1, false);
    await gridPage.leftMenu.logout();
  })
});