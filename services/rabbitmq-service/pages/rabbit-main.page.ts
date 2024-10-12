import { Page, Locator } from "@playwright/test";
import { expect } from "@playwright/test";
import { RabbitBasePage } from "./rabbit-base.page";
import { x1Queue } from "./brands-queue.page";
import { x2Queue } from "./categories-queue.page";

export class RabbitMainPage extends RabbitBasePage {

    constructor(page: Page) {
        super(page);
    }

    async goToX1Queue() {

        await this.page.goto('https://qa-rabbitmq-mxx.qa.xxxx');
        const header = this.page.locator('h1', { hasText: 'x1' });
        await header.waitFor({ state: 'visible' });
        return new x1Queue(this.page);
    }

    async goToX2Queue() {

        await this.page.goto('https://qa-rabbitmq-mxx.qa.xxxx');
        const header = this.page.locator('h1', { hasText: 'x2' });
        await header.waitFor({ state: 'visible' });
        return new x2Queue(this.page);
    }
}