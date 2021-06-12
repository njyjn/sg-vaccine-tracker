import './App.css';
import React, { Component } from 'react';
import { Button, Divider, Dropdown, DropdownProps, Form, Grid, Menu, TextArea } from 'semantic-ui-react';
import { apiEndpoint } from '../config';
import { withAuth0, WithAuth0Props } from '@auth0/auth0-react';
import { syncLatestCount } from '../api/counts-api';

interface AppState {
  stage: any,
  stageUrl: string
};

class Admin extends Component<WithAuth0Props> {
  state: AppState = {
    stage: 'dev',
    stageUrl: apiEndpoint
  }

  stageOptions = [
    { key: 'dev', text: 'dev', value: 'dev'},
    { key: 'prod', text: 'prod', value: 'prod'}
  ]

  loadAuthToken = async () => {
    return await this.props.auth0.getAccessTokenSilently();
  }

  syncLatestCount = async () => {
    try {
      await syncLatestCount(await this.loadAuthToken());
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
                inverted
                button
                floating
                options={this.stageOptions}
                defaultValue='dev'
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
                color="red"
                onClick={this.syncLatestCount}
              >Sync latest count</Button>
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
