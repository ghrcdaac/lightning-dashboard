// left nav bar main file

import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';

import Panel from '../common/panel';
import DataLayersBlock from '../common/data-layers-block';

import media, { isLargeViewport } from '../../styles/utils/media-queries';

const PrimePanel = styled(Panel)`
  ${media.largeUp`
    width: 18rem;
  `}
`;

class ExpMapPrimePanel extends React.Component {
  render () {
    const {
      layers,
      onAction,
      onPanelChange,
      mapLoaded,
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
  spotlightList: T.object
};

export default ExpMapPrimePanel;
