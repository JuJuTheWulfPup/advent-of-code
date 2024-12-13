/* eslint-disable @typescript-eslint/no-explicit-any */
export type TwoSolutions = { partOne: number | BigInt; partTwo: number | BigInt };

export interface Solution {
    parseLinesToModels(inputLines: string[]): any;
    get(models: any): TwoSolutions;
}
