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
const colormaps = ['terrain', 'gist_ncar', 'nipy_spectral','spectral']
const API_TERRACOTTA = "https://46uycbmhw2.execute-api.us-west-2.amazonaws.com/development/singleband/index/{date}/B02/{z}/{x}/{y}.png?colormap="+colormaps[0]+"&stretch_range=[0,0.0571533739566803]"

const s3_obj = "s3://ghrc-cog/optimized/S2A_202001_135032_27XVB_B02.tif"
const s3_http = "https://ghrc-cog.s3.us-west-2.amazonaws.com/optimized/S2A_202001_135032_27XVB_B02.tif"

var link = []

//"https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/2020/S2A_36QWD_20200701_0_L2A/TCI.tif"

link.push("https://2qoyo0y2wg.execute-api.us-west-2.amazonaws.com/cog/tiles/{z}/{x}/{y}.png?url=https://ghrc-cog.s3.us-west-2.amazonaws.com/optimized/S2A_202001_135032_27XVB_B02.tif")
link.push("https://2qoyo0y2wg.execute-api.us-west-2.amazonaws.com/cog/tiles/WebMercatorQuad/{z}/{x}/{y}@1x?url=https://sentinel-cogs.s3.us-west-2.amazonaws.com%2Fsentinel-s2-l2a-cogs%2F2020%2FS2A_36QWD_20200701_0_L2A%2FTCI.tif&bidx=2&bidx=2&bidx=1")
link.push("https://2qoyo0y2wg.execute-api.us-west-2.amazonaws.com/cog/tiles/{z}/{x}/{y}.png?url=https://ghrc-cog.s3.amazonaws.com/optimized/S2A_202001_135032_27XVB_B02.tif&resampling_method=nearest&bidx=1&color_map=custom_cropmonitor")
const API_TI = link[2]

//"https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/6/17/24@1x?url=s3://covid-eo-data/agriculture-cropmonitor/CropMonitor_202203.tif&resampling_method=nearest&bidx=1&color_map=custom_cropmonitor"

class LayerDataLoader extends React.Component {
  
  componentDidMount () {
    this.requestData();
    showGlobalLoadingMessage('Loading datasets');
  }

  async requestData () {
    const ids = ['global'];
    await Promise.all(
      ids.map(async (spotlightId) => {
        const { body } = await fetchJSON(
          `${config.api}/datasets/${spotlightId}`
        );
        console.log(body.datasets.splice(1,5))
        body.datasets[0].name = 'TRMM LIS'
        body.datasets[1].name = 'NALMA'
        //console.log(body.datasets[0].source.tiles[0]);
        body.datasets[0].source.tiles[0] = API_TERRACOTTA;
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
