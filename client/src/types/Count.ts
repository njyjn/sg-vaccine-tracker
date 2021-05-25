export interface Count {
    dateAsOf: string,
    type: string,
    value: number,
    totalPopulation: number,
    percentage: number,
    dateAsOfPrevious?: string,
    daysElapsedSincePrevious?: number,
    valuePrevious?: number,
    percentagePrevious?: number,
    percentageChange?: number,
    percentageChangeAvgPerDay?: number,
    valueChange?: number,
    valueChangeAvgPerDay?: number,
    percentChangeDelta?: number,
}

export interface CountCollection {
    count: Count,
    countPartial: Count,
    countTotal: Count,
}