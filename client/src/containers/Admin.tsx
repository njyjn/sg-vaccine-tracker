import './App.css';
import React, { Component } from 'react';
import { Button, Container, Divider, Dropdown, DropdownProps, Form, Grid, Header, Icon, Menu, Message, TextArea } from 'semantic-ui-react';
import { apiEndpoint } from '../config';
import { withAuth0, WithAuth0Props } from '@auth0/auth0-react';
import { getAllCounts, recalculateAllHistoricals, syncLatestCount, upsertCounts } from '../api/counts-api';

interface AppState {
  stage: any,
  stageUrl: string
  upsertData: string
};

class Admin extends Component<WithAuth0Props> {
  state: AppState = {
    stage: apiEndpoint.split('/').reverse()[0],
    stageUrl: apiEndpoint,
    upsertData: '[]'
  }

  stageOptions = [
    { key: 'local', text: 'local', value: 'local'},
    { key: 'dev', text: 'dev', value: 'dev'},
    { key: 'prod', text: 'prod', value: 'prod'}
  ]

  loadAuthToken = async () => {
    return await this.props.auth0.getAccessTokenSilently();
  }

  syncLatestCount = async () => {
    try {
      await syncLatestCount(await this.loadAuthToken());
      alert('Success');
    } catch(error) {
      alert(error);
    }
  }

  downloadAllCounts = async () => {
    try {
      const counts = JSON.stringify(await getAllCounts(await this.loadAuthToken()));
      const countsBlob = new Blob([counts], {type: 'application/json'});
      const link = document.createElement('a');
      link.href = URL.createObjectURL(countsBlob);
      link.download = 'counts.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch(error) {
      alert(error);
    }
  }

  handleChange = (e: any, { name, value }: any) => this.setState({ [name]: value});

  upsertCounts = async () => {
    try {
      await upsertCounts(await this.loadAuthToken(), this.state.upsertData);
      alert('Success');
    } catch(error) {
      alert(error);
    }
  }

  recalculateAllHistoricals = async () => {
    try {
      const response = await recalculateAllHistoricals(await this.loadAuthToken());
      alert('Success');
    } catch(error) {
      alert (error);
    }
  }

  onStageSelect = (event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
    this.setState({
      stage: data.value
    })
  }

  logout = () => {
    this.props.auth0.logout({ returnTo: window.location.origin })
  }

  render() {
    return (
      <Container id='root' className='App' >
        <Menu inverted fixed='top'>
          <Menu.Item header>VTAdmin v0.0.1</Menu.Item>
          <Menu.Item>{this.props.auth0.user?.name}</Menu.Item>
          <Menu.Item
            name='logout'
            position='right'
          >
            <Button
              color='black'
              onClick={this.logout}
            >Logout</Button>
          </Menu.Item>
        </Menu>
        <Grid columns="1" centered divided>
          <Divider section hidden/>
          <Grid.Row>
            <Message floating error>
              <Message.Content>
                <Message.Header>
                  WARNING
                </Message.Header>
                <p>All actions performed herein can have major impacts on the presentation and perception of the ongoing public health crisis,
                  which can have far-reaching moral and political consequences.
                  By proceeding, <b>I, <u>{this.props.auth0.user?.name} ({this.props.auth0.user?.email})</u>,
                  certify under penalty of perjury under the laws of the State of California AND the Republic of Singapore that the following is true and correct:</b>
                  <ul style={{textAlign: 'left'}}>
                    <li>I have been given permission by the administrator to access this site at this given time, and for this given session</li>
                    <li>I am familiar with the operation of the functions contained in this admin page</li>
                    <li>I have verified that all data upserted is accurate and updated to the best of your abilities</li>
                    <li>I will not misuse or misconstrue downloaded data for malicious purposes</li>
                  </ul>
                  All actions performed by you herein are recorded for auditing purposes.
                </p>
              </Message.Content>
            </Message>
          </Grid.Row>
          <Grid.Row>
            <Dropdown
              disabled
              inverted
              button
              floating
              options={this.stageOptions}
              defaultValue={this.state.stage}
              onChange={this.onStageSelect}
            ></Dropdown>
          </Grid.Row>
          <Grid.Row>
            <p>
              Selected Stage: {this.state.stage}<br />
              Backend API URL: {this.state.stageUrl}
            </p>
          </Grid.Row>
          <Divider />
          <Grid.Row>
            <Button
              icon='download'
              label='Download data (JSON)'
              color="black"
              onClick={this.downloadAllCounts}
            />
          </Grid.Row>
          <Grid.Row>
            <Button
              disabled
              icon='upload'
              label='Upload and overwrite all data (JSON)'
              color="red"
              onClick={this.downloadAllCounts}
            />
          </Grid.Row>
          <Grid.Row>
            <Button
              icon='calculator'
              label='Recalculate all historicals'
              color="red"
              onClick={this.recalculateAllHistoricals}
            />
          </Grid.Row>
          <Grid.Row>
            <Button
              icon='sync'
              label='Obtain latest data'
              color="red"
              onClick={this.syncLatestCount}
            />
          </Grid.Row>
          <Grid.Row>
            <p>Last synced: {new Date().toUTCString()}</p>
          </Grid.Row>
          <Divider />
          <Grid.Row>
            <Grid.Column textAlign='center'>
              <Form
                onSubmit={this.upsertCounts}
                size='large'
                inverted>
                <Form.Field
                  control={TextArea}
                  label="Upsert Count"
                  name='upsertData'
                  value={this.state.upsertData}
                  onChange={this.handleChange}
                  placeholder='[{
                    "totalPopulation": 5685800,
                    "dateAsOf": "2021-04-06T00:00:00.000Z",
                    "percentagePrevious": 8.23,
                    "percentageChangeAvgPerDay": 0.4,
                    "valueChangeAvgPerDay": 22621,
                    "valuePrevious": 468000,
                    "percentageChange": 1.19,
                    "type": "fullyVaccinated",
                    "dateAsOfPrevious": "2021-04-03T00:00:00.000Z",
                    "valueChange": 67864,
                    "percentage": 9.42,
                    "percentChangeDelta": 0.28,
                    "daysElapsedSincePrevious": 3,
                    "value": 535864}]'
                >
                </Form.Field>
                <Form.Button
                  color="red"
                  type="submit"
                >Submit</Form.Button>
              </Form>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    )
  }
};

export default withAuth0(Admin);
