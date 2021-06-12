import './App.css';
import React, { Component } from 'react';
import { Button, Divider, Dropdown, DropdownProps, Form, FormProps, Grid, Menu, TextArea } from 'semantic-ui-react';
import { apiEndpoint } from '../config';
import { withAuth0, WithAuth0Props } from '@auth0/auth0-react';
import { getAllCounts, syncLatestCount, upsertCounts } from '../api/counts-api';

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
      <div className="App">
        <div className="App-header">
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
                label='Download data as JSON'
                color="blue"
                onClick={this.downloadAllCounts}
              />
            </Grid.Row>
            <Grid.Row>
              <Button
                icon='sync'
                label='Sync latest count'
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
                <Form size='large' inverted>
                  <Form.Field
                    control={TextArea}
                    label="Upsert Count"
                    placeholder="Input JSON"
                  >
                  </Form.Field>
                  <Button color="red" type="submit">Submit</Button>
                </Form>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
      </div>
    )
  }
};

export default withAuth0(Admin);
