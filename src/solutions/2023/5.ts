import { Solution, TwoSolutions } from 'types/Solution';

type ToSourceInfo = { destinationRangeStart: number; sourceRangeStart: number; rangeLength: number };
type SourceToSourceInfo = { fromSourceName: string; toSourceName: string; toSourceInfoList: ToSourceInfo[] };
type SourceToSourceInfoMap = { [key: string]: SourceToSourceInfo };
type Models = { seedIds: number[]; info: SourceToSourceInfoMap };
type DestinationInfo = { toSourceId: number; toSourceName: string };

export class ThisSolution implements Solution {
    parseLinesToModels(lines: string[]): Models {
        const seedIds = lines.splice(0, 1)[0].split(':')[1].trim().split(' ').map(x => Number(x));

        let fromSourceName = '';
        let toSourceName = '';
        const info: SourceToSourceInfoMap = {} as SourceToSourceInfoMap;
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];

            // if the line is a newline, parse the map header line
            if (line === '') {
                line = lines[++i];
                let _: string;
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                [fromSourceName, _, toSourceName] = line.split(' ')[0].replace(':', '').split('-');
                continue;
            }

            // otherwise, parse the map value
            const [destinationRangeStart, sourceRangeStart, rangeLength] = line.split(' ');
            const toSourceInfo: ToSourceInfo = {
                destinationRangeStart: Number(destinationRangeStart),
                sourceRangeStart: Number(sourceRangeStart),
                rangeLength: Number(rangeLength)
            };
            const currentSourceToSourceInfo = info[fromSourceName];
            if (!currentSourceToSourceInfo) {
                const sourceToSourceInfo: SourceToSourceInfo = {
                    fromSourceName,
                    toSourceName,
                    toSourceInfoList: [toSourceInfo]
                };
                info[fromSourceName] = sourceToSourceInfo;
            } else {
                info[fromSourceName].toSourceInfoList.push(toSourceInfo);
            }
        }
        return { seedIds, info };
    }

    get(models: Models): TwoSolutions {
        const seedIds = models.seedIds;
        const mapInfo: SourceToSourceInfoMap = models.info;
        console.log(mapInfo.soil.toSourceInfoList);

        function getDestinationInfo(fromSourceId: number, fromSourceName: string): DestinationInfo {
            const sourceToSourceInfo = mapInfo[fromSourceName];
            const foundInfo = sourceToSourceInfo.toSourceInfoList.find(toSourceInfo => toSourceInfo.sourceRangeStart <= fromSourceId && (toSourceInfo.sourceRangeStart + toSourceInfo.rangeLength) >= fromSourceId);
            let toSourceId: number;
            if (foundInfo) {
                toSourceId = foundInfo.destinationRangeStart + (fromSourceId - foundInfo.sourceRangeStart);
            } else {
                toSourceId = fromSourceId;
            }
            // console.log(fromSourceName, fromSourceId, sourceToSourceInfo.toSourceName, toSourceId, foundInfo);
            return { toSourceId: toSourceId, toSourceName: sourceToSourceInfo.toSourceName };
        }

        function getLocationId(seedId: number): number {
            let fromSourceName = 'seed';
            let toSourceName: string;
            let fromSourceId = seedId;
            while (fromSourceName !== 'location') {
                const destinationInfo = getDestinationInfo(fromSourceId, fromSourceName);
                const toSourceId = destinationInfo.toSourceId;
                toSourceName = destinationInfo.toSourceName;

                // prepare for next iteration
                fromSourceId = toSourceId;
                fromSourceName = toSourceName;
            }
            // console.log();
            return fromSourceId;
        }

        let lowestLocation1 = Infinity;
        seedIds.forEach(seedId => {
            lowestLocation1 = Math.min(lowestLocation1, getLocationId(seedId));
        });

        const seedRanges: { start: number; range: number }[] = [];
        for (let i = 0; i < seedIds.length; i += 2) {
            console.log('loop1', i);
            seedRanges.push({ start: seedIds[i], range: seedIds[i + 1] });
        }

        let lowestLocation2 = Infinity;
        seedRanges.forEach(seedRange => {
            console.log('loop2');
            for (let seedId = seedRange.start; seedId < seedRange.start + seedRange.range; seedId++) {
                // THIS PART IS REALLY SLOWC
                lowestLocation2 = Math.min(lowestLocation1, getLocationId(seedId));
            }
        });

        console.log(`Part 1: ${lowestLocation1}, Part 2: ${lowestLocation2}`);
        return { partOne: lowestLocation1, partTwo: lowestLocation2 };
    }
}
