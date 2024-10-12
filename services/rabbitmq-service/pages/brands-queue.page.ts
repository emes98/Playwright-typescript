import { Page, Locator } from "@playwright/test";
import { expect } from "@playwright/test";
import { RabbitBasePage } from "./rabbit-base.page";

export class x1Queue extends RabbitBasePage {

    readonly txtAreaPayload: Locator;
    readonly btnPublishMessage: Locator;
    readonly popupMessagePublished: Locator;

    constructor(page: Page) {
        super(page);
        this.txtAreaPayload = page.locator('textarea[name="payload"]');
        this.btnPublishMessage = page.locator('input[value="Publish message"]');
        this.popupMessagePublished = page.locator('div.form-popup-info', { hasText: 'Message published.' });
    }

    async sendDeleteBrandMessage(brandX: string) {

        const deletionMessage = this.createDeleteBrandMessage(brandX);
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

    async sendCreateNewBrandMessage(brandX: string) {


        const creationMessage = this.createNewBrandMessage(brandX);
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

    private createDeleteBrandMessage(xxx4: string) {
        let brandDeletionMessage =
        {
            header: {
                type: "xxx",
            },
            payload: {
                xxx: {
                    xxx: xxx4
                }
            }
        };
        return brandDeletionMessage;
    }

    private createNewBrandMessage(xxx3: string) {
        let brandCreationMessage =
        {
            header: {
                type: "xxx",
            },
            payload: {
                xxx: {
                    xxx: xxx3
                }
            }
        };
        return brandCreationMessage;
    }
}