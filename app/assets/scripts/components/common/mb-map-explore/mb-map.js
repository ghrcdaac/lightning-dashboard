import React from 'react';
import T from 'prop-types';
import styled, { withTheme, ThemeProvider } from 'styled-components';
import mapboxgl from 'mapbox-gl';
import CompareMbGL from 'mapbox-gl-compare';
import ReactDOM from 'react-dom';
import find from 'lodash.find';
import { connect } from 'react-redux';

import geoJson2 from './chicago-parks2.json'
import HotSpotJSON from '../../../data/HotSpot'
import data2 from './data2.json';
import Marker from '../../../utils/Marker';
import HotSpot from '../../global/panelComponents/HotSpot';
import MarkerButton from '../../../utils/MarkerButton';
import CalendarTag from '../../../utils/CalendarTag';
import {date_to_string, baseline_link, get_layer, HotSpotDate} from '../../../utils/HelperMethods'
import { replaceRasterTiles } from '../layers/types';
import { data } from '../../../data/HotSpotData';

import config from '../../../config';
import { layerTypes } from '../layers/types';
import { glsp } from '../../../styles/utils/theme-values';
import { round } from '../../../utils/format';
// import MapboxControl from '../mapbox-react-control';

import ReactPopoverGl from './mb-popover';

import { changeBaselineDate } from '../../../redux/action/BaselineAction';

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
      markers:[],
      modalStatus:false,
      modalBackground:null,
    };

    // Store markers to be able to remove them.
    this.spotlightMarkersList = [];
    this.marker = []
    this.hotspotMarkers = []
    this.markerState = false;
    this.comparingId = this.props.comparingId;


    this.handleOverlayChange = this.handleOverlayChange.bind(this);
    this.markerHandler = this.markerHandler.bind(this);
    this.markerBackground = this.markerBackground.bind(this);
    this.calendarHandler = this.calendarHandler.bind(this);
    this.addLayer = this.addLayer.bind(this);
    this.removeLayer = this.removeLayer.bind(this);
    this.addHotSpot = this.addHotSpot.bind(this);
    
  }

  componentDidMount () {
    // Mount the map on the net tick to prevent the right side gap.
    setTimeout(() => this.initMap(), 1);
  }

  componentDidUpdate (prevProps, prevState) {

    if(prevProps.BASELINE_ID !== this.props.BASELINE_ID){
      if(prevProps.BASELINE_ID !== null && prevProps.BASELINE_ID !== 'Datasets'){
        this.removeLayer(prevProps.BASELINE_ID)
      }
    }

    if(this.props.HOTSPOT === true){
      if(prevProps.activeLayers[0] !== this.props.activeLayers[0]){
        if(typeof prevProps.activeLayers[0] === 'undefined'){
          this.addHotSpot(this.props.activeLayers[0], HotSpotDate(this.props.activeLayers[0], this.props.date));
        }else if(this.props.activeLayers.length === 0){
          this.removeHotSpot()
        }else{    
          this.removeHotSpot();
          this.addHotSpot(this.props.activeLayers[0], HotSpotDate(this.props.activeLayers[0], this.props.date));
        }
      }else{
        if(prevProps.date !== this.props.date){
          this.removeHotSpot();
          this.addHotSpot(this.props.activeLayers[0], HotSpotDate(this.props.activeLayers[0], this.props.date));    
        }
      }
  
    }

    if(prevProps.HOTSPOT !== this.props.HOTSPOT){
      if(this.props.HOTSPOT === true){
        this.addHotSpot(this.props.activeLayers[0], HotSpotDate(this.props.activeLayers[0], this.props.date));
      }else{
        this.removeHotSpot();
      }
    }

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
         return;
        }
        const fns = layerTypes[layerInfo.type];
        
        if (fns) {

          fns.show(this, layerInfo, prevProps);
          if (fns.update) {
            const comparingLayer = find(this.props.layers, 'comparing');
            const layer = get_layer(this.props.BASELINE_ID, this.props.layers)
            fns.update(this, layerInfo, prevProps, layer, this.props.PREV_BASELINE_ID);
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
    this.props.activeLayers.forEach((layerId) => {
      const layerInfo = this.props.layers.find((l) => l.id === layerId);
      if (!layerInfo){
        return;
      }
      const fns = layerTypes[layerInfo.type];
      if (fns && fns.update) {
        const comparingLayer = find(this.props.layers, 'comparing');
        const layer = get_layer(this.props.comparingId, this.props.layers)
        return fns.update(this, layerInfo, prevProps, layer, this.props.prevComparingId);
      }
    });
  }

  calendarHandler(dateString, date, id){    

    const tile = baseline_link(this.props.layers, this.props.comparingId, dateString)

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

  addLayer(id){
    const tile = baseline_link(this.props.layers, id, this.props.BASELINE_DATE_I)
    if(this.mbMapComparing.getSource(id)){
      this.mbMapComparing.getSource(id).tiles = tile
      this.mbMapComparing.style.sourceCaches[id].clearTiles();
      this.mbMapComparing.style.sourceCaches[id].update(this.mbMap.transform);
      this.mbMapComparing.triggerRepaint();
    }else{

      if(this.mbMapComparing.getSource(this.props.PREV_BASELINE_ID)){
        this.mbMapComparing.removeLayer(this.props.PREV_BASELINE_ID)
        this.mbMapComparing.removeSource(this.props.PREV_BASELINE_ID)
      }

      this.mbMapComparing.addSource(this.props.BASELINE_ID, {tiles:tile, type:'raster'});
      this.mbMapComparing.addLayer(
        {
          id: this.props.BASELINE_ID,
          type: 'raster',
          source: this.props.BASELINE_ID,
          paint: {}
        },
        'admin-0-boundary-bg'
      );
      
    } 
  }

  removeLayer(id){
    if(this.mbMapComparing !== null && typeof this.mbMapComparing !== 'undefined' && typeof this.mbMapComparing.getSource(id) !== 'undefined'){
      this.mbMapComparing.removeLayer(id)
      this.mbMapComparing.removeSource(id)
    }
  }

  addHotSpot(layer, date){

    const datas = data(layer, date);
    datas[0].data.forEach((feature) => {
        // Create a React ref
        const ref = React.createRef();
        // Create a new DOM node and save it to the React ref
        ref.current = document.createElement('div');
        // Render a Marker Component on our new DOM node

        ReactDOM.render(
          // <Marker feature={feature} background={arr[i++]} onClick={this.markerBackground}/>,
          <HotSpot feature={feature}/>,
          ref.current
        );
  
        // Create a Mapbox Marker at our new DOM node
        var mark = new mapboxgl.Marker(ref.current)
          .setLngLat([feature.lat, feature.lng])
          .addTo(this.mbMap);
  
        this.hotspotMarkers.push(mark);
    })
  }

  removeHotSpot(){
    this.hotspotMarkers.forEach(m => m.remove())
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
      if(passLayer){
        this.props.updateToggleLayer(passLayer);
      }
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
        {(this.props.activeLayers.length !== 0) && this.props.CALENDAR_ACTIVE && <CalendarTag layers={this.props.layers} onClick={this.calendarHandler} comparingId={this.props.comparingId}/>}
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
  date:T.object,
  //fetchSpotlightSingle: T.func
};

function mapStateToProps (state, props) {
  return {
    BASELINE_ID:state.BASELINE_REDUCER.BASELINE_ID,
    PREV_BASELINE_ID:state.BASELINE_REDUCER.PREV_BASELINE_ID,
    BASELINE_DATE_F:state.BASELINE_REDUCER.BASELINE_DATE_F,
    BASELINE_DATE_I:state.BASELINE_REDUCER.BASELINE_DATE_I,
    CALENDAR_ACTIVE:state.BASELINE_REDUCER.CALENDAR_ACTIVE,
    HOTSPOT:state.HOTSPOT_REDUCER.HOTSPOT
  };
}

const mapDispatchToProps = () =>{
  return{
    changeBaselineDate:changeBaselineDate
  }
}

export default connect(mapStateToProps,{}, null,{
  forwardRef:true
})(withTheme(MbMap));
