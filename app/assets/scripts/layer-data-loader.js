// mainly used to getch the layer-loder (agriculture, no2, co2) --> in our case will be NALMA and ISSLIS

import '@babel/polyfill';
import React from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';

import config from './config';
import { fetchJSON, wrapApiResult } from './redux/reduxeed';

import {
  hideGlobalLoading,
  showGlobalLoadingMessage
} from './components/common/global-loading';
import { storeSpotlightLayers } from './components/common/layers';

// Dev note:
// The datasets (or map layers) information was moved to the api, however some
// parts of the app access the data in a synchronous way, making it impossible
// to fetch datatsets on demand. The homepage itself requires several datasets
// to be loaded so the map can be animated.
// For the time being, layers will be front loaded as part of the application
// bootstrap process and only when all the data is present the app will start.
// This allows us to quickly get the datasets information from the api without
// significant refactor. This was decided taking into account that significant
// development is planned for the near future.

class LayerDataLoader extends React.Component {
  
  componentDidMount () {
    showGlobalLoadingMessage('Loading datasets');
    this.requestData();
  }

  async requestData () {
    const ids = ['global'];
    await Promise.all(
      ids.map(async (spotlightId) => {
        const { body } = await fetchJSON(
          `${config.api}/datasets/${spotlightId}`
        );
        console.log(body.datasets.splice(1,5))
        body.datasets[0].name = 'NALMA'
        body.datasets[1].name = 'ISS LIS'
        storeSpotlightLayers(spotlightId, body.datasets);
      })
    );

    hideGlobalLoading();
    this.props.onReady();
  }


  render () {
    return null;
  }
}

LayerDataLoader.propTypes = {
  spotlightList: T.object,
  onReady: T.func
};

function mapStateToProps (state, props) {
  return {
    spotlightList: wrapApiResult(state.spotlight.list)
  };
}

export default connect(mapStateToProps, {})(LayerDataLoader);
