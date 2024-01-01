import { Solution, TwoSolutions } from 'types/Solution';

type ScratchCard = { have: number[]; winning: number[] };
type Models = { scratchCards: ScratchCard[] };

function getAmountOfMatchingNumbers(winningNumbers: number[], numbersYouHave: number[]): number {
    const winningNumbersRegex = `(?<= |^)(${winningNumbers.join('|')})(?= |$)`;
    const matches = [...numbersYouHave.join(' ').matchAll(RegExp(winningNumbersRegex, 'g'))].map(x => x[0]);
    return matches.length;
}

function countCards(currentCard: number, cachedMatches: number[], cachedCardCounts: { [key: number]: number }): number {
    // A base case is not needed because the problem guarantees that the problem won't generate cards beyond the last one.
    const cachedCount = cachedCardCounts[currentCard];
    if (cachedCount) {
        return cachedCount;
    }
    let cardCount = 1;
    for (let duplicateCard = currentCard + 1; duplicateCard <= currentCard + cachedMatches[currentCard]; duplicateCard++) {
        cardCount += countCards(duplicateCard, cachedMatches, cachedCardCounts);
    }
    cachedCardCounts[currentCard] = cardCount;
    return cardCount;
}

export class MySolution implements Solution {
    parseLinesToModels(lines: string[]): Models {
        const scratchCards: ScratchCard[] = [];
        lines.forEach(line => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const [winningNumbers, numbersYouHave] = line.split(':')[1].split('|').map(numbersString => numbersString.trim().split(/\s+/).map(number => Number(number)));
            scratchCards.push({ have: numbersYouHave, winning: winningNumbers });
        });

        return { scratchCards };
    }

    get(models: Models): TwoSolutions {
        const scratchCards = models.scratchCards;
        const cachedMatches: number[] = [];
        let totalPoints = 0;

        // Part 1
        scratchCards.forEach(scratchCard => {
            const amountMatches = getAmountOfMatchingNumbers(scratchCard.winning, scratchCard.have);
            cachedMatches.push(amountMatches);
            if (amountMatches > 0) {
                totalPoints += 2 ** (amountMatches - 1);
            }
        });

        // Part 2
        const cachedCardCounts: { [key: number]: number } = {};
        let totalCards = 0;
        // loop bottom up to benefit from the cache as much as possible
        for (let index = cachedMatches.length - 1; index >= 0; index--) {
            totalCards += countCards(index, cachedMatches, cachedCardCounts);
        }

        return { partOne: totalPoints, partTwo: totalCards }; // Part 1: 28538, Part 2: 9425061
    }
}
