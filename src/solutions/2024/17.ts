import { Solution, TwoSolutions } from 'types/Solution';

let program: Program = [];
let registers: Registers = { A: BigInt(-1), B: BigInt(-1), C: BigInt(-1) };
let instructionPointer = 0;

type Models = {
    registers: Registers;
    program: Program;
};
type Program = number[];
type Registers = {
    A: bigint;
    B: bigint;
    C: bigint;
};
enum OPCODES {
    adv,
    // eslint-disable-next-line spellcheck/spell-checker
    bxl,
    // eslint-disable-next-line spellcheck/spell-checker
    bst,
    // eslint-disable-next-line spellcheck/spell-checker
    jnz,
    // eslint-disable-next-line spellcheck/spell-checker
    bxc,
    out,
    // eslint-disable-next-line spellcheck/spell-checker
    bdv,
    // eslint-disable-next-line spellcheck/spell-checker
    cdv,
}

function translateComboOperand(comboOperand: number): bigint {
    switch (comboOperand) {
        case 0:
        case 1:
        case 2:
        case 3:
            return BigInt(comboOperand);
        case 4:
            return registers.A;
        case 5:
            return registers.B;
        case 6:
            return registers.C;
        case 7:
        default:
            throw Error('invalid combo operand');
    }
}
const opCodes: { [key in OPCODES]: (operand: number | undefined) => bigint | void } = {
    [OPCODES.adv]: (comboOperand: number) => {
        registers.A = BigInt(registers.A / (2n ** translateComboOperand(comboOperand)));
        instructionPointer += 2;
    },
    // eslint-disable-next-line spellcheck/spell-checker
    [OPCODES.bxl]: (literalOperand: number) => {
        registers.B ^= BigInt(literalOperand);
        instructionPointer += 2;
    },
    // eslint-disable-next-line spellcheck/spell-checker
    [OPCODES.bst]: (comboOperand: number) => {
        registers.B = translateComboOperand(comboOperand) % 8n;
        instructionPointer += 2;
    },
    // eslint-disable-next-line spellcheck/spell-checker
    [OPCODES.jnz]: (literalOperand: number) => {
        if (registers.A !== 0n) {
            instructionPointer = literalOperand;
        } else {
            instructionPointer += 2;
        }
    },
    // eslint-disable-next-line spellcheck/spell-checker
    [OPCODES.bxc]: () => {
        registers.B ^= registers.C;
        instructionPointer += 2;
    },
    [OPCODES.out]: (comboOperand: number): bigint => {
        const result = translateComboOperand(comboOperand) % 8n;
        instructionPointer += 2;
        return result;
    },
    // eslint-disable-next-line spellcheck/spell-checker
    [OPCODES.bdv]: (comboOperand: number) => {
        registers.B = BigInt(registers.A / (2n ** translateComboOperand(comboOperand)));
        instructionPointer += 2;
    },
    // eslint-disable-next-line spellcheck/spell-checker
    [OPCODES.cdv]: (comboOperand: number) => {
        registers.C = BigInt(registers.A / (2n ** translateComboOperand(comboOperand)));
        instructionPointer += 2;
    }
};

export class MySolution implements Solution {
    parseLinesToModels(lines: string[]): Models {
        lines.forEach(line => {
            if (line.startsWith('Register A:')) {
                registers.A = BigInt(line.split(':')[1].trim());
            }
            if (line.startsWith('Register B:')) {
                registers.B = BigInt(line.split(':')[1].trim());
            }
            if (line.startsWith('Register C:')) {
                registers.C = BigInt(line.split(':')[1].trim());
            }

            if (line.startsWith('Program:')) {
                program = line.split(' ')[1].split(',').map(strValue => Number(strValue));
            }
        });
        return {
            program, registers
        };
    }

    runProgram(): bigint[] {
        // reset program in case we run multiple files
        instructionPointer = 0;
        const out: bigint[] = [];

        while (instructionPointer < program.length) {
            const result: bigint | undefined = opCodes[program[instructionPointer]](program[instructionPointer + 1]);
            if (result !== undefined) {
                out.push(result);
            }
        }
        return out;
    }

    // brute force
    searchForA(): bigint {
        const programString = program.join(',');
        const out: bigint[] = [];
        let a = -1n;
        while (out.join(',') !== programString) {
            a++;
            // console.log(a);
            // reset program
            instructionPointer = 0;
            while (instructionPointer < program.length) {
                const result: bigint | undefined = opCodes[program[instructionPointer]](program[instructionPointer + 1]);
                if (result !== undefined) {
                    out.push(result);
                    if (!programString.startsWith(out.join(','))) {
                        break;
                    }
                }
            }
        }
        return a;
    }

    get(models: Models): TwoSolutions {
        program = models.program;
        registers = models.registers;

        return {
            partOne: this.runProgram().join(','),
            partTwo: -1 // this.searchForA()
        };
        // Part 1: 5,0,3,5,7,6,1,5,4
        // Part 2:
    }
}
