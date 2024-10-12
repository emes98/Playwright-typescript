import { Page, Locator } from "@playwright/test";
import { RabbitUserPanel } from "../components/rabbit-user-panel.component";
import { RabbitNavigationPage } from "../components/rabbit-nav.component";
export class RabbitBasePage {

    readonly page: Page;
    readonly navigationMenu: RabbitNavigationPage;
    readonly userPanel: RabbitUserPanel;

    constructor(page: Page) {
        this.page = page;
        this.navigationMenu = new RabbitNavigationPage(page);
        this.userPanel = new RabbitUserPanel(page);
    }
}