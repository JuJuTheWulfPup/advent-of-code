export class InvalidYearException extends Error {
    constructor(yearArg: string, additionalInfo = '') {
        super(`The first parameter (${yearArg}) should be a year. ${additionalInfo}`);
    }
}
