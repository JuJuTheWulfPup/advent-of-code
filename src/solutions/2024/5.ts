import { Solution, TwoSolutions } from 'types/Solution';

type PagesToProduce = number[];
type PageOrderingRulesByPage = { [page: number]: PageOrder[] };
type PageOrder = { before: number; after: number };
type MixedPagesToProduceResult = {
    pagesToProduce: PagesToProduce;
    brokenPageOrderRules: PageOrder[];
    relatedRules: PageOrder[];
};
type Models = {
    pageOrderingRulesByPage: PageOrderingRulesByPage;
    pagesToProduceList: PagesToProduce[];
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

    findPageIndex(pagesToProduce: PagesToProduce, page: number): number {
        return pagesToProduce.findIndex(x => x === page);
    }

    checkOrdering(pagesToProduce: PagesToProduce, pageOrderingRulesByPage: PageOrderingRulesByPage): { isOrdered: boolean; problematicOrderingRules?: PageOrder[]; relatedRules: PageOrder[] } {
        let isOrdered = true;
        const problematicOrderingRules: PageOrder[] = [];
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
                        if (problematicOrderingRules.filter(x => x.before === pageOrderingRule.before && x.after === pageOrderingRule.after).length === 0) {
                            problematicOrderingRules.push(pageOrderingRule);
                        }
                    }
                }
                r++;
            }
        }
        return {
            isOrdered,
            problematicOrderingRules,
            relatedRules:
                pagesToProduce.reduce((list: PageOrder[], pageToProduce) => {
                    const rules = pageOrderingRulesByPage[pageToProduce];
                    if (rules) {
                        list.push(...rules);
                    }
                    return list;
                }, [] as PageOrder[])
        };
    }

    getOrderedPagesToProduceList(pagesToProduceList: PagesToProduce[], pageOrderingRulesByPage: PageOrderingRulesByPage): { ordered: PagesToProduce[]; mixed: MixedPagesToProduceResult[] } {
        const ordered: PagesToProduce[] = [];
        const mixed: MixedPagesToProduceResult[] = [];
        pagesToProduceList.forEach(pagesToProduce => {
            const checkOrderingResult = this.checkOrdering(pagesToProduce, pageOrderingRulesByPage);
            if (checkOrderingResult.isOrdered) {
                ordered.push(pagesToProduce);
            } else {
                mixed.push({
                    pagesToProduce,
                    brokenPageOrderRules: checkOrderingResult.problematicOrderingRules ?? [],
                    relatedRules: checkOrderingResult.relatedRules
                });
            }
        });
        return { ordered, mixed };
    }

    sumOfMiddleValue(pagesToProduce: PagesToProduce[]): number {
        return pagesToProduce.reduce((sum, orderedPagesToProduce) => sum + orderedPagesToProduce[Math.floor(orderedPagesToProduce.length / 2)], 0);
    }

    sortWithRules(mixedPagesToProduceResult: MixedPagesToProduceResult): PagesToProduce {
        return mixedPagesToProduceResult.pagesToProduce.sort((a, b) => {
            const rule = mixedPagesToProduceResult.relatedRules
                .find(x => [x.after, x.before].includes(a) && [x.after, x.before].includes(b));
            if (rule) {
                if (rule.before === a && rule.after === b) { return -1; }
                if (rule.before === b && rule.after === a) { return 1; }
            }
            return 0;
        });
    }

    fixMixedPagesToProduceList(mixedPagesToProduceResultsList: MixedPagesToProduceResult[]): PagesToProduce[] {
        const fixedMixedList = mixedPagesToProduceResultsList.map(mixedPagesToProduceResult => {
            const fixedMixed = this.sortWithRules(mixedPagesToProduceResult);
            return fixedMixed;
        });
        return fixedMixedList;
    }

    partOne(orderedPagesToProduceList: PagesToProduce[]): number {
        return this.sumOfMiddleValue(orderedPagesToProduceList);
    }

    partTwo(mixedPagesToProduceResultsList: MixedPagesToProduceResult[]): number {
        const fixedMixed = this.fixMixedPagesToProduceList(mixedPagesToProduceResultsList);
        return this.sumOfMiddleValue(fixedMixed);
    }

    get(models: Models): TwoSolutions {
        const pagesToProduceCategorized = this.getOrderedPagesToProduceList(models.pagesToProduceList, models.pageOrderingRulesByPage);
        return { partOne: this.partOne(pagesToProduceCategorized.ordered), partTwo: this.partTwo(pagesToProduceCategorized.mixed) };
        // Part 1: 5166, Part 2: 4679
    }
}
