import { Page } from "@playwright/test";
import { SideBar } from "./components/side-bar.component";
import { TopBar } from "./components/top-bar.component";
import { LeftMenu } from "./components/left-menu.component";
import { PopupMessages } from "./components/popup-messages.component";

export class PimcoreBasePage {

    readonly page: Page;
    readonly sideBar: SideBar;
    readonly topBar: TopBar;
    readonly leftMenu: LeftMenu;
    readonly popupMessage: PopupMessages;

    constructor(page: Page) {
        this.page = page;
        this.sideBar = new SideBar(page);
        this.topBar = new TopBar(page);
        this.leftMenu = new LeftMenu(page);
        this.popupMessage = new PopupMessages(page);
    }
}