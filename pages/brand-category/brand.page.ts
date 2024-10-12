import { expect, Locator, Page } from '@playwright/test';
import { SideBar } from '../components/side-bar.component';
import { TopBar } from '../components/top-bar.component';
import { PimcoreBasePage } from '../pimcore-base.page';

export class CreationX23Page extends PimcoreBasePage {

  readonly input1: Locator;
  readonly input2: Locator;
  readonly input3: Locator;
  readonly input4: Locator;
  readonly divPhoto: Locator;

  constructor(page: Page) {

    super(page);
    this.input1 = page.getByLabel('Input 1 *:');
    this.input2 = page.getByLabel('Input2 Name:');
    this.input3 = page.getByLabel('Input desc:');
    this.input4 = page.getByLabel('Input4:');
    this.divPhoto = page.locator('div.x1').locator('div[data-ref="x1"]').filter({ has: page.locator('div[role="x1"]'), hasText: 'Photo' });
  }

  async addInput1Name(inputName: string) {
    await this.input1.fill(inputName);
    return this;
  }

  async addInput2Name(inputName: string) {
    await this.input2.fill(inputName);
    return this;
  }

  async addInput3DescriptionName(inputDescription: string) {
    await this.input3.fill(inputDescription);
    return this;
  }

  async addInput4(inputName: string) {
    await this.input4.fill(inputName);
    return this;
  }

  async publishObject() {
    await this.topBar.publishObject();
    return this;
  }

  async attachFotoToLogo(fotoPath: string) {
    await this.openSearchViaContextMenu();
    await this.searchFotoToAttach(fotoPath);
    const firstRowInSearchResults = this.page.getByRole('rowgroup').locator('td', { hasText: fotoPath });
    await firstRowInSearchResults.dblclick();
  }

  async assertBrandFieldValues(input1: string, input2: string, input3: string, input4: string) {

    const divForImageLogo = this.divPhoto.locator('div.pimcore_image_container div.x-autocontainer-innerCt');
    const styleAttribute = await divForImageLogo.getAttribute('style');

    await expect(this.input1).toHaveValue(input1);
    await expect(this.input2).toHaveValue(input2);
    await expect(this.input3).toHaveValue(input3);
    await expect(this.input4).toHaveValue(input4);
    expect(styleAttribute).toContain('url');
  }

  private async searchFotoToAttach(assetPath: string) {

    const inputSearchBox = this.page.locator('input[name="xxx"][role="textbox"]');
    await inputSearchBox.fill(assetPath);
    await inputSearchBox.press('Enter');
    const alertLoading = this.page.locator('div[aria-valuetext="Loading..."]');
    await alertLoading.waitFor({ state: 'hidden' });
  }

  private async openSearchViaContextMenu() {

    const contextMenu = this.divPhoto.getByRole('toolbar').filter({ hasText: 'X-logo' }).getByRole('button').nth(1);
    const contextMenuSearchOption = this.page.getByRole('menuitem', { name: 'Search' });
    await contextMenu.click();
    await contextMenuSearchOption.click();
  }
}
