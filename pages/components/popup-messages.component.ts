import { Page, Locator, expect } from "@playwright/test";

export class PopupMessages {

    readonly page: Page;
    readonly conflictAlertPopup: Locator;
    readonly unsavedChangesWarningPopup: Locator;
    readonly savedSuccessfullyMessage: Locator;
    readonly validationErrorMessage: Locator;
    readonly deleteConfirmationPopup: Locator;

    constructor(page: Page) {
        this.page = page;
        this.conflictAlertPopup = page.getByRole('alertdialog').filter({ hasText: 'The desired element is currently opened by another person:' });
        this.unsavedChangesWarningPopup = page.getByRole('alertdialog').filter({ hasText: 'All unsaved changes will be lost, are you really sure?' });
        this.savedSuccessfullyMessage = page.locator('div[data-ref="innerCt"]:has-text("Saved successfully!")');
        this.validationErrorMessage = this.page.locator('div[role="dialog"]', { hasText: 'Validation Failed!' });
        this.deleteConfirmationPopup = page.getByRole('alertdialog').filter({ hasText: 'Do you really want to delete this item?' });
    }

    async handleConflictAlertIfExists(shouldOpenDesiredObject: boolean) {

        try {
            if (await this.isConflictAlertPopupDisplayed()) {
                if (shouldOpenDesiredObject) {
                    await this.conflictAlertPopup.getByRole('button', { name: 'Yes', exact: true }).click();
                }
                else {
                    await this.conflictAlertPopup.getByRole('button', { name: 'No', exact: true }).click();
                }
                await expect(this.conflictAlertPopup).not.toBeVisible();
            }
        }
        catch (error) { };
    }

    async handleUnsavedChanges(shouldConfirm: boolean) {

        try {
            if (await this.isUnsavedChangesWarningPopupDisplayed()) {
                if (shouldConfirm) {
                    await this.unsavedChangesWarningPopup.getByRole('button', { name: 'Yes', exact: true }).click();
                }
                else {
                    await this.unsavedChangesWarningPopup.getByRole('button', { name: 'No', exact: true }).click();
                }
                await expect(this.unsavedChangesWarningPopup).not.toBeVisible();
            }
        }
        catch (error) { };
    }

    async handleDeleteConfirmation(shouldConfirm: boolean) {

        try {
            if (await this.isDeleteConfirmationPopupDisplayed()) {
                if (shouldConfirm) {
                    await this.deleteConfirmationPopup.getByRole('button', { name: 'OK', exact: true }).click();
                }
                else {
                    await this.deleteConfirmationPopup.getByRole('button', { name: 'Cancel', exact: true }).click();
                }
                await expect(this.deleteConfirmationPopup).not.toBeVisible();
            }
        }
        catch (error) {
            console.error('An error occurred while handling the delete confirmation:', error);
        };
    }


    async assertObjectSavedSuccessfully() {
        await expect(this.savedSuccessfullyMessage).toBeVisible({ timeout: 60000 });
        await expect(this.validationErrorMessage).not.toBeVisible({ timeout: 15000 });
    }

    private async isUnsavedChangesWarningPopupDisplayed() {

        console.log(this.unsavedChangesWarningPopup.isVisible());
        return await this.unsavedChangesWarningPopup.isVisible();
    }

    private async isConflictAlertPopupDisplayed() {

        await this.page.waitForLoadState('networkidle');
        console.log('Alert:' + this.conflictAlertPopup.isVisible());
        return await this.conflictAlertPopup.isVisible();
    }

    private async isDeleteConfirmationPopupDisplayed() {
        try {
            await this.deleteConfirmationPopup.waitFor({ state: 'visible' });
            return await this.deleteConfirmationPopup.isVisible();
        } catch (error) {
            return false;
        }
    }
}