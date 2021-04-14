import './Cert.css';
import 'semantic-ui-css/semantic.min.css';

import * as React from 'react';

import { Grid, Header, Progress, Segment, Image, Popup } from 'semantic-ui-react';
import { v4 as uuidv4 } from 'uuid';

interface CertProps {
    percent: number
    dateString: string
};

interface CertState {
    dateString: string
};

export class Cert extends React.PureComponent<CertProps, CertState> {    
    state: CertState = {
        dateString: new Date(this.props.dateString).toLocaleDateString(
            'en-SG',
            {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                timeZone: 'Asia/Singapore'
            }
        )
    };
    
    render() {
        return (
            this.renderCert()
        )
    }

    renderCert() {
        return (
            <div className="Cert">
                <div className="Cert-container">
                    <Grid centered columns='1' divided>
                        <Grid.Row>
                            <Grid.Column textAlign="center">
                                {/* <Icon size="big" name="syringe" color="red" /> */}
                                <Image centered rounded src='/logo-gold512.png' size="small"></Image>
                                <Header size="small">
                                    Milestone Reached<br></br>
                                    {this.state.dateString}
                                </Header>
                                <Header size="huge">
                                    Singapore
                                </Header>
                                <Header size="tiny">
                                    has vaccinated at least
                                </Header>
                                <Header size="huge">
                                    {this.props.percent}%
                                </Header>
                                <Progress percent={this.props.percent} color='black' size='tiny' ></Progress>
                                <Header size="tiny">
                                    of its population against COVID-19
                                </Header>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                    <Popup
                        trigger={
                            <Segment raised className='nft-segment' style={{position: 'absolute', bottom: '5%'}}>
                                <label>Certificate UUID: {uuidv4()}</label>
                            </Segment>
                        }
                        content='Congratulations, this certificate is uniquely yours! You will never be able to generate an original like this one, ever again.'
                        inverted
                        position='top center'
                    />
                </div>
            </div>
        )
    }
}
