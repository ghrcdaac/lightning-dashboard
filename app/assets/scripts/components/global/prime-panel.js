// left nav bar main file

import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import Slider from '../../utils/Slider';

import Panel from '../common/panel';
import DataLayersBlock from '../common/data-layers-block';

import media, { isLargeViewport } from '../../styles/utils/media-queries';

const PrimePanel = styled(Panel)`
  // ${media.largeUp`
  //   width: 18rem;
  // `}
  width:18rem;
`;

class ExpMapPrimePanel extends React.Component {

  render () {
    const {
      layers,
      onAction,
      onPanelChange,
      mapLoaded,
      tileOpacity,
      toggleHandler,
      baselineHandler,
      baselineId,
      activeLayers,
      comparing, 
      comparingId,
      calendarStatus,
    } = this.props;

    return (
        <PrimePanel
          collapsible
          direction='left'
          onPanelChange={onPanelChange}
          initialState={isLargeViewport()}
          bodyContent={
          <>
            <DataLayersBlock
              layers={layers}
              mapLoaded={mapLoaded}
              onAction={onAction}
              tileOpacity={tileOpacity}
              toggleHandler={toggleHandler}
              baselineHandler={baselineHandler}
              baselineId={baselineId}
              activeLayers={activeLayers}
              comparing={comparing}
              comparingId={comparingId}
              calendarStatus={calendarStatus}
            />
          </>
          }
        />
    );
  }
}

ExpMapPrimePanel.propTypes = {
  onPanelChange: T.func,
  onAction: T.func,
  layers: T.array,
  mapLoaded: T.bool,
  aoiState: T.object,
  spotlightList: T.object,
  tileOpacity:T.func,
  toggleHandler:T.func,
  baselineHandler:T.func,
  baselineId:T.func,
  activeLayers:T.array,
  comparing:T.bool,
  comparingId:T.string,
  calendarStatus:T.func,
};

export default ExpMapPrimePanel;
