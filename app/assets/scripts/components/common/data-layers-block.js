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

import Slider from '../../utils/Slider';
import MarkerToggle from '../../utils/MarkerToggle';
import BaselineToggle from '../../utils/BaselineToggle'
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
}
transition:1s;
left:0;

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
//color:#1da1f2;
transition:slideRight 0.6s ease;
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
`
const BottomLine = styled.div`
width:124%;
height:3px;
background-color:grey;
transition:1s;
left:0;
justify-content:center;
align-items:center;
background-color:#2276AC;
position:relative;
top:10px;
transition: all 0.3s ease-in-out;
`
const LinkContainer = styled.div`
//background-color:red;
padding-top:5px;
`

const Link = styled.div`
padding-bottom:15px;
padding-left:15px;
padding-right:15px;
//background-color:white;
font-weight:bold;
`

const slideRight = keyframes`
from{
left:0px;
}
to{
left:50px;
}
`;

class DataLayersBlock extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      layer:true
    };  
    
    this.layerHandler = this.layerHandler.bind(this);
    this.linkHandler = this.linkHandler.bind(this);
  }

  layerHandler(){
    this.setState({layer:true})
  }
  linkHandler(){
    this.setState({layer:false})
  }

  render () {
    const { onAction, layers, mapLoaded,tileOpacity, toggleHandler, baselineHandler, baselineId, activeLayers, comparing, comparingId, calendarStatus } = this.props;
    
    return (
      <PanelBlockLayer>
        <PanelBlockHeader>
          <PanelBlockTitle>
            <TitleBlock>
              <LayerTitle>
                {this.state.layer && <TitleName onClick={this.layerHandler} style={{color:COLOR}}>Layers</TitleName>}
                {this.state.layer && <BottomLine></BottomLine>}
                {!this.state.layer && <TitleName onClick={this.layerHandler}>Layers</TitleName>}
              </LayerTitle>
              <LinkTitle>
                {!this.state.layer && <TitleName onClick={this.linkHandler} style={{color:COLOR}}>Links</TitleName>}
                {!this.state.layer && <BottomLine></BottomLine>}
                {this.state.layer && <TitleName onClick={this.linkHandler}>Links</TitleName>}
              </LinkTitle>
            </TitleBlock>
          </PanelBlockTitle>
        </PanelBlockHeader>
        <PanelBlockBody>
          <PanelBlockScroll>
            {this.state.layer && <Accordion>
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
            </Accordion>}
            { this.state.layer && <Slider slideHandler={tileOpacity}/>}
            { this.state.layer && <BaselineToggle calendarStatus={calendarStatus} layers={layers} activeLayers={activeLayers} comparing={comparing} baselineHandler={baselineHandler} comparingId={comparingId} baselineId={baselineId}/>}
            {!this.state.layer &&
            <LinkContainer>
              {LINK_DATA.links.map((link)=>(
              <Link>
                <FiExternalLink/>
                <a style={{marginLeft:'10px'}} href={link.link} target="_blank">{link.name}</a>
              </Link>
              ))}
            </LinkContainer>
            }
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
