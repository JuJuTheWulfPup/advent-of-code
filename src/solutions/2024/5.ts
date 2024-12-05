import { Solution, TwoSolutions } from 'types/Solution';

type PageOrderingRulesByPage = { [page: number]: PageOrder[] };
type PageOrder = { before: number; after: number };
type Models = {
    pageOrderingRulesByPage: PageOrderingRulesByPage;
    pagesToProduceList: number[][];
};

export class MySolution implements Solution {
    parseLinesToModels(lines: string[]): Models {
        const models: Models = {
            pageOrderingRulesByPage: {},
            pagesToProduceList: []
        };
        let section1 = true;
        lines.forEach(line => {
            if (line.length === 0) { section1 = false; }

            if (section1) {
                const values = line.split('|').map(value => Number(value));
                const pageOrder: PageOrder = { before: values[0], after: values[1] };
                if (!models.pageOrderingRulesByPage[pageOrder.before]) {
                    models.pageOrderingRulesByPage[pageOrder.before] = [];
                }
                models.pageOrderingRulesByPage[pageOrder.before].push(pageOrder);
                if (!models.pageOrderingRulesByPage[pageOrder.after]) {
                    models.pageOrderingRulesByPage[pageOrder.after] = [];
                }
                models.pageOrderingRulesByPage[pageOrder.after].push(pageOrder);
            } else {
                const values = line.split(',').map(value => Number(value));
                models.pagesToProduceList.push(values);
            }
        });
        return models;
    }

    findPageIndex(pagesToProduce: number[], page: number): number {
        return pagesToProduce.findIndex(x => x === page);
    }

    getOrderedPagesToProduceList(pagesToProduceList: number[][], pageOrderingRulesByPage: PageOrderingRulesByPage): { ordered: number[][]; mixed: number[][] } {
        const ordered: number[][] = [];
        const mixed: number[][] = [];
        pagesToProduceList.forEach(pagesToProduce => {
            let isOrdered = true;
            for (let pageIndex = 0; pageIndex < pagesToProduce.length; pageIndex++) {
                const pageToProduce = pagesToProduce[pageIndex];
                const pageOrderingRules = pageOrderingRulesByPage[pageToProduce] ?? [];
                let r = 0;
                while (r < pageOrderingRules.length && isOrdered) {
                    const pageOrderingRule = pageOrderingRules[r];
                    const otherPageShouldBeBefore = pageOrderingRule.before !== pageToProduce;
                    for (let i = 0; i < pagesToProduce.length; i++) {
                        const otherPageIndex = this.findPageIndex(pagesToProduce, otherPageShouldBeBefore ? pageOrderingRule.before : pageOrderingRule.after);
                        if (otherPageShouldBeBefore && otherPageIndex > pageIndex) {
                            isOrdered = false;
                        }
                    }
                    r++;
                }
            }
            if (isOrdered) {
                ordered.push(pagesToProduce);
            } else {
                mixed.push(pagesToProduce);
            }
        });
        return { ordered, mixed };
    }

    partOne(orderedPagesToProduceList: number[][]): number {
        return orderedPagesToProduceList.reduce((sum, orderedPagesToProduce) => sum + orderedPagesToProduce[Math.floor(orderedPagesToProduce.length / 2)], 0);
    }

    partTwo(mixedPagesToProduceList: number[][]): number {
        return -1;
    }

    get(models: Models): TwoSolutions {
        const pagesToProduceCategorized = this.getOrderedPagesToProduceList(models.pagesToProduceList, models.pageOrderingRulesByPage);
        return { partOne: this.partOne(pagesToProduceCategorized.ordered), partTwo: this.partTwo(pagesToProduceCategorized.mixed) };
        // Part 1: 5166, Part 2:
    }
}
