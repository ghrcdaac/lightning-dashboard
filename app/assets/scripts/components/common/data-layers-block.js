// used to show the layers infomation on the left nav bar

import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';
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

const PanelBlockLayer = styled(PanelBlock)`
  flex: 2;
`;

class DataLayersBlock extends React.Component {

  render () {
    const { onAction, layers, mapLoaded,tileOpacity, toggleHandler } = this.props;

    return (
      <PanelBlockLayer>
        <PanelBlockHeader>
          <PanelBlockTitle>Layers</PanelBlockTitle>
        </PanelBlockHeader>
        <PanelBlockBody>
          <PanelBlockScroll>
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
            <MarkerToggle toggleHandler={toggleHandler}/>
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
};

export default DataLayersBlock;
