import * as React from 'react';
import { getLatestCount } from '../api/counts-api';
import { Count } from '../types/Count';

import { Dimmer, Grid, Header, Loader, Progress, Image, Divider, Popup, Message, Icon } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';

interface CountsProps {};

interface CountsState {
    count: Count
    countPartial: Count
    countTotal: Count
    loadingCount: boolean
    loadingFailed: boolean
};

export class Counts extends React.PureComponent<CountsProps, CountsState> {
    defaultCount = {
        dateAsOf: Date.now.toString(),
        value: 0,
        percentage: 0,
        type: 'fullyVaccinated',
        dateAsOfPrevious: '-',
        daysElapsedSincePrevious: 1,
        valuePrevious: 0,
        percentagePrevious: 0,
        percentageChange: 0,
        percentageChangeAvgPerDay: 0,
        valueChange: 0,
        valueChangeAvgPerDay: 0,
    } as Count;
    state: CountsState = {
        count: this.defaultCount,
        countPartial: this.defaultCount,
        countTotal: this.defaultCount,
        loadingCount: true,
        loadingFailed: false
    };
    
    async componentDidMount() {
        try {
            let { count, countPartial, countTotal } = await getLatestCount();
            if (!count || !countPartial || !countTotal) {
                throw new Error();
            }
            this.setState({
                count: count,
                countPartial: countPartial,
                countTotal: countTotal,
                loadingCount: false
            })
        } catch (e) {
            // alert('Failed to fetch latest update. Please try again later');
            this.setState({
                loadingFailed: true,
                loadingCount: false
            })
        }
    };

    render() {
        return (
            this.renderPage()
        )
    };

    renderPage() {
        if (this.state.loadingFailed) {
            return this.renderError();
        }
        if (this.state.loadingCount) {
            return this.renderLoading();
        }
        return (
            this.renderCount()
        )
    };

    renderCount() {
        return (
            <Grid stackable>
                {this.renderMessage()}
                {this.renderSummary()}
                {this.renderMetrics()}
                {this.renderHerdImmunityEstimate()}
                <Divider />
                {this.renderFirstShotMetrics()}
                <Divider />
            </Grid>
        )
    }

    renderMessage() {
        return (
            <Grid.Row gutter>
                    <Message floating info size='small'>
                    <p>As MOH has started reporting percentages directly on their <a href="https://www.moh.gov.sg/covid-19/vaccination">website</a>, SG Vaccine Tracker will stop offering updates as of 23 Oct 2021. I hope that I was able to shed some light on Singapore's vaccination progress in the early stages of the COVID-19 pandemic.</p>
                    <p>Millions of people continue to be impacted by the pandemic through the loss of loved ones, economic devastation, and the restriction of personal freedoms. In addition to putting an end to this crisis, vaccines can save lives and have been <a
                        href='https://www.cdc.gov/coronavirus/2019-ncov/vaccines/effectiveness/index.html'
                        target="_blank"
                        rel="noopener noreferrer"
                    >proven to reduce the severity and incidence of infection</a>. It is my hope that everyone plays their part by getting their vaccine, standing up against misinformers and misinformation, and encouraging others to do the same.</p>
                    <p><strong>Stay safe, stay well, and be kind</strong></p>
                    <p>Till we meet again<br />~ Justin Ng</p>
                    <p>
                        <a
                            href='https://github.com/njyjn/'
                            target="_blank"
                            rel="noopener noreferrer"
                        ><Icon name='github' link /></a>
                        <a
                            href='https://www.linkedin.com/in/njyjustin/'
                            target="_blank"
                            rel="noopener noreferrer"
                        ><Icon name='linkedin' link /></a>
                        <a
                            href='https://justin.sg/'
                            target="_blank"
                            rel="noopener noreferrer"
                        ><Icon name='address card' link /></a>
                    </p>
                </Message>
            </Grid.Row>
        )
    }

    renderSummary() {
        const percent = this.state.count.percentage;
        console.log(percent)
        return (
            <Grid.Row>
                <Grid.Column textAlign="center">
                    <Image src='/logo192.png' size='tiny' centered></Image>
                    <Header size="small" inverted>
                        {this.formatDatestringToLocale(this.state.count.dateAsOf)}
                    </Header>
                    <Header size="huge" inverted>
                        {percent}%
                    </Header>
                    <Progress percent={percent} active inverted color="grey"></Progress>
                    <Header size="tiny" inverted>
                        of the Singapore population is fully vaccinated against COVID-19
                    </Header>
                </Grid.Column>
            </Grid.Row>
        )
    }

    renderFirstShotMetrics() {
        const valuePartial = this.state.countPartial.value
        const percentPartial = this.state.countPartial.percentage;
        const valueTotal = this.state.countTotal.value
        return (
            <Grid.Row columns='2'>
                <Grid.Column textAlign="center">
                    <Header size="small" inverted>
                        {percentPartial}% ({valuePartial.toLocaleString()})
                    </Header>
                    <p>of the population is partially vaccinated</p>
                </Grid.Column>
                <Grid.Column textAlign="center">
                    <Header size="small" inverted>
                        {valueTotal.toLocaleString()}
                    </Header>
                    <p>doses have been administered</p>
                </Grid.Column>
            </Grid.Row>
        )
    }

    renderMetrics() {
        return (
            <Grid.Row columns='5'>
                <Grid.Column>
                    <p>Total fully vaccinated</p>
                    <Header size='tiny' inverted>{this.state.count.value.toLocaleString('en-SG')}</Header>
                </Grid.Column>
                <Grid.Column>
                    <p>Previous update</p>
                    <Header size='tiny' inverted>{this.formatDatestringToLocale(this.state.count.dateAsOfPrevious)}</Header>
                </Grid.Column>
                <Grid.Column>
                    <p>Change</p>
                    <Header size='tiny' inverted>{this.formatChange(this.state.count.percentageChange, this.state.count.valueChange)}</Header>
                </Grid.Column>
                <Grid.Column>
                    <p>Avg. change per day</p>
                    <Header size='tiny' inverted>{this.formatIncreaseRate(this.state.count.percentageChangeAvgPerDay, this.state.count.valueChangeAvgPerDay)}</Header>
                </Grid.Column>
                <Popup
                    position='top center'
                    inverted
                    basic
                    content='The difference between average daily % change of the current and previous updates. Can be used to infer if the pace of vaccinations has increased or decreased since the previous reporting window. Approximate since data is released sporadically.'
                    trigger={
                        <Grid.Column>
                            <p>% change delta</p>
                            <Header size='tiny' inverted>{this.formatChangeDelta(this.state.count.percentChangeDelta)}</Header>
                        </Grid.Column>
                    }
                >
                </Popup>
            </Grid.Row>
        )
    }

    renderHerdImmunityEstimate() {
        const herdImmunityPercentage = 90;
        const percentageChangeAvgPerDay = this.state.count.percentageChangeAvgPerDay || 0.0;
        const estimateDate = new Date(this.state.count.dateAsOf);
        const estimateEta = Math.round((herdImmunityPercentage-this.state.count.percentage) / percentageChangeAvgPerDay);
        if (percentageChangeAvgPerDay > 0.0) {
            return (
                <Grid.Row>
                    <Grid.Column>
                        <p>Based on the past window's average change per day, Singapore could achieve {herdImmunityPercentage}% immunity by</p>
                        <Header size="tiny" inverted>
                            {this.formatDatestringToLocale(estimateDate.setDate(estimateDate.getDate() + estimateEta))} ({estimateEta} days)
                        </Header>
                    </Grid.Column>
                </Grid.Row>
            )
        }
    }

    renderLoading() {
        return (
            <Dimmer active>
                <Loader indeterminate>
                    Loading vaccination data...
                </Loader>
            </Dimmer>
        )
    }

    renderError() {
        return (
            <Grid stackable>
                <Grid.Row>
                    <Grid.Column textAlign="center">
                        <Header inverted as ="large">¯\_(ツ)_/¯</Header>
                        <Header inverted size="medium">{this.randomErrorString()}</Header>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }

    randomErrorString() {
        const strings = [
            'Can try again later?',
            'Paiseh, bo eng',
        ]
        return strings[Date.now() % 2];
    }

    formatDatestringToLocale(date: string | number | undefined) {
        if (date) {
            return new Date(date).toLocaleDateString(
                'en-SG',
                {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    timeZone: 'Asia/Singapore'
                }
            )
        }
        return '-'
    }

    formatChange(changePercent: number | undefined, previous: number | undefined) {
        if (!changePercent) { changePercent = 0 };
        if (!previous) { previous = 0 };
        const sign = changePercent < 0 ? '🔻' : '🔺';
        return `${sign}${changePercent}% (${previous.toLocaleString('en-SG')})`;
    }

    formatIncreaseRate(changePercentAvgPerDay: number | undefined, valueChangeAvgPerDay: number | undefined) {
        if (!valueChangeAvgPerDay) { valueChangeAvgPerDay = 0 };
        const sign = valueChangeAvgPerDay < 0 ? '🔻' : '🔺';
        return `${sign}${changePercentAvgPerDay}% (${valueChangeAvgPerDay.toLocaleString('en-SG')})`;
    }

    formatChangeDelta(percentChangeDelta: number | undefined) {
        if (!percentChangeDelta) { percentChangeDelta = 0 };
        const sign = percentChangeDelta < 0 ? '🔻' : '🔺';
        return `${sign}${percentChangeDelta}%`;
    }
}

