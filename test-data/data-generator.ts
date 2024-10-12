export class DataGenerator {

    static getCurrentDayAndMonth(): string {
        const today = new Date();
        const day = today.getDate().toString().padStart(2, '0');
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        return `${day}${month}`;
    }

    static getRandomNumber(from = 1, to = 100) {
        return Math.floor(from + Math.random() * (to - from));
    }
}