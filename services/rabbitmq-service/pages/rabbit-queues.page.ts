import { Locator, Page } from "@playwright/test";
import { RabbitBasePage } from "./rabbit-base.page";

export class Queues extends RabbitBasePage {

    readonly availableQueuesTable: Locator;
    readonly x1Queue: Locator;

    constructor(page: Page) {
        super(page);
        this.availableQueuesTable = page.locator('table.list').filter({ hasText: 'Overview' });
        this.x1Queue = this.availableQueuesTable.locator('td').getByRole('link', { name: 'x4', exact: true });
    }
}