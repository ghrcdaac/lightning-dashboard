// mainly used to getch the layer-loder (agriculture, no2, co2) --> in our case will be NALMA and ISSLIS

import '@babel/polyfill';
import React,{useState} from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';

import config from './config';
import { fetchJSON, wrapApiResult } from './redux/reduxeed';

import { storeSpotlightLayers } from './components/common/layers';
import LAYER_JSON from './data/layers';

class LayerDataLoader extends React.Component {
  
  componentDidMount () {
    this.requestData();
  }

  requestData(){
    const dataset = []
    LAYER_JSON.layer.map((layer)=>dataset.push(layer))
    console.log('v12')
    storeSpotlightLayers('global', dataset);
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
