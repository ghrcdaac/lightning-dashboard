// used to show the layers infomation on the left nav bar

import React from 'react';
import T from 'prop-types';
import styled, {keyframes} from 'styled-components';
import get from 'lodash.get';

import {
  PanelBlock,
  PanelBlockHeader,
  PanelBlockTitle,
  PanelBlockBody,
  PanelBlockScroll
} from './panel-block';
import Layer from './layer';
import { Accordion } from './accordion';
import {AccordionContainer, AccordionTitle, AccordionBody, TitleWrapper, BottomLineAccordion, DatasetSwatch, PanelTitle} from './AccordionLayer';
import { TitleBlock, TitleName, LayerTitle, LinkTitle, BottomLine, LinkContainer, Link, LayerBody, LinkBody, MainBody } from './LayerLink';

import Slider from '../MiniComponents/Single/Slider';
import BaselineToggle from '../MiniComponents/BaselineLayer/BaselineToggle';
import HotSpotToggle from '../MiniComponents/HotSpot/HotSpotToggle'
import {FiExternalLink} from '../../../../../node_modules/react-icons/fi'
import {FiPlua, FiMinus} from '../../../../../node_modules/react-icons/fi'
import {RiArrowDropDownLine, RiArrowDropUpLine} from '../../../../../node_modules/react-icons/ri'

import LINK_DATA from '../../data/links';

const COLOR = '#2276AC';

const PanelBlockLayer = styled(PanelBlock)`
  flex: 2;
`;

const Swatch = styled.div`
position:absolute;
height:49px;
margin-left:2px;
margin-top:1.3px;
border-radius: 25px;
width:3.8px;
z-index:999999;
background-color:#C0C0C0;
`

class DataLayersBlock extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      //for timeline animation
      layer:true,
      animationBody:'null',
      animationTitle:'null',
      leftTitle:'0px',
      layerTitleColor:'#2276AC',
      linkTitleColor:'black',
      leftBody:'0px',

      //for layerDropDown
      dropdown: 'TRMM LIS'
    };  
    
    this.layerHandler = this.layerHandler.bind(this);
    this.linkHandler = this.linkHandler.bind(this);
  }

  layerHandler(){
    this.setState({layer:true,animationBody:'fadeout-body 0.15s;', leftTitle:'0px', layerTitleColor:COLOR, linkTitleColor:'black', leftBody:'0px', animationTitle:'fadeout-title 0.15s'})
  }
  linkHandler(){
    this.setState({layer:false,animationBody:'fadein-body 0.15s;', leftTitle:'138px', layerTitleColor:'black', linkTitleColor:COLOR, leftBody:'-280px', animationTitle:'fadein-title 0.15s'})
  }

  dropdownHandler(dataset_type){
    if(this.state.dropdown === dataset_type){
      this.setState({dropdown:'null'})
      return
    }
    this.setState({dropdown:dataset_type})
  }

  render () {
    
    const { onAction, layers, mapLoaded,tileOpacity, toggleHandler, baselineHandler, baselineId, activeLayers, comparing, comparingId, calendarStatus } = this.props;

    console.log(this.state.dropdown)
    //seperating 1D different layer information to 2d array with each row/array specifying a single type layer
    //this will be useful for accordion loop
    let dataset_type = layers[0].dataset_type;
    const two_dim_layers = []
    let layer_array = []
    const length = layers.length;
    let index = 0;
    layers.map((layer)=>{
      if(layer.dataset_type === dataset_type){
        layer_array.push(layer)
      }else{
        two_dim_layers.push(layer_array)
        layer_array = []
        layer_array.push(layer)
        dataset_type = layer.dataset_type
      }
    })
    two_dim_layers.push(layer_array)

    //console.log(two_dim_layers)
    return (
      <PanelBlockLayer>
        <PanelBlockHeader>
          <PanelBlockTitle>
            <TitleBlock>
              <LayerTitle>
                <TitleName onClick={this.layerHandler} color={this.state.layerTitleColor}>Layers</TitleName>
                <BottomLine animation={this.state.animationTitle} left={this.state.leftTitle}></BottomLine>
              </LayerTitle>
              <LinkTitle>
                <TitleName onClick={this.linkHandler} color={this.state.linkTitleColor}>Links</TitleName>
              </LinkTitle>
            </TitleBlock>
          </PanelBlockTitle>
        </PanelBlockHeader>
        <PanelBlockBody>
          <PanelBlockScroll>
            {/* <PanelTitle>Datasets</PanelTitle> */}
            <MainBody left={this.state.leftBody} animation={this.state.animationBody}>
              <LayerBody>
                {two_dim_layers.map((layerArray)=>(
                  <AccordionContainer key={layerArray[0].dataset_type}>
                    <DatasetSwatch/>
                    <TitleWrapper onClick={()=>this.dropdownHandler(layerArray[0].dataset_type)}>
                      <AccordionTitle>{layerArray[0].dataset_type}</AccordionTitle>
                      {this.state.dropdown === layerArray[0].dataset_type && <RiArrowDropUpLine size={40}/>}
                      {this.state.dropdown !== layerArray[0].dataset_type && <RiArrowDropDownLine size={40}/>}
                    </TitleWrapper>
                    <BottomLineAccordion/>
                    {this.state.dropdown === layerArray[0].dataset_type && 
                    <AccordionBody>
                      <Accordion>
                        {({ checkExpanded, setExpanded }) => (
                          <ol>
                            {layerArray.map((l, idx) => (
                              <li key={l.id}>
                                <Layer
                                  id={l.id}
                                  label={l.name}
                                  disabled={!mapLoaded}
                                  type={l.type}
                                  active={l.visible}
                                  swatchColor={get(l, 'swatch.color')}
                                  swatchName={get(l, 'swatch.name')}
                                  dataOrder={l.dataOrder}
                                  info={l.info}
                                  legend={l.legend}
                                  isExpanded={checkExpanded(idx)}
                                  setExpanded={v => setExpanded(idx, v)}
                                  onToggleClick={() => onAction('layer.toggle', l)}
                                  onLegendKnobChange={(payload) => onAction('layer.legend-knob', { id: l.id, ...payload })}
                                  knobPos={l.knobPos}
                                  compareEnabled={!!l.compare}
                                  compareActive={l.comparing}
                                  compareHelp={get(l, 'compare.help')}
                                  onCompareClick={() => onAction('layer.compare', l)}
                                />
                              </li>
                            ))}
                          </ol>
                        )}
                      </Accordion>
                    </AccordionBody>
                    }
                  </AccordionContainer>
                ))}
                {/* <PanelTitle>Features</PanelTitle> */}
                <Slider slideHandler={tileOpacity}/>
                <BaselineToggle 
                calendarStatus={calendarStatus} 
                layers={layers} 
                activeLayers={activeLayers} 
                comparing={comparing} 
                baselineHandler={baselineHandler} 
                comparingId={comparingId} 
                baselineId={baselineId}/>
                <HotSpotToggle activeLayers={activeLayers}/>
              </LayerBody>
              <LinkBody>
                <LinkContainer>
                  {LINK_DATA.links.map((link)=>(
                  <Link key={link.name}>
                    <FiExternalLink/>
                    <a style={{marginLeft:'10px'}} href={link.link} target="_blank">{link.name}</a>
                  </Link>
                  ))}
                </LinkContainer>
              </LinkBody>
            </MainBody>
          </PanelBlockScroll>
        </PanelBlockBody>
      </PanelBlockLayer>
    );
  }
}

DataLayersBlock.propTypes = {
  onAction: T.func,
  layers: T.array,
  mapLoaded: T.bool,
  tileOpacity:T.func,
  toggleHandler:T.func,
  baselineHandler:T.func,
  activeLayers:T.array,
  comparing:T.bool,
  comparingId:T.string,
  baselineId:T.func,
  calendarStatus:T.func,
};

export default DataLayersBlock;
