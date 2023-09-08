import React from 'react';
import T from 'prop-types';
import styled, { withTheme, ThemeProvider } from 'styled-components';
import mapboxgl from 'mapbox-gl';
import CompareMbGL from 'mapbox-gl-compare';
import ReactDOM from 'react-dom';
import find from 'lodash.find';
import { connect } from 'react-redux';
import { FiExternalLink } from '../../../../../../node_modules/react-icons/fi';
import {toast} from 'react-toastify';

import { createMbMarker } from './mb-popover/utils';
import CalendarTag from '../../MiniComponents/BaselineLayer/CalendarTag';
import {date_to_string, baseline_link, get_layer, HotSpotDate, metadata_format, makeid} from '../../../utils/HelperMethods';
import {HotSpotData} from '../../../data/HotSpot2.0';
import HotSpotBody from '../../MiniComponents/HotSpot/HotSpotBody'
import PopupButton from '../../MiniComponents/PopUp/PopupButton';
import ToastWrapper from '../../MiniComponents/toast/toastWrapper';

import config from '../../../config';
import { layerTypes } from '../layers/types';
import Button from '../../../styles/button/button';
import { glsp } from '../../../styles/utils/theme-values';
import { round } from '../../../utils/format';

import ReactPopoverGl from './mb-popover';

import { changeBaselineDate } from '../../../redux/action/BaselineAction';
import { data_for_mapbox_data_driven_property } from '../../../utils/HelperMethods';
import { changeMetadata, changeSpinner } from '../../../redux/action/MetadataAction';
import { get_metadata_api_file_path } from '../../../utils/HelperMethods';

import configs from '../../../configuration.json'
var Swal = require('sweetalert2')

const { center, zoom: defaultZoom, minZoom, maxZoom} = config.map;
var {styleUrl} = config.map

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
      maploaded:false,
      time:null
    };

    // Store markers to be able to remove them.
    this.spotlightMarkersList = [];
    this.marker = []
    this.hotspotMarkers = []
    this.metadata = []
    this.markerState = false;
    this.comparingId = this.props.comparingId;
    this.activeSpotlight = []

    this.handleOverlayChange = this.handleOverlayChange.bind(this);
    this.markerHandler = this.markerHandler.bind(this);
    this.markerBackground = this.markerBackground.bind(this);
    this.calendarHandler = this.calendarHandler.bind(this);
    this.addLayer = this.addLayer.bind(this);
    this.removeLayer = this.removeLayer.bind(this);
    this.addHotSpot = this.addHotSpot.bind(this);
    this.renderPointVisualization = this.renderPointVisualization.bind(this);
    this.removePointVisualization = this.removePointVisualization.bind(this);
    this._render_Points = this._render_Points.bind(this);
  }

  componentDidMount () {
    // Mount the map on the net tick to prevent the right side gap.
    setTimeout(() => this.initMap(), 1);
  }

  componentDidUpdate (prevProps, prevState) {

    if(prevProps.HOTSPOT !== this.props.HOTSPOT){
      if(this.props.HOTSPOT === true){
        this.updateSpotlights();
      }else{
        this.spotlightMarkersList.forEach(m => m.remove());
        this.spotlightMarkersList = [];
        this.setState({ popover: {} });
      }
    }

    if(prevProps.BASELINE_ID !== this.props.BASELINE_ID){
      if(prevProps.BASELINE_ID !== null && prevProps.BASELINE_ID !== 'None'){
        this.removeLayer(prevProps.BASELINE_ID)
      }
    }

    //metadata controls
    if(prevProps.REMOVE_METADATA !== this.props.REMOVE_METADATA){
      this.removePointVisualization()
    }
    if(prevProps.METADATA !== this.props.METADATA){
      this.renderPointVisualization(this.props.activeLayers, this.props.date)
    }
    if(prevProps.activeLayers[0] !== this.props.activeLayers[0]){
      this.removePointVisualization()
    }else{
      if(prevProps.date !== this.props.date){
        this.removePointVisualization()
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

  updateSpotlights () {
    // Check if spotlights are available
    //const { spotlightList } = this.props;
    const spotlights = HotSpotData(this.props.activeLayers[0]);
    const addMarker = (spotlight, map) => {
      return createMbMarker(map, { color: this.props.theme.color.primary })
        .setLngLat([spotlight.Lon, spotlight.Lat])
        .addTo(map)
        .onClick((coords) => {
          this.activeSpotlight = []
          this.activeSpotlight.push(spotlight)
          this.setState({ popover: { coords, spotlightId: spotlight.GlobalRank } });
        });
    };

    // Add markers to mbMap, if not done yet
    if (this.mbMap) {
      spotlights.forEach((s) => {
        const m = addMarker(s, this.mbMap);
        this.spotlightMarkersList.push(m);
      });
    }

    // Add markers to mbMapComparing, if not done yet
    if (this.mbMapComparing) {
      spotlights.forEach((s) => {
        const m = addMarker(s, this.mbMapComparing);
        this.spotlightMarkersList.push(m);
      });
    }
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
    // Style attribution.
    this.mbMapComparing.addControl(
      new mapboxgl.AttributionControl({ compact: true })
    );

    this.mbMapComparing.once('load', () => {
      this.mbMapComparingLoaded = true;
      this.updateActiveLayers(prevProps);
      if(this.props.HOTSPOT === true){
        this.spotlightMarkersList.forEach(m => m.remove());
        this.spotlightMarkersList = [];
        this.updateSpotlights();
      }
    });

    this.compareControl = new CompareMbGL(
      this.mbMapComparing,
      this.mbMap,
      '#container'
    );
    const target_width = document.getElementById("container").offsetWidth/2
    var current_slider_position = 0

    this.compareControl.setSlider(current_slider_position)
    setTimeout(()=>{
      const interval = setInterval(()=>{
        if(current_slider_position < target_width){
          current_slider_position += 10
          this.compareControl.setSlider(current_slider_position)
        }else{
          clearInterval(interval)
        }
      }, 1)
    },300)
  }

  updateTime(data){

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

  removePointVisualization(){
    const sourceName = 'metadata'
    if(typeof this.mbMap.getSource(sourceName) !== 'undefined'){
      this.mbMap.removeLayer(sourceName)
      this.mbMap.removeSource(sourceName)
    }
  }

  renderPointVisualization(layer_name, date){

    if(this.props.activeLayers.length === 0){
      Swal.fire({
        icon: 'error',
        text:"One of the layers should be active for this feature to work."
      })
      return
    }
    this.removePointVisualization()
    
    var file_path;
    var time = null;
    if(this.props.activeLayers[0] === 'Spring 2022' || this.props.activeLayers[0] === 'HS3'){
      if(this.props.PATH === ''){
        Swal.fire({
          icon: 'error',
          text:"Please select all dropdowns in timeline."
        })
        return
      }

      const timeline_information = this.props.PATH.split("#")
      const filename = timeline_information[0]
      const directory_or_time = timeline_information[1]
      if(this.props.activeLayers[0] === 'Spring 2022'){
        file_path = "ISS-LIS/"+filename
        time = directory_or_time[0] + directory_or_time[1]
      }else{ // if this is hs3 data
        file_path = "HS3/"+ directory_or_time + '/' + filename
      }
    }else{
      file_path = get_metadata_api_file_path(layer_name, date)
    }

    Swal.fire({
      icon: 'success',
      text:"Data Request Sent."
    })
    this.props.changeSpinner();

    //console.log("LINE: 457. RenderPointVisualization")
    //console.log("FilePath: ", file_path)
    let randomString = makeid(10);
    let url = `${configs.api_gateway_url}test/metadata`
    fetch(url,{
      method:"POST",
      headers:{
        'Content-Type': 'application/json'
      },
      body:JSON.stringify({
        lat_min:this.props.META_LAT[0],
        lat_max:this.props.META_LAT[1],
        lon_min:this.props.META_LON[0],
        lon_max:this.props.META_LON[1],
        frd_min:this.props.META_FRD[0],
        frd_max:this.props.META_FRD[1],
        file_path:file_path,
        time_hour:time,
        id:randomString
      })
    }).then((response)=>response.json())
    .then((data)=>{
      //console.log(data)
      var urll = `${configs['lightning_dash_temp-cloudfront_url']}${randomString}.json`
      fetch(urll)
      .then ((response) => response.json())
      .then (data => {
        Swal.fire({
          icon: 'info',
          text:"Data Received. Points will soon begin rendering onto the map."
        })
        this._render_Points(data)
        this.props.changeSpinner();
      });
    }).catch((error)=>{
      Swal.fire({
        icon: 'error',
        text:`Error. ${error}`
      })
      this.props.changeSpinner();
    })
  }
  
  _render_Points(data){
    //console.log(this.props.SPINNER)
    //console.log('MbMap::LINE-574::here in render points', data)
    const sourceName = 'metadata'
    const filtered_data = data_for_mapbox_data_driven_property(data, this.props.activeLayers)
    //console.log(filtered_data)
    this.mbMap.addSource(sourceName, filtered_data)
    this.mbMap.addLayer({
      'id': sourceName,
      'type': 'circle',
      'source': sourceName,
      'paint': {
        'circle-radius': [
          "interpolate", ["linear"], ["zoom"],
          // when zoom is 0, set each feature's circle radius to the value of its "rating" property
          5, ["get", "frd"],
          // when zoom is 10, set each feature's circle radius to 10 times the value of its "frd" property
          10, ["*", 10, ["get", "frd"]],
          // when zoom is 20, set each feature's circle radius to 10 times the value of its "frd" property
          20, ["*", 15, ["get", "frd"]]
      ],
        'circle-color': '#EE4B2B'
      }
    });
    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false
    });
    this.mbMap.on('mouseenter', sourceName, (e) => {
        // Change the cursor style as a UI indicator.
        this.mbMap.getCanvas().style.cursor = 'pointer';
        
        // Copy coordinates array.
        const coordinates = e.features[0].geometry.coordinates.slice();
        const description = e.features[0].properties.description;
        
        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }
        
        // Populate the popup and set its coordinates
        // based on the feature found.
        popup.setLngLat(coordinates).setHTML(description).addTo(this.mbMap);
      });
       
      this.mbMap.on('mouseleave', sourceName, () => {
        this.mbMap.getCanvas().style.cursor = '';
        popup.remove();
      });
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
      this.setState({maploaded:true})
      // const {
      //   width,
      //   height,
      //   top,
      //   left
      // } = this.mbMap.getContainer().getBoundingClientRect();
    });
    this.mbMap.addSource('country-borders', {
      type: 'vector',
      url: 'mapbox://mapbox.country-boundaries-v1',
    });

    this.mbMap.addLayer({
      id: 'country-borders-layer',
      type: 'line',
      source: 'country-borders',
      'source-layer': 'country_boundaries',
      paint: {
        'line-color': 'blue', // Adjust the border color as desired
        'line-width': 1, // Adjust the border width as desired
      },
    });0
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
    return (
      <ReactPopoverGl
        mbMap={this.mbMap}
        lngLat={this.state.popover.coords}
        onClose={() => this.setState({ popover: {} })}
        offset={[38, 3]}
        title={(this.activeSpotlight.length > 0) &&
          <div>TRMM LIS Lightning</div>
        }
        content={(this.activeSpotlight.length > 0) &&
          <HotSpotBody 
            rank={this.activeSpotlight[0].GlobalRank}
            frd={this.activeSpotlight[0].FRD}
            lat={this.activeSpotlight[0].Lat}
            lng={this.activeSpotlight[0].Lon}
            ppl={this.activeSpotlight[0].PPL}
            country={this.activeSpotlight[0].Country}
            ppl_lat={this.activeSpotlight[0].PPL_lat}
            ppl_lon={this.activeSpotlight[0].PPL_lon}
            dist={this.activeSpotlight[0].Dist}
          />
        }
        footerContent={
          <Button
            variation='primary-raised-dark'
            //useIcon={['chevron-right--small', 'after']}
            onClick={()=>{
              window.open('https://ghrc.nsstc.nasa.gov/pub/lis/climatology/LIS/')
            }}
          >
            <FiExternalLink/> Download Data Here
          </Button>
        }
      />
    );
  }

  render () {
    toast.configure()
    const popupHandler = () =>{
      toast.info('Hey, Welcome to Lightning Dashboard', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      toast.info('Click on the following datasets.', {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
    return (
      <>
        {this.mbMap && this.renderPopover()}
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
        {/* <div onClick={popupHandler}>
          <PopupButton /> 
        </div> */}
        <ToastWrapper />
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
    HOTSPOT:state.HOTSPOT_REDUCER.HOTSPOT,
    METADATA:state.METADATA_REDUCER.METADATA,
    META_LAT:state.METADATA_REDUCER.LAT_DATA,
    META_LON:state.METADATA_REDUCER.LON_DATA,
    META_FRD:state.METADATA_REDUCER.FRD_DATA,
    REMOVE_METADATA:state.METADATA_REDUCER.REMOVE_METADATA,
    SPINNER:state.METADATA_REDUCER.SPINNER,
    PATH:state.METADATA_REDUCER.PATH
  };
}

const mapDispatchToProps = (dispatch) =>{
  return{
    // changeBaselineDate:changeBaselineDate,
    // changeMetadata:changeMetadata
    changeMetadata: () => dispatch(changeMetadata()),
    changeSpinner: () => dispatch(changeSpinner())
  }
}

export default connect(mapStateToProps,mapDispatchToProps, null,{
  forwardRef:true
})(withTheme(MbMap));
