import { Solution, TwoSolutions } from 'types/Solution';

type ColorInfo = { amount: number; color: string };
type ColorSet = ColorInfo[];
type SetOfColorSets = ColorSet[];
type GameToSetOfColorSets = { [gameNumber: number]: SetOfColorSets };
type AmountsGoal = { red: number; green: number; blue: number };
type Models = { gameToSetOfColorSets: GameToSetOfColorSets; partOneGoal: AmountsGoal };

export class MySolution implements Solution {
    parseLinesToModels(lines: string[]): Models {
        const gameToSetOfColorSets = {};
        lines.forEach(line => {
            const [gameName, setsString] = line.split(':');

            const setOfColorSets: SetOfColorSets = [];
            setsString.split(';')
                .forEach(set => {
                    const colorSetStrings = set.split(',');
                    const colorSet: ColorSet = [];

                    colorSetStrings.forEach(colorSetString => {
                        colorSetString = colorSetString.trim();
                        const [amountString, color] = colorSetString.split(' ');
                        const amount = Number(amountString);

                        const colorInfo: ColorInfo = { amount, color };
                        colorSet.push(colorInfo);
                    });
                    setOfColorSets.push(colorSet);
                });
            gameToSetOfColorSets[Number(gameName.substring(5))] = setOfColorSets;
        });
        return {
            gameToSetOfColorSets,
            partOneGoal: {
                red: 12,
                green: 13,
                blue: 14
            }
        };
    }

    get(models: Models): TwoSolutions {

        let sumOfQualified = 0;
        let sumOfProducts = 0;

        const gameToSetOfColorSets = models.gameToSetOfColorSets;
        const partOneGoal = models.partOneGoal;
        Object.keys(gameToSetOfColorSets).forEach(gameNumberKey => {
            const setOfColorSets: SetOfColorSets = gameToSetOfColorSets[gameNumberKey];
            let qualifies = true;
            const lowest = {
                red: 0,
                green: 0,
                blue: 0
            };

            setOfColorSets.forEach(colorSet => {
                colorSet.forEach(colorInfo => {
                    const { amount, color } = colorInfo;
                    if (partOneGoal[color] < amount) {
                        qualifies = false;
                    }
                    // todo: short circuit ??????????

                    if (lowest[color] < amount) {
                        lowest[color] = amount;
                    }
                });
            });

            if (qualifies) {
                sumOfQualified += Number(gameNumberKey);
            }
            sumOfProducts += lowest.red * lowest.green * lowest.blue;
        });

        return { partOne: sumOfQualified, partTwo: sumOfProducts }; // Part 1: 2617, Part 2: 59795
    }
}
