import * as React from 'react';
import { getLatestCount } from '../api/counts-api';
import { Count } from '../types/Count';

import { Dimmer, Header, Loader } from 'semantic-ui-react';

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
      
        return (
            <div>
                <Header as ="h3">
                    {new Date(this.state.count.dateAsOf).toDateString()}
                </Header>
                <Header as ="h1">
                    {Math.round(this.state.count.value / 5685800 * 10000.0) / 100}%
                </Header>
                <Header as ="h3">
                    of Singaporeans are fully vaccinated against COVID-19
                </Header>
            </div>
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
        return ("¯\\_(ツ)_/¯");
    }

}

