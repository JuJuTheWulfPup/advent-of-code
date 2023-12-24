export const SOLUTIONS_PATH = './src/solutions';
export const INPUT_PATH = './src/inputs';
export function YEAR_SOLUTIONS_PATH(year: number): string { return `${SOLUTIONS_PATH}/${year}`; }
export function YEAR_EXAMPLE_INPUTS_PATH(year: number): string { return `${INPUT_PATH}/${year}/example`; }
export function YEAR_INPUTS_PATH(year: number): string { return `${INPUT_PATH}/${year}`; }
