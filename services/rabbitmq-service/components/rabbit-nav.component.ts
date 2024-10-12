import { Page, Locator } from "@playwright/test";
import { expect } from "@playwright/test";

export class RabbitNavigationPage {

    readonly page: Page;
    readonly navBar: Locator;
    readonly navQueuesAndStreams: Locator;

    constructor(page: Page) {
        this.page = page;
        this.navBar = page.locator('ul#tabs')
        this.navQueuesAndStreams = this.navBar.locator('#queues-and-streams > a');
    }

    async goToQueues() {
        await this.navQueuesAndStreams.click();
        await this.page.waitForLoadState('networkidle');
        expect(this.page.locator('h1', { hasText: 'Queues' })).toBeVisible();

        // dynamic import to prevent circular dependency
        const { Queues } = await import('../pages/rabbit-queues.page');
        return new Queues(this.page);
    }
}