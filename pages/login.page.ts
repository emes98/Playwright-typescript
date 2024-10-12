import { test, expect, Locator, Page } from '@playwright/test';
import { loginPIMUserAdmin, loginPIMUserStandard } from '../test-data/login.data';
import { PimcoreMainPage } from './main.page';

export class LoginPage {
  private page: Page;
  usernameInput: Locator;
  userpasswordInput: Locator;
  btnLogin: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = this.page.getByPlaceholder('username');
    this.userpasswordInput = this.page.getByPlaceholder('Password');
    this.btnLogin = this.page.getByRole('button', { name: 'login' });
  }

  async goto(url: string) {
    await this.page.goto(url);
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.userpasswordInput.fill(password);


    await this.btnLogin.click();
  }

  async userStandardLogin(page: Page) {
    const loginPage = new LoginPage(page);
    await loginPage.goto(loginPIMUserStandard.pim_url);
    await loginPage.login(loginPIMUserStandard.pim_username, loginPIMUserStandard.pim_password);

    const mainPage = new PimcoreMainPage(this.page);
    const dataObjectsTab = mainPage.sideBar.dataObjectsTab;
    await expect(dataObjectsTab).toBeVisible();
    return mainPage;
  }

  async userAdminLogin(page: Page) {
    const loginPage = new LoginPage(page);
    await loginPage.goto(loginPIMUserAdmin.pim_url);
    await loginPage.login(loginPIMUserAdmin.pim_username, loginPIMUserAdmin.pim_password);

    const mainPage = new PimcoreMainPage(this.page);
    const dataObjectsTab = mainPage.sideBar.dataObjectsTab;
    await expect(dataObjectsTab).toBeVisible({ timeout: 30000 });
    return mainPage;
  }
}

