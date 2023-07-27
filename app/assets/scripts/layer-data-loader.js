// mainly used to getch the layer-loder (agriculture, no2, co2) --> in our case will be NALMA and ISSLIS

import '@babel/polyfill';
import React from 'react';
import T from 'prop-types';

import { storeSpotlightLayers } from './components/common/layers';
import LAYER_JSON from './data/layers';
import conf from './configuration.json'

class LayerDataLoader extends React.Component {
  
  componentDidMount () {
    this.requestData();
  }

  requestData(){
    const api = conf.api
    const dataset = []
    LAYER_JSON.layer.map((layer)=>dataset.push(layer))
    dataset.map((layer)=>{
      layer.source.tiles = [api + layer.source.tiles]
    })
    console.log('v14')
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

export default LayerDataLoader;
