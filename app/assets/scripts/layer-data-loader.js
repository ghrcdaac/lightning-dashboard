// mainly used to getch the layer-loder (agriculture, no2, co2) --> in our case will be NALMA and ISSLIS

import '@babel/polyfill';
import React,{useState} from 'react';
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
    //showGlobalLoadingMessage('Loading datasets');
  }

  // async requestData () {
  //   const ids = ['global'];
  //   await Promise.all(
  //     ids.map(async (spotlightId) => {
  //       const { body } = await fetchJSON(
  //         `${config.api}/datasets/${spotlightId}`
  //       );
  //       //console.log(body.datasets.splice(1,5))
  //       body.datasets[0].name = 'TRMM LIS'
  //       body.datasets[1].name = 'NALMA'

  //       body.datasets[0].id = 'TRMM LIS'
  //       body.datasets[1].id = 'NALMA'

  //       //body.datasets[1].legend.type = "categorical"
  //       //console.log(body.datasets[0], body.datasets[1]);
  //       console.log(body.datasets)
  //       body.datasets[0].source.tiles[0] = API_TERRACOTTA;
  //       storeSpotlightLayers(spotlightId, body.datasets);
  //       console.log('v4')
  //     })
  //   );
  //   hideGlobalLoading();
  //   this.props.onReady();
  // }

  requestData(){

    //https://wug8w3fg42.execute-api.us-west-2.amazonaws.com/development/singleband/VHRAC/2013_01_02/LIS/{z}/{x}/{y}.png?colormap=greys&stretch_range=[0.00009533741103950888,0.0724964290857315]

    const local_full_link = "http://localhost:5000/singleband/VHRFC/201301/LIS/{z}/{x}/{y}.png?colormap=terrain&stretch_range=[0.325,23.426]"
    const local_seasonal_link = "http://localhost:5000/singleband/VHRSC/{date}/LIS/{z}/{x}/{y}.png?colormap=terrain&stretch_range=[0.00010455249866936356,0.06766455620527267]"
    const local_monthly_link = "http://localhost:5000/singleband/VHRMC/{date}/LIS/{z}/{x}/{y}.png?colormap=terrain&stretch_range=[0.00010455249866936356,0.06766455620527267]"
    const local_diurnal_link = "http://localhost:5000/singleband/VHRDC/{date}/LIS/{z}/{x}/{y}.png?colormap=terrain&stretch_range=[0,0.002]"
    const local_annual_link = "http://localhost:5000/singleband/VHRAC/{date}/LIS/{z}/{x}/{y}.png?colormap=terrain&stretch_range=[0.00010455249866936356,0.06766455620527267]";

    const aws_full_link = "https://wug8w3fg42.execute-api.us-west-2.amazonaws.com/development/singleband/VHRFC/201301/LIS/{z}/{x}/{y}.png?colormap=terrain&stretch_range=[0.325,23.426]"
    const aws_seasonal_link = "https://wug8w3fg42.execute-api.us-west-2.amazonaws.com/development/singleband/VHRSC/{date}/LIS/{z}/{x}/{y}.png?colormap=terrain&stretch_range=[0.00010455249866936356,0.06766455620527267]"
    const aws_monthly_link = "https://wug8w3fg42.execute-api.us-west-2.amazonaws.com/development/singleband/VHRMC/{date}/LIS/{z}/{x}/{y}.png?colormap=terrain&stretch_range=[0.00010455249866936356,0.06766455620527267]"
    const aws_diurnal_link = "https://wug8w3fg42.execute-api.us-west-2.amazonaws.com/development/singleband/VHRDC/{date}/LIS/{z}/{x}/{y}.png?colormap=terrain&stretch_range=[0,0.002]"
    const aws_annual_link = "https://wug8w3fg42.execute-api.us-west-2.amazonaws.com/development/singleband/VHRAC/{date}/LIS/{z}/{x}/{y}.png?colormap=terrain&stretch_range=[0.00010455249866936356,0.06766455620527267]";

    const new_api = "http://localhost:5000/singleband/VHRSC/201301/LIS/{z}/{x}/{y}.png?colormap=terrain&stretch_range=[0.00010150651360163465,0.08632528781890869]"

    const dataset = []

    dataset.push(datasets('TRMM LIS Full', '2013-01', '2013-01', aws_full_link,'month', "Shows the entire mean flash rate density from 1998 to 2013."));
    dataset.push(datasets('TRMM LIS Seasonal', '2013-01', '2013-04', aws_seasonal_link,'month', "Shows the seasonal mean flash rate density throughout 1998 to 2013."));
    dataset.push(datasets('TRMM LIS Monthly', '2013-01', '2013-12', aws_monthly_link,'month', "Shows the monthly mean flash rate density throughout 1998 to 2013."));
    dataset.push(datasets('TRMM LIS Diurnal', '2012-01', '2013-12', aws_diurnal_link,'month', "Shows the (daily) hourly mean flash rate density throughout 1998 to 2013."));
    dataset.push(datasets('TRMM LIS Daily', '2013-01', '2013-12', aws_annual_link,'day', "Shows the daily mean flash rate density throughout 1998 to 2013."));
    // dataset.push(datasets('NALMA Source Density', '2013-01', '2013-12', null, 'month', "The North Alabama Lightning Mapping Array (NALMA) data are used to validate the Lightning Imaging Sensor (LIS) on the International Space Station (ISS), the Geostationary Lightning Mapper (GLM) instrument, and other current and future lightning measurements."));
    // dataset.push(datasets('NALMA Flash Extent Density', '2013-01', '2013-12', null, 'month', "The North Alabama Lightning Mapping Array (NALMA) data are used to validate the Lightning Imaging Sensor (LIS) on the International Space Station (ISS), the Geostationary Lightning Mapper (GLM) instrument, and other current and future lightning measurements."));
    console.log('v6')
    storeSpotlightLayers('global', dataset);
    this.props.onReady();
  }

  render () {
    return null;
  }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const datasets = (name, startDate, endDate, API, timeUnit, info) =>{

  var compareURL = 'https://wug8w3fg42.execute-api.us-west-2.amazonaws.com/development/singleband/VHRAC/2013_01_01/LIS/{z}/{x}/{y}.png?colormap=terrain&stretch_range=[0.00010455249866936356,0.06766455620527267]'
  var domain = [startDate+"-01T00:00:00Z",endDate+"-01T00:00:00Z"]
  var isPeriodic = true;
  var type = 'raster-timeseries'

  if (name === 'TRMM LIS Full'){
    domain = [startDate+"-01T00:00:00Z",endDate+"-01T00:00:00Z"]
    timeUnit = 'month'
    isPeriodic = true;
    //type = 'raster';
  }else if(name === 'TRMM LIS Seasonal'){
    timeUnit = 'day'
    domain = ["2013-03-01T00:00:00Z","2013-07-01T00:00:00Z","2013-10-01T00:00:00Z","2013-12-01T00:00:00Z"]
  }else if(name === 'TRMM LIS Diurnal'){
    timeUnit = 'day'
    domain= ["2013-01-01T00:00:00Z","2013-01-15T00:00:00Z",
             "2013-02-01T00:00:00Z","2013-02-15T00:00:00Z", 
             "2013-03-01T00:00:00Z","2013-03-15T00:00:00Z",
             "2013-04-01T00:00:00Z","2013-04-15T00:00:00Z",
             "2013-05-01T00:00:00Z","2013-05-15T00:00:00Z",
             "2013-06-01T00:00:00Z","2013-06-15T00:00:00Z",
             "2013-07-01T00:00:00Z","2013-07-15T00:00:00Z",
             "2013-08-01T00:00:00Z","2013-08-15T00:00:00Z",
             "2013-09-01T00:00:00Z","2013-09-15T00:00:00Z",
             "2013-10-01T00:00:00Z","2013-10-15T00:00:00Z",
             "2013-11-01T00:00:00Z","2013-11-15T00:00:00Z",
             "2013-12-01T00:00:00Z","2013-12-15T00:00:00Z",
            ] 
    
  }else if(name === 'TRMM LIS Annual'){
    timeUnit = 'day';
    domain = [startDate+"-01T00:00:00Z",endDate+"-30T00:00:00Z"]
  }

  return {
    backgroundSource: null,
    compare: {
      enabled: true,
      help: "Compare with baseline",
      map_label: "{date}: Base vs Mean",
      source:{
        // tiles: ['https://8ib71h0627.execute-api.us-east-1.amazonaws…olor_map=custom_no2&color_formula=gamma r {gamma}'],
        tiles:[compareURL],
        type: "raster"
      },
      time_unit: null,
      year_diff: 0,
    },
    domain:domain,
    exclusiveWith:[], 
    id: name,
    info: info,
    isPeriodic: isPeriodic,
    legend:categorical,
    name: name,
    paint: null,
    source:{
      tiles: [API],
      type: "raster"
    },
    swatch: {color: '#C0C0C0', name: 'Grey'},
    timeUnit: timeUnit,
    type: type,
  }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const gradient = {
  max: "No Data",
  min: "Most Data",
  stops:[
  "#41F6EE",
  "#80F355",
  "#F0F554",
  "#B88E85",
  "#F0EAE8",
  ],
  type: "gradient"
}

const categorical = {
  max: null,
  min: null,
  stops:[
    {color: '#F4F5D3', label: 'Exceptional'},
    {color: '#794416', label: 'Favourable'},
    {color: '#F3EF4F', label: 'Watch'},
    {color: '#6ECC51', label: 'Few'},
    {color: '#3C8EC4', label: 'Poor'},
  ],
  type: "categorical" 
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
