import { Locator, Page } from '@playwright/test';
import { PopupMessages } from './popup-messages.component';

export class TopBar {

    readonly page: Page;
    readonly btnPublish: Locator;
    readonly btnDelete: Locator;
    readonly btnReload: Locator;
    readonly btnUserRolesSwitcher: Locator;

    constructor(page: Page) {

        this.page = page;
        this.btnPublish = page.locator('//span[contains(text(),"Save & Publish")]');
        this.btnDelete = page.locator('div.x-toolbar').locator('a[data-qtip="Delete"]');
        this.btnReload = page.locator('div.x-toolbar').locator('a[data-qtip="Reload"]').locator('span[data-ref="btnIconEl"]').last();
        this.btnUserRolesSwitcher = this.btnReload.locator('span[role="button"][data-ref="arrowEl"]');
    }

    async publishObject() {
        await this.btnPublish.click();
        return this;
    }

    async getObjectId() {

        const objectId = await this.page.locator('div.x-toolbar').locator('div.x-toolbar-text', { hasText: 'ID' }).textContent();
        const match = objectId?.match(/\d+/);
        const numberString = match ? match[0] : '';
        return numberString;
    }

    async deleteObject() {

        await this.btnDelete.click();
        const btnConfirmDeleting = this.page.getByRole('button', { name: 'OK', exact: true });
        await btnConfirmDeleting.click();
    }

    async reloadPage() {

        const popupMessages = new PopupMessages(this.page);
        await this.btnReload.click();
        await popupMessages.handleUnsavedChanges(true);
    }

    async switchToUserAdminMode() {

        await this.btnUserRolesSwitcher.click({ force: true });
        const optionAdminMode = this.page.getByText('Main (Admin Mode)');
        await optionAdminMode.click();
    }
}
