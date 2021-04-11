import * as React from 'react';
import { getLatestCount } from '../api/counts-api';
import { Count } from '../types/Count';

import { Dimmer, Grid, Header, Loader, Progress, Icon} from 'semantic-ui-react';
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
            type: 'fullyVaccinated',
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
                loadingFailed: true
            })
        }
    };

    render() {
        return (
            this.renderCount()
        )
    }

    renderCount() {
        if (this.state.loadingFailed) {
            return this.renderError();
        }
        if (this.state.loadingCount) {
            return this.renderLoading();
        }
        const value = this.state.count.value
        const percent = Math.round(value / 5685800 * 10000.0) / 100;
        console.log(percent)
        return (
            <Grid.Row>
                <Grid.Column textAlign="center">
                    <Icon size="big" name="syringe" color="red" inverted />
                    <Header size="small" inverted>
                        {new Date(this.state.count.dateAsOf).toLocaleDateString(undefined, { timeZone: 'Asia/Singapore' })}
                    </Header>
                    <Header size="huge" inverted>
                        {percent}%
                    </Header>
                    <Progress percent={percent} inverted color="grey">
                    </Progress>
                    <Header size="tiny" inverted>
                        of Singaporeans are fully vaccinated against COVID-19
                    </Header>
                </Grid.Column>
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

}

