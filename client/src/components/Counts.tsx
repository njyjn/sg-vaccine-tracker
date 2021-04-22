import * as React from 'react';
import { getLatestCount } from '../api/counts-api';
import { Count } from '../types/Count';

import { Dimmer, Grid, Header, Loader, Progress, Image, Divider, Popup } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';

interface CountsProps {};

interface CountsState {
    count: Count
    loadingCount: boolean
    loadingFailed: boolean
};

export class Counts extends React.PureComponent<CountsProps, CountsState> {
    state: CountsState = {
        count: {
            dateAsOf: Date.now.toString(),
            value: 0,
            percentage: 0,
            type: 'fullyVaccinated',
            dateAsOfPrevious: '-',
            daysElapsedSincePrevious: 1,
            valuePrevious: 0,
            percentagePrevious: 0,
            percentageChange: 0,
            valueChange: 0,
            valueChangeAvgPerDay: 0,
        } as Count,
        loadingCount: true,
        loadingFailed: false
    };
    
    async componentDidMount() {
        try {
            const count = await getLatestCount();
            this.setState({
                count: count,
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
                <Divider />
                {this.renderMetrics()}
                <Divider />
            </Grid>
        )
    }

    renderSummary() {
        const value = this.state.count.value
        const percent = Math.round(value / 5685800 * 10000.0) / 100;
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

    renderMetrics() {
        return (
            <Grid.Row columns='5'>
                <Grid.Column>
                    <p>Total vaccinated</p>
                    <Header size='tiny' inverted>{this.state.count.value}</Header>
                </Grid.Column>
                <Grid.Column>
                    <p>Previous update</p>
                    <Header size='tiny' inverted>{this.formatDatestringToLocale(this.state.count.dateAsOfPrevious)}</Header>
                </Grid.Column>
                <Grid.Column>
                    <p>% increase</p>
                    <Header size='tiny' inverted>{this.formatChange(this.state.count.percentageChange, this.state.count.valueChange)}</Header>
                </Grid.Column>
                <Grid.Column>
                    <p>Avg. increase per day</p>
                    <Header size='tiny' inverted>{this.formatIncreaseRate(this.state.count.valueChangeAvgPerDay)}</Header>
                </Grid.Column>
                <Popup
                    position='bottom center'
                    inverted
                    basic
                    content='The difference between % increases of the current and previous updates'
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

    formatIncreaseRate(valueChangeAvgPerDay: number | undefined) {
        if (!valueChangeAvgPerDay) { valueChangeAvgPerDay = 0 };
        const sign = valueChangeAvgPerDay < 0 ? '🔻' : '🔺';
        return `${sign}${valueChangeAvgPerDay}`;
    }

    formatChangeDelta(percentChangeDelta: number | undefined) {
        if (!percentChangeDelta) { percentChangeDelta = 0 };
        const sign = percentChangeDelta < 0 ? '🔻' : '🔺';
        return `${sign}${percentChangeDelta}%`;
    }
}

