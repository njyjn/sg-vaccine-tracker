import * as React from 'react';
import { getLatestCount } from '../api/counts-api';
import { Count } from '../types/Count';

import { Dimmer, Grid, Header, Loader, Progress, Image, Divider, Popup } from 'semantic-ui-react';
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
                {this.renderSummary()}
                {this.renderMetrics()}
                <Divider />
                {this.renderFirstShotMetrics()}
                <Divider />
            </Grid>
        )
    }

    renderSummary() {
        const percent = this.state.count.percentage;
        console.log(percent)
        return (
            <Grid.Row>
                <Grid.Column textAlign="center">
                    <Image src='/logo192.png' size='small' centered></Image>
                    <Header size="small" inverted>
                        {this.formatDatestringToLocale(this.state.count.dateAsOf)}
                    </Header>
                    <Header size="huge" inverted>
                        {percent}%
                    </Header>
                    <Progress percent={percent} active inverted color="grey"></Progress>
                    <Header size="tiny" inverted>
                        of Singaporeans are fully vaccinated against COVID-19
                    </Header>
                </Grid.Column>
            </Grid.Row>
        )
    }

    renderFirstShotMetrics() {
        const valuePartial = this.state.countPartial.value
        const percentPartial = this.state.countPartial.percentage;
        const valueTotal = this.state.countTotal.value
        const percentTotal = this.state.countTotal.percentage;
        return (
            <Grid.Row columns='2'>
                <Grid.Column textAlign="center">
                    <Header size="small" inverted>
                        {percentPartial}% ({valuePartial.toLocaleString()})
                    </Header>
                    <p>of Singaporeans are partially vaccinated</p>
                </Grid.Column>
                <Grid.Column textAlign="center">
                    <Header size="small" inverted>
                        {percentTotal}% ({valueTotal.toLocaleString()})
                    </Header>
                    <p>of Singaporeans have received at least one dose</p>
                </Grid.Column>
            </Grid.Row>
        )
    }

    renderMetrics() {
        // TODO: Convert all numerical values into comma separated strings if applicable
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
            <Grid.Row>
                <Grid.Column textAlign="center">
                    <Header inverted as ="large">¯\_(ツ)_/¯</Header>
                    <Header inverted size="medium">{this.randomErrorString()}</Header>
                </Grid.Column>
            </Grid.Row>
        );
    }

    randomErrorString() {
        const strings = [
            'Can try again later?',
            'Paiseh, bo eng',
        ]
        return strings[Date.now() % 2];
    }

    formatDatestringToLocale(date: string | undefined) {
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
        return `${sign}${changePercent}% (${previous})`;
    }

    formatIncreaseRate(changePercentAvgPerDay: number | undefined, valueChangeAvgPerDay: number | undefined) {
        if (!valueChangeAvgPerDay) { valueChangeAvgPerDay = 0 };
        const sign = valueChangeAvgPerDay < 0 ? '🔻' : '🔺';
        return `${sign}${changePercentAvgPerDay}% (${valueChangeAvgPerDay})`;
    }

    formatChangeDelta(percentChangeDelta: number | undefined) {
        if (!percentChangeDelta) { percentChangeDelta = 0 };
        const sign = percentChangeDelta < 0 ? '🔻' : '🔺';
        return `${sign}${percentChangeDelta}%`;
    }
}

