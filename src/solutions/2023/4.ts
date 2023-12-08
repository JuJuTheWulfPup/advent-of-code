import { readFileSync } from 'node:fs';

const input = readFileSync('./input.txt', { encoding: 'utf8' });
const lines = input.split('\n');

function getAmountOfMatchingNumbers(winningNumbersString, numbersYouHaveString): number {
    const winningNumbersRegex = `(?<= |^)(${winningNumbersString.trim().split(/ +/).join('|')})(?= |$)`;
    const matches = [...numbersYouHaveString.matchAll(RegExp(winningNumbersRegex, 'g'))].map(x => x[0]);
    return matches.length;
}
const cachedMatches: number[] = [];
let totalPoints = 0;
lines.forEach(line => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, numbers] = line.split(':');
    const [winningNumbersString, numbersYouHaveString] = numbers.split('|');
    const amountMatches = getAmountOfMatchingNumbers(winningNumbersString, numbersYouHaveString);
    cachedMatches.push(amountMatches);
    if (amountMatches > 0) {
        totalPoints += 2 ** (amountMatches - 1);
    }
});

const cachedCardCounts: { [key: number]: number } = {};
function countCards(currentCard: number): number {
    // A base case is not needed because the problem guarantees that the problem won't generate cards beyond the last one.
    const cachedCount = cachedCardCounts[currentCard];
    if (cachedCount) {
        return cachedCount;
    }
    let cardCount = 1;
    for (let duplicateCard = currentCard + 1; duplicateCard <= currentCard + cachedMatches[currentCard]; duplicateCard++) {
        cardCount += countCards(duplicateCard);
    }
    cachedCardCounts[currentCard] = cardCount;
    return cardCount;
}
let totalCards = 0;
// loop bottom up to benefit from the cache as much as possible
for (let index = cachedMatches.length - 1; index >= 0; index--) {
    totalCards += countCards(index);
}

console.log(`Part 1: ${totalPoints}, Part 2: ${totalCards}`); // Part 1: 28538, Part 2: 9425061
