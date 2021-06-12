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
    percentageChangeAvgPerDay?: number,
    valueChange?: number,
    valueChangeAvgPerDay?: number,
    percentChangeDelta?: number,
    lastModified?: string,
    lastModifiedBy?: string,
};

export interface CountKey {
    dateAsOf: string,
    type: string,
};
