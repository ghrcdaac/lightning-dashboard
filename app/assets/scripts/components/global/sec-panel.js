import React from 'react';
import T from 'prop-types';

import Panel, {
  PanelHeadline,
  PanelTitle
} from '../common/panel';
import ShadowScrollbar from '../common/shadow-scrollbar';

import { glsp } from '../../styles/utils/theme-values';
import media, { isLargeViewport } from '../../styles/utils/media-queries';

import {get_metadata_api_file_path, txt_to_json } from '../../utils/HelperMethods';
import Button from "../../styles/button/button"
import { connect } from 'react-redux';
import styled, { withTheme } from 'styled-components';

import metadata_url from '../../configuration.json'

const PanelSelf = styled(Panel)`
  // ${media.largeUp`
  //   width: 30rem;
  // `}
  width:30rem;
`;

const BodyScroll = styled(ShadowScrollbar)`
  flex: 1;
  z-index: 1;
  // width:95%;
  // background-color:red;
`;

const Button_Div = styled.div`
display:flex;
margin-top:20px;
justify-content:space-evenly;
margin-bottom:20px;
`
const Descriptions = styled.div`
display:flex;
justify-content:center;
`
const Loading_Screen = styled.div`
margin-left:14rem;
margin-top:5rem; 
`

const InsightsBlock = styled.div`
  padding: ${glsp()};
  display: flex;
  flex-flow: column nowrap;
  flex: 1;
`;

const InsightHeadline = styled.div`
  display: flex;

  > *:last-child {
    margin-left: auto;
  }
`;
var Plotly = require('plotly.js-dist-min')

class ExpMapSecPanel extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      renderPlot:false,
      render_button_clicked:false
    }
    this.plotly_address = null
    this.visualizeCharts = this.visualizeCharts.bind(this);
    this.removeHandler = this.removeHandler.bind(this);
    this.renderHandler = this.renderHandler.bind(this);
    // var Plotly = require('plotly.js-dist-min')
  }

  componentDidUpdate (prevProps, prevState) {
    if(typeof prevProps.activeLayers[0] !== 'undefined'){
      if(prevProps.activeLayers[0] !== this.props.activeLayers[0]){
        this.removeHandler()
      }
      if(prevProps.date !== this.props.date){
        this.removeHandler()
      }
    }
  }

  renderHandler(){
    this.visualizeCharts()
  }

  removeHandler(){
    Plotly.purge('renderChart');
    this.setState({renderPlot:false})
  }

  visualizeCharts(){
    this.setState({render_button_clicked:true})

    const fetch_link = `${metadata_url['lightning_dashboard-cloudfront_url']}${get_metadata_api_file_path(this.props.activeLayers, this.props.date, this.props.PATH)}`
    console.log(fetch_link)
    fetch(fetch_link)
    .then(response=>response.text())
    .then((dataa)=>{
      const data = txt_to_json(dataa);
      //console.log(data)

      const lat = []
      const lon = []
      
      var divide_by = 500;
      var i = 0;
      for(i;i<data.length;i+=parseInt(data.length/divide_by)){
        lat.push(data[i].Latitude)
        lon.push(data[i].Longitude)
      }
  
      //console.log("Lat: ", lat)
      //console.log("Lon: ", lon)
      
      const grid_len = lat.length
      const zData = []
      var pointer = 0;
      //console.log(`starting...data_length:${data.length}`)
      for(i=0;i<data.length;i+=parseInt(data.length/divide_by)){
        var a = Array.apply(null, Array(grid_len)).map(Number.prototype.valueOf,0);
        a[pointer] = data[i].Data
        pointer = pointer + 1
        zData.push(a)
      }
      //console.log("Complete")
      //console.log(zData)
      var data_for_plotly = [{
        z: zData,
        x: lat,
        y: lon,
        type: 'surface'
      }];
      var year = this.props.date.toLocaleString("default", { year: "numeric" });
      var month = this.props.date.toLocaleString("default", { month: "2-digit" });
      var day = this.props.date.toLocaleString("default", { day: "2-digit" });
      var formattedDate = year + "-" + month + "-" + day;
      var layout = {
        title: `${this.props.activeLayers[0]}<br>${formattedDate}`,
        autosize: true,  
        willReadFrequently:true,
        scene:{
          xaxis:{
            title:"Lat"
          },
          yaxis:{
            title:"Lon"
          },
          zaxis:{
            title:"FRD"
          },
          camera: {
            center: { x: 0, y: 0, z: 0 }, 
            eye: { x: 2, y: 2, z: 0.1 }, 
            up: { x: 0, y: 0, z: 1 }
          }
        },
        margin: {
          l: 65,
          r: 50,
          b: 30,
          t: 90,
          pad:40
        }
      };
      this.plotly_address = Plotly.newPlot('renderChart',data_for_plotly,layout)
      this.setState({renderPlot:true, render_button_clicked:false})
    })
  }

  render () {
    const img_src = "https://media.tenor.com/On7kvXhzml4AAAAj/loading-gif.gif"
    return (
      <PanelSelf
        collapsible
        direction='right'
        onPanelChange={this.props.onPanelChange}
        initialState={false}
        headerContent={
          <PanelHeadline>
            <PanelTitle>Charts</PanelTitle>
          </PanelHeadline>
        }
        bodyContent={
          <BodyScroll>
            {/* <BarChartPanel layer={this.props.activeLayer}/> */}
            <Button_Div>
              <Button onClick={this.visualizeCharts} variation='primary-raised-dark' size={'small'} style={{marginTop:'4px'}}>Render Chart</Button>
              <Button onClick={this.removeHandler} variation='primary-raised-dark' size={'small'} style={{marginTop:'4px'}}>Remove Chart</Button>
            </Button_Div>
            <div id="renderChart" style={{marginLeft:"-1rem"}}></div>
            {!this.state.renderPlot && this.state.render_button_clicked && <Loading_Screen>
              <img src={img_src} alt="Loading" width="15%"/>
            </Loading_Screen>}
            {this.state.renderPlot && <Descriptions>
              <ul style={{listStyleType:'square'}}>
                <li>Scroll to Zoom In/Zoom Out</li>
                <li>Spin the Plot to see from different angles</li>
                <li>
                  Hover over plot for specific data, where
                  <ul style={{listStyleType:'disc', marginLeft:"20px"}}>
                    <li>x: Latitude</li>
                    <li>y: Longitude</li>
                    <li>z: FRD</li>
                  </ul>
                </li>
              </ul>
            </Descriptions>}
          </BodyScroll>
        }
      />
    );
  }
}

function mapStateToProps (state, props) {
  return {
    PATH:state.METADATA_REDUCER.PATH
  };
}


export default connect(mapStateToProps,{}, null,{
  forwardRef:true
})(withTheme(ExpMapSecPanel));


ExpMapSecPanel.propTypes = {
  onAction: T.func,
  onPanelChange: T.func,
  layers: T.array,
  aoiFeature: T.object,
  cogTimeData: T.object,
  cogDateRanges: T.object,
  cogLayersSettings: T.object,
  activeLayers: T.array,
  date: T.object
};

// export default ExpMapSecPanel;
