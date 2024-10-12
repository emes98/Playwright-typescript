import { Page } from "@playwright/test";
import { SideBar } from "./components/side-bar.component";
import { LeftMenu } from "./components/left-menu.component";

export class PimcoreMainPage {

    readonly page: Page
    readonly sideBar: SideBar;
    readonly leftMenu: LeftMenu;

    constructor(page: Page) {
        this.page = page;
        this.sideBar = new SideBar(page);
        this.leftMenu = new LeftMenu(page);
    }
}