import { Solution, TwoSolutions } from 'types/Solution';

enum Buttons { A, B }
type Coordinate = { x: bigint; y: bigint };
type Machine = {
    [Buttons.A]: Coordinate;
    [Buttons.B]: Coordinate;
    Prize: Coordinate;
};
type Machines = Machine[];
type Models = {
    machines: Machine[];
};
const tokenCost: { [key in Buttons]: bigint } = { [Buttons.A]: BigInt(3), [Buttons.B]: BigInt(1) };

export class MySolution implements Solution {
    parseCoordinate(line: string): Coordinate {
        const values = line.split(':')[1].split(',').map(splitString => BigInt(splitString.trim().slice(2)));
        return {
            x: values[0],
            y: values[1]
        };
    }

    generateEmptyMachine(): Machine {
        return { [Buttons.A]: { x: BigInt(-1), y: BigInt(-1) }, [Buttons.B]: { x: BigInt(-1), y: BigInt(-1) }, Prize: { x: BigInt(-1), y: BigInt(-1) } };
    }

    parseLinesToModels(lines: string[]): Models {
        const machines: Machines = [];
        let machine: Machine = this.generateEmptyMachine();
        for (let l = 0; l < lines.length; l++) {
            const line = lines[l];

            if (line.startsWith('Button A')) {
                machine[Buttons.A] = this.parseCoordinate(line);
            }
            if (line.startsWith('Button B')) {
                machine[Buttons.B] = this.parseCoordinate(line);
            }
            if (line.startsWith('Prize')) {
                machine.Prize = this.parseCoordinate(line);
                machines.push(machine);
                machine = this.generateEmptyMachine();
            }

            if (!line) { continue; }
        }
        return {
            machines
        };
    }

    machineSolveCost(machine: Machine): bigint {
        // build out equations:
        //  x: j*A + k*B = l
        //  y: m*A + n*B = o
        const j: bigint = machine[Buttons.A].x;
        const k: bigint = machine[Buttons.B].x;
        const l: bigint = machine.Prize.x;
        const m: bigint = machine[Buttons.A].y;
        const n: bigint = machine[Buttons.B].y;
        const o: bigint = machine.Prize.y;
        const XEquation = [j, k, l];
        const YEquation = [m, n, o];

        // subtract multiple of y equation from multiple of x equation to eliminate B
        //   (J*A + K*B = L) <== n*(j*A + k*B) = n*l
        // - (M*A + N*B = O) <== k*(m*A + n*B) = k*o
        // = (Q*A + R*B = S), where R should be 0
        const [J, K, L] = XEquation.map(value => value * n);
        const [M, N, O] = YEquation.map(value => value * k);
        const nXEquation = [J, K, L];
        const kYEquation = [M, N, O];
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [Q, R, S] = nXEquation.map((_, i) => nXEquation[i] - kYEquation[i]);

        // solve for A
        // A = S / Q
        const A = S / Q;

        // solve for B and check both answers match
        //  B = (L - J*A) / (K)
        //  B = (O - M*A) / (N)
        const B1: number = (Number(L) - Number(J) * Number(A)) / Number(K);
        const B2: number = (Number(O) - Number(M) * Number(A)) / Number(N);
        if (B1 !== B2 || !Number.isInteger(B1)) {
            return BigInt(-1);
        }

        const cost = (A * tokenCost[Buttons.A]) + (BigInt(B1) * tokenCost[Buttons.B]);
        return cost;
    }

    totalMachineSolveCost(machines: Machines): bigint {
        let totalCost = BigInt(0);
        machines.forEach(machine => {
            const cost = this.machineSolveCost(machine);
            if (cost > 0) {
                totalCost += cost;
            }
        });
        return totalCost;
    }

    partOne(machines: Machines): bigint {
        return this.totalMachineSolveCost(machines);
    }

    partTwo(machines: Machines): bigint {
        const addToPrizeLocation = BigInt(10000000000000);
        machines.forEach(machine => {
            machine.Prize.x += addToPrizeLocation;
            machine.Prize.y += addToPrizeLocation;
        });
        return this.totalMachineSolveCost(machines);
    }

    get(models: Models): TwoSolutions {
        const machines = models.machines;
        return {
            partOne: this.partOne(machines),
            partTwo: this.partTwo(machines)
        };
        // Part 1: 480, Part 2: 102255878088512 too high
    }
}
