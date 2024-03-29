import styled from 'styled-components';
import { tint } from 'polished';

import { themeVal, stylizeFunction } from '../../styles/utils/general';
import { glsp } from '../../styles/utils/theme-values';
import Heading from '../../styles/type/heading';
import ShadowScrollbar from '../common/shadow-scrollbar';

const _tint = stylizeFunction(tint);

export const PanelBlock = styled.section`
  display: flex;
  flex-flow: column nowrap;
  flex: 1;
  position: relative;
  z-index: 10;
  box-shadow: 0 -1px 0 0 ${themeVal('color.baseAlphaB')};
`;

export const PanelBlockHeader = styled.header`
  box-shadow: 0 1px 0 0 ${themeVal('color.baseAlphaB')};
  background: ${_tint(0.02, themeVal('color.surface'))};
  position: relative;
  z-index: 10;
  padding: ${glsp(0.5)} ${glsp()};
`;

export const PanelBlockTitle = styled(Heading).attrs({ size: 'medium' })`
  margin: 0;
`;

export const PanelBlockBody = styled.div`
  display: flex;
  flex-flow: column nowrap;
  flex: 1;
  margin-top:10px;
`;

export const PanelBlockScroll = styled(ShadowScrollbar)`
  flex: 1;
  z-index: 1;
`;
