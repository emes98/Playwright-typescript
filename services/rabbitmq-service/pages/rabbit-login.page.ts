import { Page, Locator } from "@playwright/test";
import { expect } from "@playwright/test";
import { loginRabittMQ } from "../../../test-data/login.data";
import { RabbitMainPage } from "./rabbit-main.page";

export class RabbitLoginPage {

    readonly page: Page;
    readonly inputLogin: Locator;
    readonly inputPassword: Locator;
    readonly btnLogin: Locator;

    constructor(page: Page) {
        this.page = page;
        this.inputLogin = this.page.locator('input[name="username"]');
        this.inputPassword = this.page.locator('input[name="password"]');
        this.btnLogin = this.page.locator('input[type="submit"]');
    }

    async goto(url: string) {
        await this.page.goto(url);
        await expect(this.page.getByText('Username:')).toBeVisible();
    }

    async login(username: string, password: string) {
        await this.inputLogin.fill(username);
        await this.inputPassword.fill(password);
        await this.btnLogin.click();
    }

    async userLogin(page: Page) {
        const loginPage = new RabbitLoginPage(page);
        await loginPage.goto(loginRabittMQ.rabbitmq_url);
        await loginPage.login(loginRabittMQ.rabbitmq_username, loginRabittMQ.rabbitmq_password);

        await page.waitForLoadState('networkidle');
        expect(this.page.locator('h1', { hasText: 'Overview' })).toBeVisible({ timeout: 30000 });
        return new RabbitMainPage(this.page);
    }
}