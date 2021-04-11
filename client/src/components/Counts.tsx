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
            alert('Failed to fetch latest update. Please try again later');
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
                <p>Vaccines save lives and have been <a
                    className="App-link"
                    href="https://www.cdc.gov/coronavirus/2019-ncov/vaccines/keythingstoknow.html"
                    target="_blank"
                    rel="noopener noreferrer"
                >proven</a> to reduce the severity and incidence of infection. If you don't believe in science -- "you do you", but please stop spreading fear and misinformation. Your loved ones are at risk.</p>
                <p>Latest data from <a
                    className="App-link"
                    href="https://www.moh.gov.sg/covid-19/vaccination"
                    target="_blank"
                    rel="noopener noreferrer"
                >MOH</a> and based on total population of 5,685,800 from the <a
                    className="App-link"
                    href="https://www.singstat.gov.sg/find-data/search-by-theme/population/population-and-population-structure/latest-data"
                    target="_blank"
                    rel="noopener noreferrer"
                >latest government statistics</a>. Attempts are made to retrieve data from aforementioned sources daily but may not be up to date. Use at your own risk. View or contribute to <a
                        className="App-link"
                        href="https://www.github.com/njyjn/sg-vaccine-tracker"
                        target="_blank"
                        rel="noopener noreferrer"
                    >source code</a>.
                </p>
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

