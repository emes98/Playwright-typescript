import { expect, Locator, Page } from '@playwright/test';
import { PimcoreBasePage } from '../pimcore-base.page';

export class CreationCategoryPage extends PimcoreBasePage {

    readonly input1: Locator;
    readonly select1: Locator;
    readonly input2: Locator;
    readonly input3: Locator;
    readonly input4: Locator;
    readonly divFoto: Locator;
    readonly categoryId: Locator;

    constructor(page: Page) {
        super(page);
        this.input1 = page.getByLabel('Input1 *:');
        this.select1 = page.getByLabel('Input2 *:');
        this.input2 = page.locator('div.x-autocontainer-outerCt').filter({ hasText: 'xxx' }).locator('div.pimcore_editable_wysiwyg').first();
        this.input3 = page.getByLabel('Input3:');
        this.input4 = page.locator('div.x-autocontainer-outerCt').filter({ hasText: 'input4' }).locator('div.pimcore_editable_wysiwyg[contenteditable="true"]');
        this.divFoto = page.locator('div.x-panel').locator('div[data-ref="bodyWrap"]').filter({ has: page.locator('div[role="toolbar"]'), hasText: 'Foto' });
        this.categoryId = page.getByLabel('Category Id:');
    }

    async addX1(x1Name: string) {
        await this.input4.fill(x1Name);
        await this.page.waitForTimeout(5000);
        return this;
    }

    async publishCategory() {
        await this.topBar.publishObject();
        return this;
    }

    async attachAssetToFoto(assetPath: string) {

        await this.clickSearchIconAndOpenAsssetSelector();
        await this.searchAssetToAttach(assetPath);
        const firstRowInSearchResults = this.page.getByRole('rowgroup').locator('td', { hasText: assetPath });
        await firstRowInSearchResults.dblclick();
    }

    async assertCategoryFieldValues(options:
        {
            input1?: string,
            select1?: string,
            input2?: string,
            input4?: string,
            checkFotoAttribute?: boolean
        }) {

        const divForCategoryFoto = this.divFoto.locator('div.pimcore_image_container div.x-autocontainer-innerCt');
        const styleAttribute = await divForCategoryFoto.getAttribute('style');

        if (options.input1 !== undefined) {
            await expect.soft(this.input1).toHaveValue(options.input1);
        }
        if (options.select1 !== undefined) {
            await expect.soft(this.select1).toHaveValue(options.select1);
        }
        if (options.input2 !== undefined) {
            await expect.soft(this.input2).toHaveText(options.input2);
        }
        if (options.input4 !== undefined) {
            await expect.soft(this.input4).toHaveText(options.input4);
        }
        if (options.checkFotoAttribute === true) {
            expect.soft(styleAttribute).toContain('url');
        }
    }

    private async searchAssetToAttach(assetPath: string) {

        const searchingModal = this.page.locator('div.x-window', { hasText: 'Search Assets' });
        const inputSearchBox = searchingModal.locator('input[name="query"][role="textbox"]');
        await inputSearchBox.fill(assetPath);
        await inputSearchBox.press('Enter');
        const alertLoading = this.page.locator('div[aria-valuetext="Loading..."]').first();
        await alertLoading.waitFor({ state: 'hidden' });
    }

    private async clickSearchIconAndOpenAsssetSelector() {

        const searchOption = this.divFoto.getByRole('toolbar').filter({ hasText: 'Foto' }).getByRole('button').last();
        await searchOption.click();
        const searchingModal = this.page.locator('div.x-window', { hasText: 'Search Assets' });
        expect(searchingModal.locator('input[name="query"][role="textbox"]')).toBeEditable();
    }
}