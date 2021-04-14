import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import App from './App';
import { Cert } from './components/Cert';
import { NotFound } from './components/NotFound';

export const makeRouting = () => {
    return (
        <Router>
            <Switch>
                <Route
                    path="/milestone/10"
                    render={props => {
                        return <Cert dateString='1970-01-01' percent={10} { ...props } />
                    }}
                />
                <Route
                    path="/"
                    exact 
                    render={props => {
                        return <App {...props} />
                    }}
                />
                <Route component={NotFound} />
            </Switch>
        </Router>
    )
}