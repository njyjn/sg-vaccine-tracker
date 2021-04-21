import * as React from 'react';
import { getLatestCount } from '../api/counts-api';
import { Count } from '../types/Count';

import { Dimmer, Grid, Header, Loader, Progress, Image} from 'semantic-ui-react';
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
        const value = this.state.count.value
        const percent = Math.round(value / 5685800 * 10000.0) / 100;
        console.log(percent)
        return (
            <Grid.Row>
                <Grid.Column textAlign="center">
                    <Image src='/logo192.png' size='small' centered></Image>
                    <Header size="small" inverted>
                        {
                            new Date(this.state.count.dateAsOf).toLocaleDateString(
                                'en-SG',
                                {
                                    weekday: 'short',
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                    timeZone: 'Asia/Singapore'
                                }
                            )
                        }
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

