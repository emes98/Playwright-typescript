import { Page, Locator, expect } from "@playwright/test";
import { CreationX23Page } from "../brand-category/brand.page";
import { PimcoreBasePage } from "../pimcore-base.page";
import { DataBase } from "../../services/database-service/database.service";

export class BrandGridPage extends PimcoreBasePage {

    readonly searchBox: Locator;

    constructor(page: Page) {
        super(page);
        this.searchBox = page.locator('input[name="query"]');
    }

    async filterObjectsByPath(objectKey: string) {

        const pathColumnHeader = this.page.locator('div.x-column-header', { hasText: 'Path' });
        await pathColumnHeader.hover();

        const btnDropdown = pathColumnHeader.locator('div.x-column-header-trigger');
        await btnDropdown.click();

        const optionFilter = this.page.getByLabel('Filter submenu');
        const inputSearchBox = this.page.getByPlaceholder('Enter Filter Text...');

        await optionFilter.click();

        const alertLoading = this.page.getByText('Loading...');
        await alertLoading.waitFor({ state: 'hidden' });
        await inputSearchBox.fill(objectKey);
        await inputSearchBox.press('Enter');
        await inputSearchBox.press('Enter');
        await alertLoading.waitFor({ state: 'hidden' });
    }

    async searchObjectFromGrid(value: string) {

        const alertLoading = this.page.locator('div[aria-valuetext="Loading..."]');
        await this.searchBox.fill(value);
        await this.searchBox.press('Enter');
        await alertLoading.waitFor({ state: 'hidden' });
    }

    async openBrandObjectFromGrid(brandKey: string, userIdToRemoveEntry?: string) {

        if (userIdToRemoveEntry !== undefined) {
            await this.removeDbEntryToOpenTheObject(userIdToRemoveEntry);
        }

        await this.searchObjectFromGrid(brandKey);
        const searchResultRow = this.page.locator(`div.x-tabpanel-child div.x-grid-item-container >> text=/.*${brandKey}.*/`);
        await searchResultRow.dblclick();
        const brandPage = new CreationX23Page(this.page);
        expect(this.page.getByText('Input1')).toBeVisible();
        return brandPage;
    }

    async deleteBrandObjectFromGrid(brandKey: string) {

        await this.searchObjectFromGrid(brandKey);
        const searchResultRow = this.page.locator(`div.x-tabpanel-child div.x-grid-item-container >> text=/.*${brandKey}.*/`);
        await searchResultRow.click({ button: 'right', timeout: 2000 });
        await this.page.getByRole('menuitem', { name: 'Delete' }).click();
        await this.popupMessage.handleDeleteConfirmation(true);
        await this.topBar.reloadPage();
        await this.assertBrandObjectVisibilityOnGrid(brandKey, false);
    }

    async assertBrandObjectVisibilityOnGrid(brandKey: string, isVisible: boolean) {

        if (isVisible) {
            await this.searchObjectFromGrid(brandKey);
            const searchResultRow = this.page.locator(`div.x-tabpanel-child div.x-grid-item-container >> text=/.*${brandKey}.*/`);
            await expect(searchResultRow).toBeVisible();
        }
        else {
            await this.searchObjectFromGrid(brandKey);
            const searchResultRow = this.page.locator(`div.x-tabpanel-child div.x-grid-item-container >> text=/.*${brandKey}.*/`);
            await expect(searchResultRow).toBeHidden();
        }
    }

    private async removeDbEntryToOpenTheObject(userId: string) {
        const db = new DataBase();
        await db.connect();
        await db.removeUserLogs(userId);
        await db.disconnect();
    }
}