export class InvalidDayException extends Error {
    constructor(dayArg: string, additionalInfo = '') {
        super(`The second parameter (${dayArg}) is optional and should be a day. ${additionalInfo}`);
    }
}
