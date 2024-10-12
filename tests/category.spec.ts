import test, { expect } from "@playwright/test";
import { LeftMenu } from "../pages/components/left-menu.component";
import { SideBar } from "../pages/components/side-bar.component";
import { LoginPage } from "../pages/login.page";
import { CreateCategoryData } from "../test-data/create-category-data";
import { RabbitLoginPage } from "../services/rabbitmq-service/pages/rabbit-login.page";
import { ClassificationStoreData } from "../test-data/classification-store-data";
import { loginPIMUserAdmin, loginPIMUserStandard } from "../test-data/login.data";

test.describe('Pimcore and RabbitMQ Category tests', () => {

  let categoryData: CreateCategoryData;
  let groupData: ClassificationStoreData;
  let leftMenu: LeftMenu;
  let sideBar: SideBar;
  let rabbitLoginPage: RabbitLoginPage;
  let loginPimcorePage: LoginPage;

  const userStandardId = loginPIMUserStandard.user_Id;
  const userAdminId = loginPIMUserAdmin.user_Id;

  test.beforeEach(async ({ page }) => {

    groupData = new ClassificationStoreData();
    categoryData = new CreateCategoryData(groupData.groupName);
    leftMenu = new LeftMenu(page);
    sideBar = new SideBar(page);
    rabbitLoginPage = new RabbitLoginPage(page);
    loginPimcorePage = new LoginPage(page);

    // Create new cs group in Pimcore
    await loginPimcorePage.userAdminLogin(page);
    let csPage = await leftMenu.goToClassificationStore();
    await csPage.openAttributesCS();
    let groupsTable = await csPage.openGroupsTable();
    await groupsTable.addNewGroup(groupData.groupName);
    await leftMenu.logout();
  });

  test.afterEach(async ({ page }) => {

    // Delete created Category via RabbitMQ
    let rabbitMainPage = await rabbitLoginPage.userLogin(page);
    let categoryX2QueuePage = await rabbitMainPage.goToX2Queue();
    await categoryX2QueuePage.sendDeleteCategoryMessage(categoryData.id);
    await page.waitForTimeout(1000);
    await categoryX2QueuePage.userPanel.logout();

    // Make sure the category has been removed from Pimcore
    await loginPimcorePage.userAdminLogin(page);
    await sideBar.expandDataObjectsTab();
    let gridPage = await sideBar.openCategoryGridPage();
    await gridPage.assertCategoryObjectVisibilityOnGrid(categoryData.x7, false);

    // Delete created cs group
    let csPage = await leftMenu.goToClassificationStore();
    await csPage.openAttributesCS();
    let groupsTable = await csPage.openGroupsTable();
    await groupsTable.filterObjectsByName(groupData.groupName);
    await groupsTable.removeGroupFromCSTable(groupData.groupName);
    await groupsTable.assertObjectVisibilityOnCSTable(groupData.groupName, false);
  })

  test('Should create new category via RabbitMQ, edit it and publish in Pimcore', async ({ page }) => {

    test.setTimeout(5 * 60 * 1000);

    // Create new Category in Pimcore via RabbitMQ
    let rabbitMainPage = await rabbitLoginPage.userLogin(page);
    let categoryX2QueuePage = await rabbitMainPage.goToX2Queue();
    await categoryX2QueuePage.sendCreateNewCategoryMessage(categoryData.x1, categoryData.id, categoryData.x6, categoryData.x2, categoryData.x3);
    await page.waitForTimeout(1 * 60 * 1000);
    await categoryX2QueuePage.userPanel.logout();

    // Make sure the category has appered in Pimcore 
    await loginPimcorePage.userStandardLogin(page);
    await sideBar.expandDataObjectsTab();
    let categoryGridPage = await sideBar.openCategoryGridPage();
    await categoryGridPage.assertCategoryObjectVisibilityOnGrid(categoryData.x7, true);

    // Fill seo field and Foto and publish category
    let categoryCreationPage = await categoryGridPage.openCategoryObjectFromGrid(categoryData.x7, userStandardId);
    await categoryCreationPage.attachAssetToFoto(categoryData.image);
    await categoryCreationPage.addX1(categoryData.x6);
    await categoryCreationPage.publishCategory();

    // Make sure the category has the correct data
    await categoryCreationPage.topBar.reloadPage();
    await expect(page.getByLabel('X1 *:')).toBeVisible({ timeout: 60000 });
    await page.waitForTimeout(5000);
    await categoryCreationPage.assertCategoryFieldValues({ input1: categoryData.x1, select1: categoryData.x2, input2: categoryData.x3, input4: categoryData.x6 });
    await leftMenu.logout();
  })

  test('Should edit created category via RabbitMQ', async ({ page }) => {

    test.setTimeout(5 * 60 * 1000);

    // Create new Category in Pimcore via RabbitMQ
    let rabbitMainPage = await rabbitLoginPage.userLogin(page);
    let categoryX2QueuePage = await rabbitMainPage.goToX2Queue();
    await categoryX2QueuePage.sendCreateNewCategoryMessage(categoryData.x1, categoryData.id, categoryData.x6, categoryData.x2, categoryData.x3);
    await page.waitForTimeout(1 * 60 * 1000);
    await categoryX2QueuePage.userPanel.logout();

    // Make sure the category has appered in Pimcore and has correct data
    await loginPimcorePage.userStandardLogin(page);
    await sideBar.expandDataObjectsTab();
    let categoryGridPage = await sideBar.openCategoryGridPage();
    let categoryCreationPage = await categoryGridPage.openCategoryObjectFromGrid(categoryData.x7);
    await categoryCreationPage.assertCategoryFieldValues({ input1: categoryData.x1, input2: categoryData.x3, select1: categoryData.x2 });
    await leftMenu.logout();

    //Update category description and product via RabbitMQ
    const newCategoryDescription = "Description Auto after update";
    const newCategoryProduct = "A01-AU";

    rabbitMainPage = await rabbitLoginPage.userLogin(page);
    categoryX2QueuePage = await rabbitMainPage.goToX2Queue();
    await categoryX2QueuePage.sendUpdateCategoryMessage(newCategoryProduct, categoryData.id, categoryData.x6, categoryData.x2, newCategoryDescription);
    await page.waitForTimeout(1 * 60 * 1000);
    await categoryX2QueuePage.userPanel.logout();

    // Make sure the category description and product has been changed 
    await loginPimcorePage.userStandardLogin(page);
    await sideBar.expandDataObjectsTab();
    categoryGridPage = await sideBar.openCategoryGridPage();
    categoryCreationPage = await categoryGridPage.openCategoryObjectFromGrid(categoryData.x7, userStandardId);

    await categoryCreationPage.assertCategoryFieldValues({ input1: newCategoryProduct, input2: newCategoryDescription, select1: categoryData.x2 });
    await leftMenu.logout();
  })
})