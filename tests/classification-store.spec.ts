import test, { expect } from "@playwright/test";
import { LoginPage } from "../pages/login.page";
import { ClassificationStoreData } from "../test-data/classification-store-data";
import { loginPIMUserStandard, loginPIMUserAdmin } from "../test-data/login.data";
import { LeftMenu } from "../pages/components/left-menu.component";
import { CsKeyTypes } from "../test-data/classification-store-data";
import { ClassificationStorePage } from "../pages/classification-store/classification-store.page";
import { ClassificationMultiselectionKeyConfig } from "../pages/components/classification-key-editor.component";

test.describe('Create new classification key', () => {

    let csData: ClassificationStoreData;
    let loginPimcorePage: LoginPage;
    let leftMenu: LeftMenu;
    let csPage: ClassificationStorePage;
    let keysTable: ClassificationStoreData;

    const userStandardId = loginPIMUserStandard.user_Id;
    const userAdminId = loginPIMUserAdmin.user_Id;

    test.beforeEach(async ({ page }) => {

        csData = new ClassificationStoreData();
        loginPimcorePage = new LoginPage(page);
        leftMenu = new LeftMenu(page);

        let mainPage = await loginPimcorePage.userAdminLogin(page);
        csPage = await mainPage.leftMenu.goToClassificationStore();
        await csPage.openAttributesCS();
    })

    test.afterEach(async ({ page }) => {

        await leftMenu.logout();
    })

    test('Should create new cs keys with different types', async ({ page }) => {

        // Add new Input key and add the description 
        let keysTable = await csPage.openKeysTable();
        await keysTable.addNewCsKey(csData.keyInputName);

        let editingConfig = await keysTable.editKeyDescriptionAndOpenConfig(csData.keyInputName, csData.keyDescription, CsKeyTypes.Input);
        await editingConfig.cancelEditingAndCloseConfig();

        // Add new Select key and add the description 
        await keysTable.addNewCsKey(csData.keySelectName);
        editingConfig = await keysTable.changeKeyTypeAndOpenConfig(csData.keySelectName, CsKeyTypes.Select);
        await editingConfig.cancelEditingAndCloseConfig();
        editingConfig = await keysTable.editKeyDescriptionAndOpenConfig(csData.keySelectName, csData.keyDescription, CsKeyTypes.Select);
        await editingConfig.cancelEditingAndCloseConfig();

        // Add new Multiselection key and add the description 
        await keysTable.addNewCsKey(csData.keyMultiselectName);
        editingConfig = await keysTable.changeKeyTypeAndOpenConfig(csData.keyMultiselectName, CsKeyTypes.Multiselect);
        await editingConfig.cancelEditingAndCloseConfig();
        editingConfig = await keysTable.editKeyDescriptionAndOpenConfig(csData.keyMultiselectName, csData.keyDescription, CsKeyTypes.Multiselect);
        await editingConfig.cancelEditingAndCloseConfig();

        // Add new Number key and add the description 
        await keysTable.addNewCsKey(csData.keyNumberName);
        editingConfig = await keysTable.changeKeyTypeAndOpenConfig(csData.keyNumberName, CsKeyTypes.Number);
        await editingConfig.cancelEditingAndCloseConfig();
        editingConfig = await keysTable.editKeyDescriptionAndOpenConfig(csData.keyNumberName, csData.keyDescription, CsKeyTypes.Number);
        await editingConfig.cancelEditingAndCloseConfig();

        //Assert that keys are displayed in cs table and has correnct data. After that delete each of them. 
        await keysTable.filterObjectsByName(csData.keyInputName);
        await keysTable.assertCsKeyFieldsValues({ csKeyName: csData.keyInputName, csKeyDescription: csData.keyDescription, csKeyType: CsKeyTypes.Input });
        await keysTable.removeKeyFromCSTable(csData.keyInputName);

        await keysTable.filterObjectsByName(csData.keySelectName);
        await keysTable.assertCsKeyFieldsValues({ csKeyName: csData.keySelectName, csKeyDescription: csData.keyDescription, csKeyType: CsKeyTypes.Select });
        await keysTable.removeKeyFromCSTable(csData.keySelectName);

        await keysTable.filterObjectsByName(csData.keyMultiselectName);
        await keysTable.assertCsKeyFieldsValues({ csKeyName: csData.keyMultiselectName, csKeyDescription: csData.keyDescription, csKeyType: CsKeyTypes.Multiselect });
        await keysTable.removeKeyFromCSTable(csData.keyMultiselectName);

        await keysTable.filterObjectsByName(csData.keyNumberName);
        await keysTable.assertCsKeyFieldsValues({ csKeyName: csData.keyNumberName, csKeyDescription: csData.keyDescription, csKeyType: CsKeyTypes.Number });
        await keysTable.removeKeyFromCSTable(csData.keyNumberName);

    })

    test('Should assign cs keys to technical group', async ({ page }) => {

        let inputKeyName1 = csData.keyInputName;
        let inputKeyName2 = `${csData.keyInputName}2`;

        console.log(inputKeyName2);

        // Add new Input keys and
        let keysTable = await csPage.openKeysTable();
        await keysTable.addNewCsKey(inputKeyName1);
        await keysTable.addNewCsKey(inputKeyName2);

        // Add new Cs group and attach new keys to it
        let groupsTable = await keysTable.openGroupsTable();
        await groupsTable.addNewGroup(csData.groupName);
        await groupsTable.attachKeyToCsGroup(csData.groupName, inputKeyName1);
        await groupsTable.attachKeyToCsGroup(csData.groupName, inputKeyName2);

        keysTable = await groupsTable.openKeysTable();
        await keysTable.filterObjectsByName(inputKeyName1);
        await keysTable.removeKeyFromCSTable(inputKeyName1);
        await keysTable.filterObjectsByName(inputKeyName2);
        await keysTable.removeKeyFromCSTable(inputKeyName2);

        groupsTable = await keysTable.openGroupsTable();
        await groupsTable.filterObjectsByName(csData.groupName);
        await groupsTable.removeGroupFromCSTable(csData.groupName);
    })


    test('Should edit cs key dictinaries values', async ({ page }) => {

        // Add new Multiselect type and attach dictionary options to it
        let keysTable = await csPage.openKeysTable();
        await keysTable.addNewCsKey(csData.keyMultiselectName);
        let editingConfig = await keysTable.changeKeyTypeAndOpenConfig(csData.keyMultiselectName, CsKeyTypes.Multiselect);

        if (editingConfig instanceof ClassificationMultiselectionKeyConfig) {
            await editingConfig.addMultiSelectKeyDictionaryOption('Multiselect option1', 'option1');
            await editingConfig.addMultiSelectKeyDictionaryOption('Multiselect option2', 'option2');
        } else {
            throw new Error('ClassificationMultiselectionKeyConfig instance expected');
        }

        await editingConfig.confirmChangesAndCloseEditingConfig();
        await keysTable.filterObjectsByName(csData.keyMultiselectName);
        await keysTable.removeKeyFromCSTable(csData.keyMultiselectName);
    })
})