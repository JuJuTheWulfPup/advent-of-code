/* eslint-disable @typescript-eslint/no-explicit-any */
export type TwoSolutions = { partOne: number; partTwo: number };

export interface Solution {
    parseLinesToModels(inputLines: string[]): any;
    get(models: any): TwoSolutions;
}
