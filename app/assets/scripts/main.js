import '@babel/polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import ReactGA from 'react-ga';
import ReactTooltip from 'react-tooltip';

import theme from './styles/theme/theme';
import store from './utils/store';
import history from './utils/history';
import config from './config';

import GlobalStyles from './styles/global';
import ErrorBoundary from './fatal-error-boundary';
import { GlobalLoading } from './components/common/global-loading';
import LayerDataLoader from './layer-data-loader';

// Views
import GlobalExplore from './components/global';
import Download from './utils/Download';
import UhOh from './components/uhoh';

const { gaTrackingCode } = config;

// Google analytics
if (gaTrackingCode) {
  ReactGA.initialize(gaTrackingCode);
  ReactGA.pageview(window.location.pathname + window.location.search);
  history.listen(location => ReactGA.pageview(location.pathname + location.search));
}
// Root component. Used by the router.
class Root extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      windowHeight: window.innerHeight,
      dataReady: false
    };
    window.addEventListener('resize', () => {
      // Store the height to set the page min height. This is needed for mobile
      // devices to account for the address bar, since 100vh does not work.
      // https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
      this.setState({ windowHeight: window.innerHeight });
    });
  }
  
  componentDidMount () {
    // Hide the welcome banner.
    const banner = document.querySelector('#welcome-banner');
    banner.classList.add('dismissed');
    setTimeout(() => banner.remove(), 500);
  }
  
  render () {
    return (
      <Provider store={store}>
        <Router history={history}>
          <ThemeProvider theme={theme.main}>
            <ErrorBoundary>
              <GlobalStyles innerHeight={this.state.windowHeight} />
              <LayerDataLoader
                onReady={() => this.setState({ dataReady: true })}
              />
              {this.state.dataReady && (
                <Switch>
                  <Route exact path='/' component={GlobalExplore} /> 
                  <Route exact path="/download" component={Download} />
                  <Route path='*' component={UhOh} />
                </Switch>
              )}
              <GlobalLoading />
              <ReactTooltip effect='solid' className='type-primary' />
            </ErrorBoundary>
          </ThemeProvider>
        </Router>
      </Provider>
    );
  }
}

render(<Root store={store} />, document.querySelector('#app-container'));
