import { Page, Locator } from "@playwright/test";
import { expect } from "@playwright/test";
import { RabbitBasePage } from "./rabbit-base.page";

export class x2Queue extends RabbitBasePage {

    readonly txtAreaPayload: Locator;
    readonly btnPublishMessage: Locator;
    readonly popupMessagePublished: Locator;

    constructor(page: Page) {
        super(page);
        this.txtAreaPayload = page.locator('textarea[name="payload"]');
        this.btnPublishMessage = page.locator('input[value="Publish message"]');
        this.popupMessagePublished = page.locator('div.form-popup-info', { hasText: 'Message published.' });
    }

    async sendCreateNewCategoryMessage(name: string, categoryId: string, parentId: string, technicalGroup: string, description: string) {

        const creationMessage = this.createNewCategoryMessage(name, categoryId, parentId, technicalGroup, description);
        const jsonToSend = JSON.stringify(creationMessage);
        const headerLocator = this.page.locator('div.section-hidden.section-invisible h2:has-text("Publish message")');

        // Expand publish section if it is collapsed
        if (await headerLocator.count() > 0) {
            await headerLocator.click();
        }

        await this.txtAreaPayload.waitFor({ state: 'visible' });
        await this.txtAreaPayload.click();
        await this.txtAreaPayload.fill(jsonToSend);
        await this.btnPublishMessage.click();
        await expect(this.popupMessagePublished).toBeVisible();
        return this;
    }

    async sendUpdateCategoryMessage(name1: string, x2: string, x3: string, x4: string, x5: string) {

        const updateMessage = this.createUpdateCategoryMessage(name1, x2, x3, x4, x5);
        const jsonToSend = JSON.stringify(updateMessage);
        const headerLocator = this.page.locator('div.section-hidden.section-invisible h2:has-text("Publish message")');

        // Expand publish section if it is collapsed
        if (await headerLocator.count() > 0) {
            await headerLocator.click();
        }

        await this.txtAreaPayload.waitFor({ state: 'visible' });
        await this.txtAreaPayload.click();
        await this.txtAreaPayload.fill(jsonToSend);
        await this.btnPublishMessage.click();
        await expect(this.popupMessagePublished).toBeVisible();
        return this;
    }

    async sendDeleteCategoryMessage(categoryId: string) {

        const deletionMessage = this.createDeleteCategoryMessage(categoryId);
        const jsonToSend = JSON.stringify(deletionMessage);
        const headerLocator = this.page.locator('div.section-hidden.section-invisible h2:has-text("Publish message")');

        // Expand publish section if it is collapsed
        if (await headerLocator.count() > 0) {
            await headerLocator.click();
        }

        await this.txtAreaPayload.waitFor({ state: 'visible' });
        await this.txtAreaPayload.fill(jsonToSend);
        await this.btnPublishMessage.click();
        await expect(this.popupMessagePublished).toBeVisible();
        return this;
    }

    private createNewCategoryMessage(x1: string, x2: string, x3: string, x4: string, x5: string) {
        let categoryCreationMessage =
        {
            header: {
                type: "xxx",
            },
            payload: {
                object: {
                    xxx: x1,
                    xxx2: x2,
                    xxx3: x3,
                    xxx4: x4,
                    xxx5: x5,
                }
            }
        }
        return categoryCreationMessage;
    }

    private createUpdateCategoryMessage(x1: string, x2: string, x3: string, x4: string, x5: string) {
        let categoryUpdatingMessage =
        {
            header: {
                type: "xxx",
            },
            payload: {
                object: {
                    xx1: x1,
                    xx2: x2,
                    xx3: x3,
                    xx4: x4,
                    xx5: x5,
                }
            }
        }
        return categoryUpdatingMessage;
    }

    private createDeleteCategoryMessage(xxx5: string) {
        let categoryDeletionMessage =
        {
            header: {
                type: "xxx",
            },
            payload: {
                xxx: {
                    xxx: xxx5
                }
            }
        };
        return categoryDeletionMessage;
    }
}