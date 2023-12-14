export const SOLUTIONS_PATH = './src/solutions';
export const INPUT_PATH = './src/inputs';
export function YEAR_SOLUTION_PATH(year: number): string { return `${SOLUTIONS_PATH}/${year}`; }
export function YEAR_EXAMPLE_INPUT_PATH(year: number): string { return `${INPUT_PATH}/${year}/example`; }
export function YEAR_INPUT_PATH(year: number): string { return `${INPUT_PATH}/${year}`; }
