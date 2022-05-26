// this is the main initial page shown

import React, {useRef, useEffect} from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import bbox from '@turf/bbox';
import { sub } from 'date-fns';
import get from 'lodash.get';
import find from 'lodash.find';

import Popups from '../../utils/Popup';
import PopupButton from '../../utils/PopupButton';
import MapButton from '../../utils/MapButton';

import { headingAlt } from '../../styles/type/heading';
import { glsp } from '../../styles/utils/theme-values';
import Prose from '../../styles/type/prose';

//import {toast} from 'react-toastify';
//import 'react-toastify/dist/ReactToastify.css'

import App from '../common/app';
import ExpMapPrimePanel from './prime-panel';
import {
  Inpage,
  InpageHeader,
  InpageHeaderInner,
  InpageHeadline,
  InpageTitle,
  InpageBody
} from '../../styles/inpage';
import MbMap from '../common/mb-map-explore/mb-map';
import Timeline from '../common/timeline';

import { showGlobalLoading, hideGlobalLoading } from '../common/global-loading';
import { themeVal } from '../../styles/utils/general';
import media from '../../styles/utils/media-queries';
import { wrapApiResult } from '../../redux/reduxeed';
import {
  // fetchCogTimeData as fetchCogTimeDataAction,
  invalidateCogTimeData as invalidateCogTimeDataAction
} from '../../redux/cog-time-data';
import { utcDate } from '../../utils/utils';
import { getGlobalLayers } from '../common/layers';
import {
  setLayerState,
  getLayerState,
  getLayersWithState,
  resizeMap,
  getInitialMapExploreState,
  handlePanelAction,
  getActiveTimeseriesLayers,
  getCommonQsState,
  handleMapAction,
  toggleLayerCommon
} from '../../utils/map-explore-utils';
import QsState from '../../utils/qs-state';
import { round } from '../../utils/format';

/**
 * Returns a feature with a polygon geometry made of the provided bounds.
 * If a feature is provided, the properties are maintained.
 *
 * @param {object} feature Feature to update
 * @param {object} bounds Bounds in NE/SW format
 */
const updateFeatureBounds = (feature, bounds) => {
  const {
    ne: [neLng, neLat],
    sw: [swLng, swLat]
  } = bounds;

  const coordinates = [
    [
      [swLng, neLat],
      [neLng, neLat],
      [neLng, swLat],
      [swLng, swLat],
      [swLng, neLat]
    ]
  ];

  return feature
    ? {
      ...feature,
      geometry: { type: 'Polygon', coordinates }
    }
    : {
      type: 'Feature',
      id: 'aoi-feature',
      properties: {},
      geometry: { type: 'Polygon', coordinates }
    };
};

const ExploreCanvas = styled.div`
  display: grid;
  height: 100%;
  grid-template-columns: min-content 1fr min-content;
  overflow: hidden;

  ${media.mediumDown`
    ${({ panelPrime, panelSec }) => {
      if (panelPrime && !panelSec) {
        return 'grid-template-columns: min-content 0 0;';
      }

      if (!panelPrime && panelSec) {
        return 'grid-template-columns: 0 0 min-content;';
      }
    }}
  `}

  > * {
    grid-row: 1;
  }
`;

const ExploreCarto = styled.section`
  position: relative;
  height: 100%;
  background: ${themeVal('color.baseAlphaA')};
  display: grid;
  grid-template-rows: 1fr auto;
  min-width: 0;
  overflow: hidden;
`;

const dateMax = (...args) =>
  args.reduce((curr, d) => (curr.getTime() > d.getTime() ? curr : d));

const cogLayers = {
  // no2: {
  //   title: <>NO<sub>2</sub> Concentration</>,
  //   unit: <>molecules/cm<sup>2</sup></>
  // },
  // co2: {
  //   title: <>CO<sub>2</sub> Concentration</>,
  //   unit: 'ppm'
  // }
};

const IntroWelcomeTitle = styled.h1`
  font-size: 1.25rem;
  line-height: 1.5rem;
  margin: 0;


  ${media.mediumUp`
    font-size: 1.5rem;
    line-height: 1.75rem;
  `}

  small {
    ${headingAlt()}
    display: block;

    ${media.mediumUp`
      font-size: 1rem;
      line-height: 1;
    `}
  }

  strong {
    display: block;
    font-size: 2rem;
    line-height: 2.5rem;
    letter-spacing: -0.016em;
  }
`;

const IntroWelcome = styled.section`
  display: grid;
  grid-gap: ${glsp()};
  padding: ${glsp()};
  box-shadow: 0 1px 0 0 ${themeVal('color.baseAlphaB')};

  ${Prose} {
    a {
      font-weight: ${themeVal('type.base.bold')};
    }
  }

  ${media.mediumUp`
    grid-gap: ${glsp()} 0;
    padding: ${glsp(1.25, 2)};
  `}
`;

class GlobalExplore extends React.Component {
  constructor (props) {
    super(props);
    // Functions from helper file.
    this.setLayerState = setLayerState.bind(this);
    this.getLayerState = getLayerState.bind(this);
    this.getLayersWithState = getLayersWithState.bind(this);
    this.getActiveTimeseriesLayers = getActiveTimeseriesLayers.bind(this);
    this.resizeMap = resizeMap.bind(this);
    this.onPanelAction = this.onPanelAction.bind(this);
    this.onMapAction = this.onMapAction.bind(this);
    this.sliderValue = 90;
    this.tileOpacity = this.tileOpacity.bind(this);
    this.mapStyle = this.mapStyle.bind(this);
    this.updateToggleLayer = this.updateToggleLayer.bind(this)
    this.count = 0;
    //this.tileOpacity = 100;
    // Ref to the map component to be able to trigger a resize when the panels
    // are shown/hidden.
    this.mbMapRef = React.createRef();

    // Set query state definition for url state storing.
    const common = getCommonQsState(props);
    common.layers.default = props.mapLayers
      .filter((l) => l.enabled)
      .map((l) => l.id);
    this.qsState = new QsState({
      ...common,
      bbox: {
        accessor: 'aoi.feature',
        default: null,
        hydrator: (box) => {
          if (!box) return null;
          // Feature from bbox.
          const b = box.split(',').map(Number);
          if (b.some(isNaN)) return null;
          return updateFeatureBounds(null, {
            ne: [b[2], b[3]],
            sw: [b[0], b[1]]
          });
        },
        dehydrator: (feat) => {
          // bbox from feature.
          if (!feat) return null;
          return bbox(feat)
            .map((v) => round(v, 5))
            .join(',');
        }
      }
    });
    // The active layers can only be enabled once the map loads. The toggle
    // layer method checks the state to see what layers are enabled so we can't
    // store the active layers from the url in the same property, otherwise
    // they'd be disabled.
    // They get temporarily stored in another property and once the map loads
    // the layers are enabled and stored in the correct property.
    const { activeLayers, ...urlState } = this.qsState.getState(
      props.location.search.substr(1)
    );
    this.state = {
      ...getInitialMapExploreState(),
      ...urlState,

      aoi: {
        ...urlState.aoi,
        drawing: false,
        selected: false,
        actionOrigin: null
      },
      _urlActiveLayers: activeLayers,
      tileOpacity: 100,
      mapStyle:'mapbox://styles/covid-nasa/ckb01h6f10bn81iqg98ne0i2y',
      panelPrime: false,
      panelSec: false,
      // Init dates for cog data according to a default.
      cogDateRanges: Object.keys(cogLayers).reduce((acc, id) => {
        const l = props.mapLayers.find(l => l.id === id);
        const timeUnit = l.timeUnit || 'month';
        const end = utcDate(l.domain[l.domain.length - 1]);
        const domainStart = utcDate(l.domain[0]);
        const start = timeUnit === 'month'
          ? dateMax(sub(end, { months: 11 }), domainStart)
          : dateMax(sub(end, { months: 2 }), domainStart);

        return {
          ...acc,
          [id]: {
            start, end
          }
        };
      }, {})
    };
  }

  componentWillUnmount () {
    this.props.invalidateCogTimeData();
  }

  onPanelChange (panel, revealed) {
    this.count = 0;
    this.setState({ [panel]: revealed });
  }

  tileOpacity(value){
    // this.state.tileOpacity = value;
    this.setState({
      tileOpacity:value
    })
  }

  mapStyle(){
    var prevActiveLayer = this.state.activeLayers;
    this.setState({
      mapStyle:"mapbox://styles/mapbox/satellite-streets-v11",
      activeLayers:[],
    })
  }
  
  updateToggleLayer(passLayer){
    const layerd = this.getLayersWithState();
    this.onPanelAction('layer.toggle', passLayer)
  }

  updateUrlQS () {
    // const qString = this.qsState.getQs(this.state);
    // this.props.history.push({ search: qString });
    //console.log(qString)
  }

  onPanelAction (action, payload) {
    this.count = 0;
    handlePanelAction.call(this, action, payload);
  }

  async onMapAction (action, payload) {
    // Returns true if the action was handled.
    handleMapAction.call(this, action, payload);
  }

  toggleLayer (layer) {
    toggleLayerCommon.call(this, layer, () => {
      //console.log('inside toggle layer')
      this.updateUrlQS();
      //this.requestCogData();
    });

  }

  render () {
    // const { spotlightList } = this.props;
    const popup_lr = 'popup-left-right'
    const popup_tline = 'popup-timeline'

    const layers = this.getLayersWithState();
    const activeTimeseriesLayers = this.getActiveTimeseriesLayers();
    // const activeCogTimeseriesLayers = activeTimeseriesLayers
    //   .filter(l => !!cogLayers[l.id]);

    // Check if there's any layer that's comparing.
    const comparingLayer = find(layers, 'comparing');
    const isComparing = !!comparingLayer;
    ++this.count

    // console.log(activeTimeseriesLayers.length)
    // const mapLabel = get(comparingLayer, 'compare.mapLabel');
    // const compareMessage =
    //   isComparing && mapLabel
    //     ? typeof mapLabel === 'function'
    //       ? mapLabel(this.state.timelineDate)
    //       : mapLabel
    //     : '';
                                       
    return (
      <App hideFooter>
        <Inpage isMapCentric>
          <InpageHeader>
            <InpageHeaderInner>
              <InpageHeadline>
                <InpageTitle>Map</InpageTitle>
              </InpageHeadline>
            </InpageHeaderInner>
          </InpageHeader>
          <InpageBody>
            <ExploreCanvas panelPrime={this.state.panelPrime} panelSec={this.state.panelSec}>
              <ExpMapPrimePanel
                layers={layers}
                mapLoaded={this.state.mapLoaded}
                aoiState={this.state.aoi}
                onAction={this.onPanelAction}
                onPanelChange={({ revealed }) => {
                  this.resizeMap();
                  this.onPanelChange('panelPrime', revealed);
                }}
                tileOpacity={this.tileOpacity}
              />
              <ExploreCarto>
                <MbMap
                  ref={this.mbMapRef}
                  position={this.state.mapPos}
                  onAction={this.onMapAction}
                  layers={layers}
                  activeLayers={this.state.activeLayers}
                  date={this.state.timelineDate}
                  aoiState={this.state.aoi}
                  comparing={isComparing}
                  enableLocateUser
                  enableOverlayControls
                  tileOpacity={this.state.tileOpacity}
                  mapStyle={this.mapStyle}
                  updateToggleLayer={this.updateToggleLayer}
                /> 
                {/* <MapButton mapStyle={this.mapStyle}/> */}
                <PopupButton /> 
                {this.count === 2 && !localStorage.getItem(popup_lr) && < Popups value={['Hey, Welcome to Lightning Dashboard']} place={'top-right'} timer={2000} whichPop={popup_lr}/>}
                {this.count === 2 && !localStorage.getItem(popup_lr) && <Popups value={['Here in the left nav bar you can toggle  to activate layers']} place={'top-left'} timer={3000} whichPop={popup_lr}/>}
                {!!activeTimeseriesLayers.length && this.count === 2 && !localStorage.getItem(popup_tline) && <Popups value={['This is Timeline. Scroll to render layers based on different dates.']} place={'bottom-left'} timer={4000} whichPop={popup_tline}/>}
                <Timeline
                  isActive={!!activeTimeseriesLayers.length}
                  layers={activeTimeseriesLayers}
                  date={this.state.timelineDate}
                  onAction={this.onPanelAction}
                  onSizeChange={this.resizeMap}
                />
              </ExploreCarto>
            </ExploreCanvas>
          </InpageBody>
        </Inpage>
      </App>
    );
  }
}

GlobalExplore.propTypes = {
  invalidateCogTimeData: T.func,
  mapLayers: T.array,
  cogTimeData: T.object,
  spotlightList: T.object,
  location: T.object,
  history: T.object
};

function mapStateToProps (state, props) {
  return {
    spotlightList: wrapApiResult(state.spotlight.list),
    mapLayers: getGlobalLayers(),
    cogTimeData: wrapApiResult(state.cogTimeData, true)
  };
}

const mapDispatchToProps = {
  invalidateCogTimeData: invalidateCogTimeDataAction
};

export default connect(mapStateToProps, mapDispatchToProps)(GlobalExplore);
