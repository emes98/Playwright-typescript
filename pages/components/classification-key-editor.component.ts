import { Locator, Page } from "playwright/test";
import { ClassificationStorePage } from "../classification-store/classification-store.page";
import { LeftMenu } from "./left-menu.component";

export class BaseClassificationKeyConfig {

    readonly page: Page;
    readonly configModal: Locator;
    readonly btnCancelEditing: Locator;
    readonly btnApply: Locator;

    constructor(page: Page) {
        this.page = page;
        this.configModal = page.locator('div', { hasText: 'Detailed Config' }).filter({ has: page.getByLabel('Name:', { exact: true }) });
        this.btnCancelEditing = this.configModal.getByRole('button', { name: 'Cancel', exact: true });
        this.btnApply = this.configModal.getByRole('button', { name: 'Apply', exact: true });
    }

    async confirmChangesAndCloseEditingConfig() {
        await this.btnApply.click();
        return new ClassificationStorePage(this.page);
    }

    async cancelEditingAndCloseConfig() {
        await this.btnCancelEditing.click();
        return new ClassificationStorePage(this.page);
    }
}

export class ClassificationInputKeyConfig extends BaseClassificationKeyConfig {

    constructor(page: Page) {
        super(page);
    }
}

export class ClassificationSelectKeyConfig extends BaseClassificationKeyConfig {

    constructor(page: Page) {
        super(page);
    }

    async addSelectKeyDictionaryOption(displayName: string, value: string) {

        const btnAddDictionaryOption = this.configModal.getByRole('toolbar', { name: 'Selection Options', exact: true }).getByRole('button'
        ).first();

        await btnAddDictionaryOption.click();
    }
}

export class ClassificationMultiselectionKeyConfig extends BaseClassificationKeyConfig {

    constructor(page: Page) {
        super(page);
    }


    async addMultiSelectKeyDictionaryOption(displayName: string, valueName?: string) {

        const btnAddDictionaryOption = this.configModal.locator('div', { hasText: 'Selection Options' }).getByRole('button').first();
        await btnAddDictionaryOption.click();


        let emptyRow = this.page.locator('div.x-panel-bodyWrap', { hasText: 'Selection Options' }).locator('tr[aria-selected="true"]');
        let displayNameTd = emptyRow.locator('td.x-grid-cell').first();
        let valueTd = emptyRow.locator('td.x-grid-cell').nth(1);

        await displayNameTd.click();
        await this.page.keyboard.type(displayName);
    }
}

export class ClassificationNumberKeyConfig extends BaseClassificationKeyConfig {

    constructor(page: Page) {
        super(page);
    }
}