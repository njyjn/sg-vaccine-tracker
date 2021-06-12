import { Route, Router, Switch } from 'react-router-dom';
import Admin from '../containers/Admin';
import App from '../containers/App';
import { createBrowserHistory } from 'history'
import { Auth0Provider, withAuthenticationRequired } from '@auth0/auth0-react';
import { authConfig, apiEndpoint } from '../config';

const history = createBrowserHistory();

export default function AppRouter() {
  const ProtectedRoute = ({component, ...args}: any) => (
    <Route component={withAuthenticationRequired(component)} {...args} />
  );

  const onRedirectCallback = (appState: any) => {
    // Use the router's history module to replace the url
    history.replace(appState?.returnTo || window.location.pathname);
  };

  return (
    <Auth0Provider
      domain={authConfig.domain}
      clientId={authConfig.clientId}
      redirectUri={authConfig.callbackUrl}
      onRedirectCallback={onRedirectCallback}
      audience={apiEndpoint}
    >
    <Router history={history}>
      <Switch>
        <ProtectedRoute
          path="/admin" 
          component={Admin}
        />
        <Route exact path="/">
          <App />
        </Route>
      </Switch>
    </Router>
    </Auth0Provider>
  )
};
