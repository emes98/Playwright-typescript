import { Locator, Page, expect } from '@playwright/test';
import { CreationX23Page } from '../brand-category/brand.page';
import { BrandGridPage } from '../grids/brand-grid.page';
import { CreationCategoryPage } from '../brand-category/category.page';
import { CategoryGridPage } from '../grids/category-grid.page';

export class SideBar {

  readonly page: Page;
  readonly dataObjectsTab: Locator;
  readonly folderBrands: Locator;

  constructor(page: Page) {

    this.page = page;
    this.dataObjectsTab = page.locator('#dataObjects');
    this.folderBrands = page.getByRole('rowgroup').locator('span.x-tree-node-text').filter({ hasText: /^Brands$/ });
  }

  async goToCreationNewBrandPage(brandName: string) {

    await this.rightClickOnFolderByName('Brands');
    await this.addNewObjectOption('Brand');
    await this.fillAndConfirmNewObjectName(brandName);

    await expect(this.page.getByLabel('Input1 *:')).toBeVisible();
    return new CreationX23Page(this.page);
  }

  async goToCreationNewCategoryPage(categoryName: string) {

    await this.rightClickOnFolderByName('Categories');
    await this.addNewObjectOption('Category');
    await this.fillAndConfirmNewObjectName(categoryName);

    await expect(this.page.getByLabel('Input1 *:')).toBeVisible();
    return new CreationCategoryPage(this.page);
  }

  async rightClickOnFolderByName(folderName: string) {
    const folderLocator = this.page.getByRole('row').locator('span.x-tree-node-text').filter({ hasText: folderName });
    await folderLocator.click({ button: 'right' });
  }

  async addNewObjectOption(objectType: string) {

    await this.page.getByRole('menuitem', { name: 'Add Object' }).click();
    await this.page.getByRole('menuitem', { name: new RegExp(`^${objectType}$`) }).click();
  }

  async fillAndConfirmNewObjectName(objectName: string) {

    await this.page.getByRole('textbox', { name: 'Enter the name of the new item' }).fill(objectName);
    await this.page.getByRole('button', { name: 'OK' }).click();
  }

  async openBrandGridPage() {
    const folderRow = this.page.getByRole('row').locator('span.x-tree-node-text').filter({ hasText: 'Brands' });
    await folderRow.click();
    const gridPage = new BrandGridPage(this.page);
    await gridPage.searchBox.waitFor({ state: 'visible' });
    return new BrandGridPage(this.page);
  }

  async openCategoryGridPage() {
    const folderRow = this.page.getByRole('row').locator('span.x-tree-node-text').filter({ hasText: 'Categories' });
    await folderRow.click();
    const categoryPage = new CategoryGridPage(this.page);
    await categoryPage.searchBox.waitFor({ state: 'visible' });
    return new CategoryGridPage(this.page);
  }

  async expandDataObjectsTab() {
    await this.dataObjectsTab.click();
  }

  private async isDataObjectsTabExpanded() {
    try {
      await expect(this.folderBrands).toBeVisible();
      return true;
    } catch (e) {
      return false;
    }
  }
}
