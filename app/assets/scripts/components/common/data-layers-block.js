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

import Slider from '../MiniComponents/Single/Slider';
import BaselineToggle from '../MiniComponents/BaselineLayer/BaselineToggle';
import HotSpotToggle from '../MiniComponents/HotSpot/HotSpotToggle'
import {FiExternalLink} from '../../../../../node_modules/react-icons/fi'
import LINK_DATA from '../../data/links';

const COLOR = '#2276AC';

const PanelBlockLayer = styled(PanelBlock)`
  flex: 2;
`;

const TitleBlock = styled.div`
display:flex;
justify-content:space-around;
//background-color:red;
width:100%;
transition:slideRight 0.6s ease;
`
const TitleName = styled.div`
text-align:center;
:hover{
  cursor:pointer;
  color:${COLOR};
}
//left:0;
color:${(props)=>props.color}
`
const LayerTitle = styled.div`
display:flex;
flex-direction:column;
width:50%;
margin-right:10px;
transition:1s;
left:0;
justify-content:center;
align-items:center;
color:${(props)=>props.color};
transition:slideRight 0.6s ease;
-webkit-animation: fadein 3s;
-moz-animation: fadein 3s; 
-ms-animation: fadein 3s;
-o-animation: fadein 3s; 
animation: fadein 3s; 

:hover{
  color:#2276AC;
}
`

const LinkTitle = styled.div`
display:flex;
flex-direction:column;
width:50%;
margin-left:10px;
transition:1s;
left:0;
justify-content:center;
align-items:center;
:hover{
  color:#2276AC;
}
color:${(props)=>props.color}
`
const BottomLine = styled.div`
width:124%;
height:3px;
background-color:grey;
//transition:1s;
left:${(props)=>props.left};
justify-content:center;
align-items:center;
background-color:#2276AC;
position:relative;
top:10px;
-webkit-animation: ${(props)=>props.animation};
-moz-animation: ${(props)=>props.animation}; 
-ms-animation: ${(props)=>props.animation};
-o-animation: ${(props)=>props.animation}; 
animation: ${(props)=>props.animation}; 

@keyframes fadein-title {
  0% { left:0px }
  25% { left:34.5px }
  50% {left:69px}
  75% {left:103.5px}
  100% {left:138px}
}

@keyframes fadeout-title {
  0% { left:138px }
  25% {left:103.5px}
  50% {left:69px}
  75% { left:34.5px }
  100% { left:0px }
}
`
const LinkContainer = styled.div`
//background-color:red;
padding-top:5px;
width:17rem;
`

const Link = styled.div`
padding-bottom:15px;
padding-left:15px;
padding-right:15px;
//background-color:white;
font-weight:bold;
width:17rem;
`

const LayerBody = styled.div`
width:70%;
`
const LinkBody = styled.div`
width:30%;
`
const MainBody = styled.div`
display:flex;
position:relative;
width:25.8rem;
//left:-280px;
left:${(props)=>props.left};
-webkit-animation: ${(props)=>props.animation};
-moz-animation: ${(props)=>props.animation}; 
-ms-animation: ${(props)=>props.animation};
-o-animation: ${(props)=>props.animation}; 
animation: ${(props)=>props.animation}; 

@keyframes fadein-body {
  0% { left:0px }
  25% { left:-70px }
  50% {left:-140px}
  75% {left:-210px}
  100% {left:-280px}
}

@keyframes fadeout-body {
  0% {left:-280px}
  25% {left:-210px}
  50% {left:-140px}
  75% { left:-70px }
  100% { left:0px }
}
`

class DataLayersBlock extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      layer:true,
      animationBody:'null',
      animationTitle:'null',
      leftTitle:'0px',
      layerTitleColor:'#2276AC',
      linkTitleColor:'black',
      leftBody:'0px',
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

  render () {
    const { onAction, layers, mapLoaded,tileOpacity, toggleHandler, baselineHandler, baselineId, activeLayers, comparing, comparingId, calendarStatus } = this.props;
    
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
            <MainBody left={this.state.leftBody} animation={this.state.animationBody}>
              <LayerBody>
                <Accordion>
                  {({ checkExpanded, setExpanded }) => (
                    <ol>
                      {layers.map((l, idx) => (
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
