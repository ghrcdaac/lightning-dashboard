import React from 'react';
import T from 'prop-types';
import styled, { withTheme, ThemeProvider } from 'styled-components';
import mapboxgl from 'mapbox-gl';
import CompareMbGL from 'mapbox-gl-compare';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import find from 'lodash.find';

import MapButton from '../../../utils/MapButton';
// import geoJson from './chicago-parks.json';
import geoJson2 from './chicago-parks2.json'
import data2 from './data2.json';
import Marker from '../../../utils/Marker';
import MarkerButton from '../../../utils/MarkerButton';
import { Background } from '../../../utils/FilteredData';
import CalendarTag from '../../../utils/CalendarTag';
import {date_to_string, baseline_link, get_layer} from '../../../utils/HelperMethods'
import { replaceRasterTiles } from '../layers/types';

import config from '../../../config';
//import { fetchSpotlightSingle as fetchSpotlightSingleAction } from '../../../redux/spotlight';
import { wrapApiResult } from '../../../redux/reduxeed';
import { layerTypes } from '../layers/types';
import { glsp } from '../../../styles/utils/theme-values';
import { round } from '../../../utils/format';
// import MapboxControl from '../mapbox-react-control';

import ReactPopoverGl from './mb-popover';
import Dl from '../../../styles/type/definition-list';
import spotlight from '../../../redux/spotlight';
// import LayerControlDropdown from './map-layer-control';

const { center, zoom: defaultZoom, minZoom, maxZoom} = config.map;
var {styleUrl} = config.map
var activeLayers;
// Set mapbox token.
mapboxgl.accessToken = config.mbToken;
localStorage.setItem('MapboxAccessToken', config.mbToken);

const MapsContainer = styled.div`
  position: relative;
  overflow: hidden;
  height: 100%;

  /* Styles to accommodate the partner logos */
  .mapboxgl-ctrl-bottom-left {
    display: flex;
    align-items: center;
    flex-direction: row-reverse;

    > .mapboxgl-ctrl {
      margin: 0 ${glsp(0.5)} 0 0;
    }
  }

  .partner-logos {
    display: flex;
    img {
      display: block;
      height: 3rem;
    }

    a {
      display: block;
    }

    > *:not(:last-child) {
      margin: 0 ${glsp(0.5)} 0 0;
    }
  }
`;

const SingleMapContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;


class MbMap extends React.Component {
  constructor (props) {
    super(props);
    this.mapContainer = null;
    this.mbMap = null;
    this.mbDraw = null;

    this.state = {
      overlayState: {
        spotlightMarkers: true
      },
      popover: {
        coords: null,
        spotlightId: null
      },
      tileOpacity:this.props.tileOpacity,
      mapButton:"mapbox://styles/covid-nasa/ckb01h6f10bn81iqg98ne0i2y",
      markers:[],
      modalStatus:false,
      modalBackground:null,
    };

    // Store markers to be able to remove them.
    this.spotlightMarkersList = [];
    this.marker = []
    this.markerState = false;
    this.comparingId = this.props.comparingId;

    this.mapButton = this.mapButton.bind(this)
    this.handleOverlayChange = this.handleOverlayChange.bind(this);
    this.markerHandler = this.markerHandler.bind(this);
    this.markerBackground = this.markerBackground.bind(this);
    this.calendarHandler = this.calendarHandler.bind(this);
    
  }

  componentDidMount () {
    // Mount the map on the net tick to prevent the right side gap.
    setTimeout(() => this.initMap(), 1);
  }

  componentDidUpdate (prevProps, prevState) {
    // Manually trigger render of detached react components.

    this.overlayDropdownControl &&
      this.overlayDropdownControl.render(this.props, this.state);
    this.overlayDropdownControlCompare &&
      this.overlayDropdownControlCompare.render(this.props, this.state);

    const { activeLayers, comparing, spotlightList, tileOpacity } = this.props;
  
    // styleUrl = this.props.mapStyle;
    // Compare Maps
    if (comparing !== prevProps.comparing) {
      if (comparing) {
        this.enableCompare(prevProps);
      } else {
        if (this.compareControl) {
          this.compareControl.remove();
          this.compareControl = null;
          this.mbMapComparing.remove();
          this.mbMapComparing = null;
          this.mbMapComparingLoaded = false;
        }
      }
    }
    // Technical debt: The activeLayers and layers prop depend on eachother,
    // but they get updated at different times.
    // This leads to problems when finding a given layer in the layers array.
    // We can safely assume that when the layers array change, all the active
    // layers should be hidden.
    const currId = this.props.layers.map((l) => l.id).join('.');
    const prevIds = prevProps.layers.map((l) => l.id).join('.');
    if (currId !== prevIds) {
      // The 'layers' update before the 'activeLayers', therefore we have to
      // check the current 'activeLayers' against the previous 'layers'. However
      // when the 'layers' update, the prevProps.activeLayers will be the same
      // as this.props.activeLayers. By using the prevProps.activeLayers we fix
      // the problem when 'layers' update at the same time as 'activeLayers'
      // which happens for the stories.

      prevProps.activeLayers.forEach((layerId) => {
        const layerInfo = prevProps.layers.find((l) => l.id === layerId);
        const fns = layerTypes[layerInfo.type];
        if (fns) {
          return fns.hide(this, layerInfo, prevProps);
        }
        /* eslint-disable-next-line no-console */
        console.error('No functions found for layer type', layerInfo.type);
      });
    }
    if (
      prevProps.activeLayers !== activeLayers ||
      comparing !== prevProps.comparing ||
      tileOpacity !== prevProps.tileOpacity
    ) {
      const toRemove = prevProps.activeLayers.filter(
        (l) => !activeLayers.includes(l)
      );
      const toAdd = activeLayers.filter(
        (l) => !prevProps.activeLayers.includes(l)
      );

      toRemove.forEach((layerId) => {
        const layerInfo = this.props.layers.find((l) => l.id === layerId);
        if (!layerInfo) return;
        const fns = layerTypes[layerInfo.type];
        if (fns) {
          return fns.hide(this, layerInfo, prevProps);
        }
        /* eslint-disable-next-line no-console */
        console.error('No functions found for layer type', layerInfo.type);
      });

      toAdd.forEach(async (layerId) => {
        const layerInfo = this.props.layers.find((l) => l.id === layerId);

        if (!layerInfo){
          //console.log('no layer info')
         return;
        }
        const fns = layerTypes[layerInfo.type];
        
        if (fns) {

          fns.show(this, layerInfo, prevProps);
          if (fns.update) {
            const comparingLayer = find(this.props.layers, 'comparing');
            const layer = get_layer(this.props.comparingId, this.props.layers)
            fns.update(this, layerInfo, prevProps, layer, this.props.prevComparingId);
          }
          return;
        }
        /* eslint-disable-next-line no-console */
        console.error('No functions found for layer type', layerInfo.type);
      });
    }

    // Update all active layers.
    this.updateActiveLayers(prevProps);

    // Handle aoi state props update.
    if (this.mbDraw) {
      this.mbDraw.update(prevProps.aoiState, this.props.aoiState);
    }

  }

  handleOverlayChange (id) {
    this.setState(state => ({
      // Replace the array index with the negated value.
      overlayState: Object.assign({}, state.overlayState, {
        [id]: !state.overlayState[id]
      })
    }));
  }

  enableCompare (prevProps) {
    // styleUrl=this.props.mapStyle
    this.mbMap.resize();
    this.mbMapComparing = new mapboxgl.Map({
      attributionControl: false,
      container: this.mapContainerComparing,
      center: this.mbMap.getCenter(),
      zoom: this.mbMap.getZoom(),
      minZoom: minZoom || 4,
      maxZoom: maxZoom || 9,
      style: styleUrl,
      pitchWithRotate: false,
      dragRotate: false,
      logoPosition: 'bottom-left',
    });

    // Add zoom controls.
    this.mbMapComparing.addControl(
      new mapboxgl.NavigationControl(),
      'top-right'
    );

    // Remove compass.
    document.querySelector('.mapboxgl-ctrl .mapboxgl-ctrl-compass').remove();
    // if (this.props.enableLocateUser) {
    //   this.mbMapComparing.addControl(
    //     new mapboxgl.GeolocateControl({
    //       positionOptions: {
    //         enableHighAccuracy: true
    //       },
    //       trackUserLocation: true
    //     }),
    //     'top-left'
    //   );
    // }

    // Style attribution.
    this.mbMapComparing.addControl(
      new mapboxgl.AttributionControl({ compact: true })
    );

    this.mbMapComparing.once('load', () => {
      this.mbMapComparingLoaded = true;
      this.updateActiveLayers(prevProps);
      // this.updateSpotlights();
      //this.props.updateToggleLayer();
    });

    this.compareControl = new CompareMbGL(
      this.mbMapComparing,
      this.mbMap,
      '#container'
    );
  }

  updateActiveLayers (prevProps) {
    //console.log(prevProps);
    this.props.activeLayers.forEach((layerId) => {
      //console.log(this.props.activeLayers)
      const layerInfo = this.props.layers.find((l) => l.id === layerId);
      //console.log(layerInfo)
      if (!layerInfo){
        //console.log('no layer info') 
        return;
      }
      const fns = layerTypes[layerInfo.type];
      //console.log(fns);
      if (fns && fns.update) {
        //console.log('fns')
        const comparingLayer = find(this.props.layers, 'comparing');
        const layer = get_layer(this.props.comparingId, this.props.layers)
        return fns.update(this, layerInfo, prevProps, layer, this.props.prevComparingId);
      }
    });
  }

  //mapButton:"mapbox://styles/mapbox/satellite-streets-v11"
  mapButton(){

    if(styleUrl === "mapbox://styles/covid-nasa/ckb01h6f10bn81iqg98ne0i2y"){
      styleUrl = "mapbox://styles/mapbox/satellite-streets-v11"
    }else{
      styleUrl = "mapbox://styles/covid-nasa/ckb01h6f10bn81iqg98ne0i2y"
    }

    const atv = this.props.activeLayers[0]
    const lyrs = this.props.layers
    var passLayer = null;

    lyrs.forEach((element)=>{
      if(element.id === this.props.comparingId){
        passLayer = element;
      }
    })

    if(this.props.comparing) this.props.toggleCompare(passLayer)

    this.props.mapStyle();
    this.mbMap.remove()
    this.initMap(passLayer)

    if(typeof this.mbMapComparing !== 'undefined' && this.mbMapComparing !== null){
      this.mbMapComparing.remove()
    }

    //this.mbMapComparing.setStyle(styleUrl)
  }

  calendarHandler(date){
    
    const comparingLayer = find(this.props.layers, 'comparing');
    const tile = baseline_link(this.props.layers, this.props.comparingId, date)
    const layer = get_layer(this.props.comparingId, this.props.layers)
    // if(this.mbMap.style.sourceCaches[this.props.activeLayers[0]] && this.props.comparing){
    //   this.mbMapComparing.getSource(this.props.activeLayers[0]).tiles = tile
    //   this.mbMapComparing.style.sourceCaches[this.props.activeLayers[0]].clearTiles();
    //   this.mbMapComparing.style.sourceCaches[this.props.activeLayers[0]].update(this.mbMap.transform);
    //   this.mbMapComparing.triggerRepaint();
    // }
    
    // if(this.mbMapComparing.style.sourceCaches[comparingLayer.id] && this.props.comparing){
    //   console.log('inside if condition')
    //   this.mbMapComparing.getSource(comparingLayer.id).tiles = tile
    //   this.mbMapComparing.style.sourceCaches[comparingLayer.id].clearTiles();
    //   this.mbMapComparing.style.sourceCaches[comparingLayer.id].update(this.mbMap.transform);
    //   this.mbMapComparing.triggerRepaint();
    // }
    if(this.mbMapComparing.getSource(this.props.comparingId)){
      this.mbMapComparing.getSource(this.props.comparingId).tiles = tile
      this.mbMapComparing.style.sourceCaches[this.props.comparingId].clearTiles();
      this.mbMapComparing.style.sourceCaches[this.props.comparingId].update(this.mbMap.transform);
      this.mbMapComparing.triggerRepaint();
    }else{

      if(this.mbMapComparing.getSource(this.props.prevComparingId)){
        this.mbMapComparing.removeLayer(this.props.prevComparingId)
        this.mbMapComparing.removeSource(this.props.prevComparingId)
      }

      this.mbMapComparing.addSource(this.props.comparingId, {tiles:tile, type:'raster'});
      this.mbMapComparing.addLayer(
        {
          id: this.props.comparingId,
          type: 'raster',
          source: this.props.comparingId,
          paint: {}
        },
        'admin-0-boundary-bg'
      );
      
    } 
  }

  markerHandler(){
    this.markerState = !this.markerState
    // const arr = Background("");
    // var i = 0;
    if(this.markerState){
      geoJson2.fieldCampaignImages.forEach((feature) => {
        // Create a React ref
        const ref = React.createRef();
        // Create a new DOM node and save it to the React ref
        ref.current = document.createElement('div');
        // Render a Marker Component on our new DOM node
  
        ReactDOM.render(
          // <Marker feature={feature} background={arr[i++]} onClick={this.markerBackground}/>,
          <Marker feature={feature} background={feature.imageURL} onClick={this.markerBackground}/>,
          ref.current
        );
  
        // Create a Mapbox Marker at our new DOM node
        var mark = new mapboxgl.Marker(ref.current)
          .setLngLat(feature.coordinates)
          .addTo(this.mbMap);
  
        this.marker.push(mark);
      })
    }else{
      this.marker.forEach(m => m.remove())
    }
  }

  markerBackground(url){
    console.log('im in markerBackground')
    console.log(url)
  }

  initMap (passLayer) {
    const { lng, lat, zoom } = this.props.position || {
      lng: center[0],
      lat: center[1],
      zoom: defaultZoom
    };

    this.mbMap = new mapboxgl.Map({
      attributionControl: false,
      container: this.mapContainer,
      center: [lng, lat],
      zoom: zoom || 5,
      minZoom: minZoom || 4,
      maxZoom: maxZoom || 9,
      style: styleUrl,
      pitchWithRotate: false,
      dragRotate: false,
      logoPosition: 'bottom-left',
    });

    if(this.markerState === true){
      // const arr = Background("");
      // var i = 0;
      geoJson2.fieldCampaignImages.forEach((feature) => {
        // Create a React ref
        const ref = React.createRef();
        // Create a new DOM node and save it to the React ref
        ref.current = document.createElement('div');
        // Render a Marker Component on our new DOM node
  
        ReactDOM.render(
          <Marker feature={feature} background={feature.imageURL} onClick={this.markerBackground}/>,
          ref.current
        );
  
        // Create a Mapbox Marker at our new DOM node
        var mark = new mapboxgl.Marker(ref.current)
          .setLngLat(feature.coordinates)
          .addTo(this.mbMap);
  
        this.marker.push(mark);
      })
    }
    
    // Disable map rotation using right click + drag.
    this.mbMap.dragRotate.disable();

    // Disable map rotation using touch rotation gesture.
    this.mbMap.touchZoomRotate.disableRotation();

    if (!this.props.disableControls) {
      // Add zoom controls.
      this.mbMap.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Remove compass.
      document.querySelector('.mapboxgl-ctrl .mapboxgl-ctrl-compass').remove();
    }

    // Style attribution
    this.mbMap.addControl(new mapboxgl.AttributionControl({ compact: true }));

    this.mbMap.on('load', () => {
      const allProps = this.props;
      const {comparing, onAction, mapStyle } = allProps;   
      // this.props.updateToggleLayer();
      onAction('map.loaded');
      //this.props.updateToggleLayer();
      if (comparing) {
        // Fake previous props to simulate the enabling of the compare option.
        this.enableCompare({
          ...allProps,
          comparing: false
        });
      }
      if(passLayer) this.props.updateToggleLayer(passLayer);
    });

    this.mbMap.on('moveend', (e) => {
      this.props.onAction('map.move', {
        // The existence of originalEvent indicates that it was not caused by
        // a method call.
        userInitiated: Object.prototype.hasOwnProperty.call(e, 'originalEvent'),
        lng: round(this.mbMap.getCenter().lng, 4),
        lat: round(this.mbMap.getCenter().lat, 4),
        zoom: round(this.mbMap.getZoom(), 2)
      });
    });
  }

  renderOverlayDropdown (props, state) {
    return (
      <ThemeProvider theme={props.theme}>
        {/* <LayerControlDropdown
          overlayState={state.overlayState}
          handleOverlayChange={this.handleOverlayChange}
        /> */}
      </ThemeProvider>
    );
  }

  renderPopover () {
    const { spotlightId } = this.state.popover;

    if (spotlightId) {
      const { getData, isReady } = this.props.spotlight[spotlightId];
      spotlight = isReady() ? getData() : {};
    }

    return (
      <ReactPopoverGl
        mbMap={this.mbMap}
        lngLat={this.state.popover.coords}
        onClose={() => this.setState({ popover: {} })}
        offset={[38, 3]}
        suptitle='Area'
      />
    );
  }

  render () {
    return (
      <>
        {/* {this.mbMap && this.renderPopover()} */}
        <MapsContainer id='container'>
          <SingleMapContainer
            ref={(el) => {
              this.mapContainerComparing = el;
            }}
          />
          <SingleMapContainer
            ref={(el) => {
              this.mapContainer = el;
            }}
          />
        </MapsContainer>
        {/* {<Modal background="https://www.crayon.com/globalassets/us/seasonal-backgrounds/fall-2021/bridge-lake-fall-microsoft-teams-background.png?"/>} */}
        {/* <MarkerButton onClick={this.markerHandler}/> */}
        <MapButton mapStyle={this.mapButton}/>
        {/* {(this.props.activeLayers.length !== 0) && <CalendarTag onClick={this.calendarHandler} comparing={this.props.comparing} layers={this.props.layers} activeLayers={this.props.activeLayers}/>} */}
        {/* <Calendar onClick={this.calendarHandler} comparing={true} layers={this.props.layers}/> */}
        {(this.props.activeLayers.length !== 0) && this.props.calendarStatus && <CalendarTag layers={this.props.layers} onClick={this.calendarHandler} comparingId={this.props.comparingId}/>}
      </>
    );
  }
}

MbMap.propTypes = {
  onAction: T.func,
  theme: T.object,
  position: T.object,
  aoiState: T.object,
  comparing: T.bool,
  activeLayers: T.array,
  layers: T.array,
  enableLocateUser: T.bool,
  enableOverlayControls: T.bool,
  disableControls: T.bool,
  mapStyle: T.func,
  toggleCompare:T.func,
  //spotlightList: T.object,
  spotlight: T.object,
  comparingId:T.string,
  prevComparingId:T.string,
  calendarStatus:T.bool,
  //fetchSpotlightSingle: T.func
};

function mapStateToProps (state) {
  return {
    spotlight: wrapApiResult(state.spotlight.single, true)
  };
}

export default connect(mapStateToProps, {}, null, {
  forwardRef: true
})(withTheme(MbMap));
