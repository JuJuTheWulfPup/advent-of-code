export class InvalidYearException extends Error {
    constructor(yearArg: string, supportedYearValues: number[], additionalInfo = '') {
        super(`The first parameter (${yearArg}) should be a year.${additionalInfo ? ` ${additionalInfo}` : ''} Supported values: ${supportedYearValues}.`);
    }
}
