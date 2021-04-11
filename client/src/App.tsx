import './App.css';
import { Component } from 'react';
import { Counts } from './components/Counts';
import { Grid, Icon, List } from 'semantic-ui-react';

export interface AppProps {};

export interface AppState {};

export default class App extends Component<AppProps, AppState> {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <Grid centered columns='1' divided>
            {this.displayCount()}
            <Grid.Row>
              <Grid.Column textAlign='center'>
                <p>Vaccines save lives and have been proven to reduce the severity and incidence of infection. Resources for information on vaccines:</p>
                <List>
                  <li className="App-listitem">Singapore COVID-19 Vaccination Registration [<a
                    className="App-link"
                    href="https://www.vaccine.gov.sg/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >portal</a>]</li>
                  <li className="App-listitem">mRNA vaccines, explained [<a
                    className="App-link"
                    href="https://www.youtube.com/watch?v=mvA9gs5gxNY"
                    target="_blank"
                    rel="noopener noreferrer"
                  >youtube</a>]</li>
                  <li className="App-listitem">Insights on Vaccine Hesitancy from Religious People's View of Science [<a
                    className="App-link"
                    href="https://berkleycenter.georgetown.edu/responses/insights-on-vaccine-hesitancy-from-religious-people-s-view-of-science"
                    target="_blank"
                    rel="noopener noreferrer"
                  >article</a>]</li>
                </List>

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
                >latest government statistics</a>. Attempts are made to retrieve data from aforementioned sources daily but is not guaranteed to be up to date. No affiliation with any government entity. Use at your own risk. 
                Meta photo by <a
                  className="App-link"
                  href="https://unsplash.com/@shawnanggg?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
                  target="_blank"
                  rel="noopener noreferrer"
                >Shawn Ang</a> on <a
                  className="App-link"
                  href="https://unsplash.com/@shawnanggg?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
                  target="_blank"
                  rel="noopener noreferrer"
                >Unsplash</a>.</p>
                <p><Icon name="github" inverted /><a
                  className="App-link"
                  href="https://www.github.com/njyjn/sg-vaccine-tracker"
                  target="_blank"
                  rel="noopener noreferrer"
                >Source</a>
                </p>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
      </div>
    )
  }

  displayCount() {
    return <Counts {...this.props}/>
  }
};
