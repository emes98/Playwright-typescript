import { DataGenerator } from './data-generator';

export class ClassificationStoreData {

    readonly groupName: string;
    readonly groupDescription: string;
    readonly keyInputName: string;
    readonly keySelectName: string;
    readonly keyMultiselectName: string;
    readonly keyNumberName: string;
    readonly keyWysiwigName: string;
    readonly keyQuantityValueName: string;
    readonly keyDescription: string;

    constructor() {
        this.groupName = this.getRandomGroupName();
        this.groupDescription = 'TestDescAuto';
        this.keyInputName = this.getRandomInputKeyName();
        this.keySelectName = this.getRandomSelectKeyName();
        this.keyMultiselectName = this.getRandomMultiselectKeyName();
        this.keyNumberName = this.getRandomNumberKeyName();
        this.keyWysiwigName = this.getRandomWysiwygKeyName();
        this.keyQuantityValueName = this.getRandomQuantityValueKeyName();
        this.keyDescription = 'TestDescAuto';
    }

    getRandomGroupName(): string {
        return `TestGroup-${DataGenerator.getRandomNumber(1, 10001)}`;
    }

    getRandomInputKeyName(): string {
        return `TestInputKey-${DataGenerator.getRandomNumber(1, 10001)}`;
    }

    getRandomSelectKeyName(): string {
        return `TestSelectKey-${DataGenerator.getRandomNumber(1, 10001)}`;
    }

    getRandomMultiselectKeyName(): string {
        return `TestMultiselectKey-${DataGenerator.getRandomNumber(1, 10001)}`;
    }

    getRandomNumberKeyName(): string {
        return `TestNumberKey-${DataGenerator.getRandomNumber(1, 10001)}`;
    }

    getRandomWysiwygKeyName(): string {
        return `TestWysiwygKey-${DataGenerator.getRandomNumber(1, 10001)}`;
    }

    getRandomQuantityValueKeyName(): string {
        return `TestQuantityVKey-${DataGenerator.getRandomNumber(1, 10001)}`;
    }
}

export enum CsKeyTypes {
    Input = "Input",
    QuantityValue = "quantityValue",
    Select = "Select",
    Multiselect = "Multiselection",
    Number = "Number"
}