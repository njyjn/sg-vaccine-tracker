export interface Count {
    dateAsOf: string,
    value: number,
    type: string,
    totalPopulation?: number,
    percentage?: number,
    dateAsOfPrevious?: string,
    daysElapsedSincePrevious?: number,
    valuePrevious?: number,
    percentagePrevious?: number,
    percentageChange?: number,
    valueChange?: number,
    percentChangeDelta?: number,
};