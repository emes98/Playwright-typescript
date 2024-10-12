import { DataGenerator } from './data-generator';

export class CreateBrandData {

    readonly x1: string;
    readonly x2: string;
    readonly x3: string;
    readonly x4: string;
    readonly x5: string;
    readonly xLogoPath: string;

    constructor() {
        this.x1 = this.getRandomBrandX1();
        this.x2 = this.getRandomBrandX2();
        this.x3 = this.getRandomBrandX3();
        this.x4 = 'Test x description';
        this.x5 = 'Test x';
        this.xLogoPath = '/xxx.jpg';
    }

    getDataToCreate() {
        return new CreateBrandData();
    }

    getRandomBrandX1(): string {
        return `A1-x${DataGenerator.getCurrentDayAndMonth()}${DataGenerator.getRandomNumber()}`;
    }

    getRandomBrandX2(): string {
        return `Test x2-${DataGenerator.getCurrentDayAndMonth()}${DataGenerator.getRandomNumber()}`;
    }

    getRandomBrandX3(): string {
        return `Test x3-${DataGenerator.getCurrentDayAndMonth()}${DataGenerator.getRandomNumber()}`;
    }
}