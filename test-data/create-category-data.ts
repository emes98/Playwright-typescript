import { DataGenerator } from './data-generator';

export class CreateCategoryData {

    readonly id: string;
    readonly x1: string;
    readonly x2: string;
    readonly x3: string;
    readonly x4: string;
    readonly x5: string;
    readonly image: string;
    readonly x6: string;
    readonly x7: string;

    constructor(technicalGroup: string) {
        this.id = this.getRandomIdNumber();
        this.x1 = 'A1-X'
        this.x2 = technicalGroup;
        this.x3 = 'Test description';
        this.x4 = this.getRandomCategoryX4();
        this.x5 = 'Test x5';
        this.image = 'testxxx.jpg';
        this.x6 = '0000000';
        this.x7 = this.getRandomCategoryX7();
    }

    getRandomIdNumber(): string {
        return `${DataGenerator.getRandomNumber(1, 1000001)}`;
    }

    getRandomCategoryX7(): string {
        return `${this.id}-${this.x1}`;
    }

    getRandomCategoryX4(): string {
        return `${this.id}-${this.x1}`;
    }
}