// helps with collapsing/uncollapsing the left nav bar

import React from 'react';
import T from 'prop-types';
import styled, { css } from 'styled-components';

import { themeVal, stylizeFunction } from '../../styles/utils/general';
import { tint } from 'polished';
import { headingAlt } from '../../styles/type/heading';
import { panelSkin } from '../../styles/skins';
import { glsp } from '../../styles/utils/theme-values';
import media from '../../styles/utils/media-queries';

import Button from '../../styles/button/button';

const _tint = stylizeFunction(tint);

export const PanelSelf = styled.section`
  position: relative;
  display: flex;
  flex-flow: column nowrap;
  max-width: 0;
  width: 100vw;
  height: 100%;
  z-index: 10;
  transition: all 0.16s ease 0s,

  ${({ revealed }) => revealed && css`
    ${panelSkin()}
    max-width: 100vw;
    z-index: 15;

    ${media.largeUp`
      width: 16rem;
    `}
  `}
`;

const PanelHeader = styled.header`
  box-shadow: 0 1px 0 0 ${themeVal('color.baseAlphaB')};
  background: ${_tint(0.02, themeVal('color.surface'))};
  position: relative;
  z-index: 100;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  padding: ${glsp(1, 0)};
  max-width: 0;
  opacity: 0;
  overflow: hidden;
  transition: max-width 0.16s ease 0s, padding 0.16s ease 0s, opacity 0.16s ease 0s;

  ${({ revealed }) => revealed && css`
    overflow: visible;
    max-width: 100vw;
    padding: ${glsp()};
    opacity: 1;
  `}
`;

export const PanelHeadline = styled.div`
  min-width: 0px;
`;

export const PanelToolbar = styled.div`
  margin-left: auto;
  padding-left: ${glsp()};
`;

export const PanelTitle = styled.h1`
  ${headingAlt}
  margin: 0;
`;

const PanelBody = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  max-width: 0;
  opacity: 0;
  overflow: hidden;
  transition: max-width 0.16s ease 0s, opacity 0.16s ease 0s;

  ${({ revealed }) => revealed && css`
    max-width: 100vw;
    opacity: 1;
    overflow: visible;
  `}
`;

const PanelOffsetActions = styled.div`
  ${panelSkin()}
  position: absolute;
  top: ${glsp(0.5)};
  border-radius: ${themeVal('shape.rounded')};
  transform: translate(0, 0);
  z-index: 120;

  ${({ direction }) => direction === 'right' && css`
    right: calc(100% + ${glsp(0.5)}); /* stylelint-disable-line */

    // ${media.mediumDown`
    //   ${({ revealed }) => revealed && css`
    //     right: ${glsp(0.5)};
    //   `}
    // `}
  `}

  ${({ direction }) => direction === 'left' && css`
    left: calc(100% + ${glsp(0.5)}); /* stylelint-disable-line */

    // ${media.mediumDown`
    //   ${({ revealed }) => revealed && css`
    //     left: calc(100% - ${glsp(0.5)});
    //     transform: translate(-100%, 0);
    //   `}
    // `}
  `}
`;

class Panel extends React.Component {
  constructor (props) {
    super(props);
    this.state = { revealed: props.initialState };

    this.onCollapseClick = this.onCollapseClick.bind(this);
  }

  onCollapseClick () {
    const { onPanelChange, overrideControl, revealed } = this.props;
    if (overrideControl) {
      return onPanelChange({ revealed: !revealed });
    }

    this.setState(
      (state) => ({ revealed: !state.revealed }),
      () => {
        onPanelChange && onPanelChange({ revealed: this.state.revealed });
      }
    );
  }

  render () {
    const {
      headerContent,
      renderHeader,
      bodyContent,
      collapsible,
      direction,
      className,
      overrideControl
    } = this.props;
    const revealed = overrideControl
      ? this.props.revealed
      : this.state.revealed;

    const icon =
      direction === 'left'
        ? revealed
          ? 'shrink-to-left'
          : 'expand-from-left'
        : revealed
          ? 'shrink-to-right'
          : 'expand-from-right';

    const header = typeof renderHeader === 'function'
      ? renderHeader({ revealed })
      : headerContent ? (
        <PanelHeader revealed={revealed}>
          {headerContent}
        </PanelHeader>
      ) : null;

    return (
      <PanelSelf revealed={revealed} className={className}>
        {header}
        <PanelBody revealed={revealed}>{bodyContent}</PanelBody>
        {collapsible && (
          <PanelOffsetActions revealed={revealed} direction={direction}>
            <Button
              variation='base-plain'
              useIcon={icon}
              title='Show/hide prime panel'
              hideText
              onClick={this.onCollapseClick}
            >
              <span>Prime panel</span>
            </Button>
          </PanelOffsetActions>
        )}
      </PanelSelf>
    );
  }
}

Panel.propTypes = {
  initialState: T.bool,
  overrideControl: T.bool,
  direction: T.oneOf(['left', 'right']),
  revealed: T.bool,
  onPanelChange: T.func,
  className: T.string,
  collapsible: T.bool,
  headerContent: T.node,
  renderHeader: T.func,
  bodyContent: T.node
};

Panel.defaultProps = {
  initialState: true,
  direction: 'left'
};

export default Panel;
