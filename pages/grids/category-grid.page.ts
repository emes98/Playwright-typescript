import { Page, Locator, expect } from "@playwright/test";
import { PimcoreBasePage } from "../pimcore-base.page";
import { CreationCategoryPage } from "../brand-category/category.page";
import { DataBase } from "../../services/database-service/database.service";

export class CategoryGridPage extends PimcoreBasePage {

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
        await alertLoading.waitFor({ state: 'hidden' });
    }

    async searchObjectFromGrid(value: string) {

        const alertLoading = this.page.locator('div[aria-valuetext="Loading..."]');
        await this.searchBox.fill(value);
        await this.searchBox.press('Enter');
        await alertLoading.waitFor({ state: 'hidden' });
    }

    async openCategoryObjectFromGrid(categoryKey: string, userIdToRemoveEntry?: string) {

        if (userIdToRemoveEntry !== undefined) {
            await this.removeDbEntryToOpenTheObject(userIdToRemoveEntry);
        }

        await this.searchObjectFromGrid(categoryKey);
        const searchResultRow = this.page.locator(`div.x-tabpanel-child div.x-grid-item-container >> text=/.*${categoryKey}.*/`);
        await searchResultRow.dblclick();

        const categoryPage = new CreationCategoryPage(this.page);
        await expect(this.page.getByLabel('Input1 *:')).toBeVisible({ timeout: 15000 });
        return categoryPage;
    }

    async assertCategoryObjectVisibilityOnGrid(categoryKey: string, isVisible: boolean) {

        if (isVisible) {
            await this.searchObjectFromGrid(categoryKey);
            const searchResultRow = this.page.locator(`div.x-tabpanel-child div.x-grid-item-container >> text=/.*${categoryKey}.*/`);
            await expect(searchResultRow).toBeVisible();
        }
        else {
            await this.searchObjectFromGrid(categoryKey);
            const searchResultRow = this.page.locator(`div.x-tabpanel-child div.x-grid-item-container >> text=/.*${categoryKey}.*/`);
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