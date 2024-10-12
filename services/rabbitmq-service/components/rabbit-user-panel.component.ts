import { Page, Locator } from "@playwright/test";
import { expect } from "@playwright/test";
import { VirtualHostName } from "../virtual-host-name-enum";

export class RabbitUserPanel {

    readonly page: Page;
    readonly inputLogout: Locator;
    readonly selectVirtualHost: Locator;

    constructor(page: Page) {
        this.page = page;
        this.inputLogout = page.locator('input[value="Log out"]');
        this.selectVirtualHost = page.locator('select#show-vhost');
    }

    async setVirtualHost(virtualHostName: VirtualHostName) {

        await this.page.getByLabel('Virtual host').selectOption(virtualHostName);
        await this.page.waitForTimeout(10000);
    }

    async logout() {
        await this.inputLogout.click();
    }

}