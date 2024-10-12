import { Page, Locator, expect } from "@playwright/test";
import { ClassificationStorePage } from "../classification-store/classification-store.page";

export class LeftMenu {

    readonly page: Page;
    readonly btnLogout: Locator;
    readonly gearIconOption: Locator;

    constructor(page: Page) {

        this.page = page;
        this.btnLogout = page.locator('#pimcore_logout');
        this.gearIconOption = page.locator('#pimcore_menu_settings');
    }

    async logout() {
        await this.btnLogout.click();
        expect(this.page.getByRole('button', { name: 'login' })).toBeVisible;
    }

    async goToClassificationStore() {
        await this.gearIconOption.click();
        await this.page.getByRole('menuitem', { name: 'Data Objects' }).click();
        await this.page.getByRole('menuitem', { name: 'Classification Store' }).click();
        expect(this.page.locator('td div', { hasText: 'Attributes' })).toBeVisible();
        return new ClassificationStorePage(this.page);
    }
}