const year = 'world';

export function main(year: number = 2023): string {
  return `Hello ${year}! `;
}

console.log(main(), 'wow');

// todo: ts-node-dev was suggested by Paul https://www.npmjs.com/package/ts-node-dev