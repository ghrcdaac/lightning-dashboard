// not used at all -- might delete it later

import React, { Component } from 'react';
import { PropTypes as T } from 'prop-types';
import styled, { css } from 'styled-components';
import { Transition, TransitionGroup } from 'react-transition-group';

import { themeVal } from '../../styles/utils/general';
import { glsp } from '../../styles/utils/theme-values';

const fadeDuration = 240;

const Message = styled.div`
  position: absolute;
  left: 50%;
  z-index: 10;
  transform: translate(-50%, 0);
  padding: ${glsp(1 / 2, 0.75)};
  background: #fff;
  box-shadow: 0 0 4px 4px ${themeVal('color.baseAlphaA')};
  border-radius: ${themeVal('shape.rounded')};
  font-size: 0.875rem;
  line-height: 1rem;
  text-align: center;

  transition: all ${fadeDuration}ms ease-in-out;
  ${({ show }) => show ? css`
    visibility: visible;
    top: 0.5rem;
    opacity: 1;
  ` : css`
    visibility: hidden;
    top: -2rem;
    opacity: 0;
  `}
`;

class MapMessage extends Component {
  render () {
    const {
      id,
      children,
      active
    } = this.props;

    return (
      <TransitionGroup component={null}>
        {active && (
          <Transition
            key={id}
            timeout={fadeDuration}
          >
            {state => {
              return (
                <Message show={state === 'entered' || state === 'entering'}>
                  {children}
                </Message>
              );
            }}
          </Transition>

        )}
      </TransitionGroup>
    );
  }
}

MapMessage.propTypes = {
  id: T.string,
  children: T.node,
  active: T.bool
};

export default MapMessage;
