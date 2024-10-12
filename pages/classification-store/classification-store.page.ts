import { expect, Locator, Page } from "@playwright/test";
import { CsKeyTypes } from "../../test-data/classification-store-data";
import { LeftMenu } from "../components/left-menu.component";
import { ClassificationSelectKeyConfig, ClassificationInputKeyConfig, ClassificationMultiselectionKeyConfig, ClassificationNumberKeyConfig } from "../components/classification-key-editor.component";

export class ClassificationStorePage {

    readonly page: Page;
    readonly divX: Locator;
    readonly tabGroups: Locator;
    readonly tabKeyDefinitions: Locator;
    readonly tableResults: Locator;
    readonly addNewObjectOption: Locator;
    readonly leftMenu: LeftMenu;

    constructor(page: Page) {
        this.page = page;
        this.divX = page.locator('td div', { hasText: 'X' });
        this.tabGroups = page.locator('a.x-tab', { hasText: 'Groups' });
        this.tabKeyDefinitions = page.locator('a.x-tab', { hasText: 'Key Definitions' });
        this.tableResults = page.locator('div.x-grid-item-container')
        this.addNewObjectOption = this.page.locator('div.x-grid').getByRole('button', { name: 'Add' });
        this.leftMenu = new LeftMenu(page);
    }

    async openAttributesCS() {
        await this.divX.click();
    }

    async openGroupsTable() {
        await this.tabGroups.click();
        this.page.waitForLoadState('domcontentloaded');
        return new CsGroupsPage(this.page);
    }

    async openKeysTable() {
        await this.tabKeyDefinitions.click();
        this.page.waitForLoadState('domcontentloaded');
        return new CsKeysPage(this.page);
    }

    async assertObjectVisibilityOnCSTable(objectName: string, isVisible: boolean) {

        const searchResultRow = this.tableResults.locator(`text=/${objectName}/`);

        if (isVisible) {
            await expect(searchResultRow).toBeVisible({ timeout: 15000 });
        }
        else {
            await expect(searchResultRow).toBeHidden({ timeout: 10000 });
        }
    }

    async filterObjectsByName(objectName: string) {

        const pathColumnHeader = this.page.getByRole('columnheader', { name: 'Name' }).first();
        await pathColumnHeader.hover();
        const btnDropdown = pathColumnHeader.locator('div.x-column-header-trigger');
        await btnDropdown.click();

        const optionFilter = this.page.getByLabel('Filters submenu');
        const inputSearchBox = this.page.getByPlaceholder('Enter Filter Text...');
        await optionFilter.click();
        await inputSearchBox.click();
        await inputSearchBox.pressSequentially(objectName);
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.locator('div.x-title-text', { hasText: 'Attributes' }).click();
    }
}

export class CsGroupsPage extends ClassificationStorePage {

    constructor(page: Page) {
        super(page);

    }

    async addNewGroup(groupName: string) {

        await this.addNewObjectOption.click();
        const newGroupDialog = this.page.locator('div.x-message-box', { hasText: 'New Group' })
        await newGroupDialog.getByRole('textbox').fill(groupName);
        await newGroupDialog.getByRole('button', { name: 'OK' }).click();
        await this.assertObjectVisibilityOnCSTable(groupName, true);
    }

    async removeGroupFromCSTable(objectName: string) {

        const optionDeleteRecordFromTable = this.tableResults.locator('tr', { hasText: objectName }).locator('img[data-qtip="Remove"]');
        await optionDeleteRecordFromTable.click()

        const messagePopup = this.page.locator('div.x-message-box', { hasText: 'Do you really want to delete Group' });
        const btnConfirmDeleting = messagePopup.getByRole('button', { name: 'Yes' });
        await btnConfirmDeleting.click();
        await this.assertObjectVisibilityOnCSTable(objectName, false);
    }

    async attachKeyToCsGroup(groupName: string, keyName: string) {

        let divGroupsKeysRelations = this.page.locator('div.x-panel').locator('div.x-column-header-inner', { hasText: 'Key ID' });
        let btnAddKey = divGroupsKeysRelations.locator('div.x-toolbar').getByRole('button', { name: 'Add' });
        await btnAddKey.click();

        let attachingKeyWindow = this.page.locator('div.x-window', { hasText: 'Key/Group Search' })
        let searchInput = attachingKeyWindow.getByRole('textbox');

        await searchInput.fill(keyName);
        await this.page.keyboard.press('Enter');

        const firstRowInSearchResults = this.page.getByRole('rowgroup').locator('td', { hasText: keyName }).first();
        await firstRowInSearchResults.dblclick();
    }

    async reloadGroupKeysRelationsTable() {

        let divGroupsKeysRelations = this.page.locator('div.x-panel').locator('div.x-column-header-inner', { hasText: 'Key ID' });
        const bottomToolbar = divGroupsKeysRelations.locator('div.x-toolbar', { hasText: 'Items per page' });
        const btnReload = divGroupsKeysRelations.locator('a[data-qtip="Refresh"]')
        await this.page.waitForLoadState('domcontentloaded');
        return this;
    }

    async createCsGroupIfNotExists(groupName: string) {

        let groupsTable = new CsGroupsPage(this.page);
        let elementVisibility = await this.checkCsGroupVisibility(groupName);
        if (!elementVisibility) {
            await groupsTable.addNewGroup(groupName);
        }
    }

    private async checkCsGroupVisibility(groupName: string) {

        let csPage = await this.leftMenu.goToClassificationStore();
        await csPage.openAttributesCS();
        let groupsTable = await csPage.openGroupsTable();
        await groupsTable.filterObjectsByName(groupName);

        let groupVisibility = this.page.locator('div.x-grid-item-container').locator('tr', { hasText: groupName }).isVisible();
        return groupVisibility;
    }
}

export class CsKeysPage extends ClassificationStorePage {

    constructor(page: Page) {
        super(page);
    }

    async addNewCsKey(keyName: string) {

        await this.addNewObjectOption.click();
        const newKeyDialog = this.page.locator('div.x-message-box', { hasText: 'New Key' })
        await newKeyDialog.getByRole('textbox').fill(keyName);
        await newKeyDialog.getByRole('button', { name: 'OK' }).click();
        await this.assertObjectVisibilityOnCSTable(keyName, true);
    }

    async assertObjectVisibilityOnCSTable(objectName: string, isVisible: boolean) {

        if (isVisible) {
            const searchResultRow = this.tableResults.locator(`text=/${objectName}/`).first();
            await expect(searchResultRow).toBeVisible({ timeout: 15000 });
        }
        else {
            const searchResultRow = this.tableResults.locator(`text=/${objectName}/`).first();
            await expect(searchResultRow).toBeHidden({ timeout: 10000 });
        }
    }

    async assertCsKeyFieldsValues(options:
        {
            csKeyName: string,
            csKeyDescription?: string,
            csKeyType?: string,
        }) {


        if (options.csKeyDescription !== undefined) {

            const inputDescriptionValue = await this.tableResults.locator('tr', { hasText: options.csKeyName }).locator('td').nth(3).locator('div.x-grid-cell-inner').textContent();
            expect.soft(inputDescriptionValue).toBe(options.csKeyDescription);
        }

        if (options.csKeyType !== undefined) {

            const selectedKeyType = await this.tableResults.locator('tr', { hasText: options.csKeyName }).locator('td').nth(4).locator('div.x-grid-cell-inner').textContent();
            expect.soft(selectedKeyType).toBe(options.csKeyType);
        }
    }

    async openKeyEditingConfig(keyName: string) {
        const configOption = this.tableResults.locator('tr', { hasText: keyName }).locator('td').nth(5).getByRole('button');
        let keyTypeValue = await this.tableResults.locator('tr', { hasText: keyName }).locator('td').nth(4).locator('div.x-grid-cell-inner').textContent();

        await configOption.click();

        if (keyTypeValue === 'Select') {
            return new ClassificationSelectKeyConfig(this.page);
        }

        else if (keyTypeValue === 'Input') {
            return new ClassificationInputKeyConfig(this.page);
        }

        else { throw new Error('Cs key has unknown key type') };
    }

    async removeKeyFromCSTable(objectName: string) {

        const optionDeleteRecordFromTable = this.tableResults.locator('tr', { hasText: objectName }).locator('img[data-qtip="Remove"]');
        await optionDeleteRecordFromTable.click()

        const messagePopup = this.page.locator('div.x-message-box', { hasText: 'Do you really want to delete Property' });
        const btnConfirmDeleting = messagePopup.getByRole('button', { name: 'Yes' });
        await btnConfirmDeleting.click();
        await this.assertObjectVisibilityOnCSTable(objectName, false);
    }


    async changeKeyTypeAndOpenConfig(objectName: string, keyType: CsKeyTypes) {
        const tableRecordToEdit = this.tableResults.locator('tr', { hasText: objectName }).locator('td').nth(4);
        await tableRecordToEdit.dblclick();

        const arrowTrigger = tableRecordToEdit.locator('div.x-form-arrow-trigger');
        await arrowTrigger.click();
        await this.page.getByRole('option', { name: keyType, exact: true }).click();
        await this.page.locator('div.x-title-text', { hasText: 'Attributes' }).click();

        if (keyType === 'Select') {
            return new ClassificationSelectKeyConfig(this.page);
        }

        else if (keyType === 'Input') {
            return new ClassificationInputKeyConfig(this.page);
        }

        else if (keyType === 'Multiselection') {
            return new ClassificationMultiselectionKeyConfig(this.page);
        }

        else if (keyType === 'Number') {
            return new ClassificationNumberKeyConfig(this.page);
        }

        else {
            throw new Error('Invalid classification key type');
        }
    }

    async editKeyDescriptionAndOpenConfig(objectName: string, description: string, keyType: CsKeyTypes) {

        const tableRecordToEdit = this.tableResults.locator('tr', { hasText: objectName }).locator('td').nth(3).locator('div.x-grid-cell-inner');
        await tableRecordToEdit.dblclick();
        const descriptionField = this.tableResults.locator('tr', { hasText: objectName }).locator('td').nth(3).locator('div.x-editor');

        let keyDescriptionValue = await tableRecordToEdit.textContent();

        if (keyDescriptionValue !== '') {
            await descriptionField.press('Control+A');
            await descriptionField.press('Delete');
        }

        await descriptionField.type(description);
        await this.page.locator('div.x-title-text', { hasText: 'Attributes' }).click();

        if (keyType === 'Select') {
            return new ClassificationSelectKeyConfig(this.page);
        }

        else if (keyType === 'Input') {
            return new ClassificationInputKeyConfig(this.page);
        }

        else if (keyType === 'Multiselection') {
            return new ClassificationMultiselectionKeyConfig(this.page);
        }

        else if (keyType === 'Number') {
            return new ClassificationNumberKeyConfig(this.page);
        }

        else {
            throw new Error('Invalid classification key type');
        }
    }

    async createCsKeyIfNotExists(keyName: string) {

        let keysTable = new CsKeysPage(this.page);
        let elementVisibility = await this.checkCsKeyVisibility(keyName);
        if (!elementVisibility) {
            await keysTable.addNewCsKey(keyName);
        }
    }

    private async checkCsKeyVisibility(keyName: string) {

        let csPage = await this.leftMenu.goToClassificationStore();
        await csPage.openAttributesCS();
        let keysTable = await csPage.openKeysTable();
        await keysTable.filterObjectsByName(keyName);

        let keyVisibility = this.page.locator('div.x-grid-item-container').locator('tr', { hasText: keyName }).isVisible();
        return keyVisibility;

    }
}