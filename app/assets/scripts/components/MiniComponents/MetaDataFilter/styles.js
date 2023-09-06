import styled, { withTheme, ThemeProvider } from 'styled-components';
//import { themeVal } from '../../styles/utils/general';
import {themeVal} from '../../../styles/utils/general'
import { visuallyHidden, truncated } from '../../../styles/helpers';

export const LayerSwatch = styled.span`
  position: absolute;
  height:70px;
  top: 22.7rem;
  left: 0.125rem;
  bottom: 0.125rem;
  width: 0.25rem;
  //width:10rem;
  //background: grey;
  background: ${({ swatch }) => swatch || themeVal('color.primary')};
  border-radius: ${themeVal('shape.rounded')};

  > * {
    ${visuallyHidden()}
  }
`;

export const LayerTitle = styled.h1`
  ${truncated()}
  font-size: 1rem;
  line-height: 1.25rem;
  margin: 0;
  margin-top:8px;
  margin-left:16px;
  sub {
    bottom: 0;
  }
`;

export const MainContainer = styled.div`
display:flex;
height:22rem;
//height:298px;
width:100%;
border-bottom: 0.1px solid #E8E8E8;
`
export const Swatch = styled.div`
position:absolute;
height:21.8rem;
margin-left:2px;
margin-top:2px;
border-radius: 25px;
width:3.8px;
z-index:999999;
background-color:#C0C0C0;
`
export const Main = styled.div`
height:100%;
width:100%;
`

export const BodyContainer = styled.div`
display:flex;
margin-left:20px;
margin-top:0.8em;
width: 80%;
` 

export const Middle = styled.div`
position: relative; width: 60%; max-width: 500px; margin-left:2px;
height:50px;
` 

export const Slider = styled.div.attrs(props=>({
    left: `${props.left_value}%`,
    right: `${100 - props.right_value}%`
}))`
position: relative;
z-index: 1;
height: 6px;
margin: 0 5px;
margin-top:10px;

> .track {
	position: absolute;
	z-index: 1;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	border-radius: 3px;
	background-color: #CCE5FF;
}

> .range {
	position: absolute;
	z-index: 2;
    left: ${props => props.left};
    right: ${props => props.right};
	top: 0;
	bottom: 0;
	border-radius: 5px;
	background-color: #0080FF;
}

> .thumb {
	position: absolute;
	z-index: 3;
    margin-top:4px;
	width: 18px;
	height: 18px;
	background-color: #0080FF;
	border-radius: 50%;
	box-shadow: 0 0 0 0 rgba(98,0,238,.1);
	transition: box-shadow .3s ease-in-out;

	&.left {
        left: ${props => props.left};
		transform: translate(-15px, -10px);
	}

	&.right {
        right: ${props => props.right};
		transform: translate(15px, -10px);
	}

	&.hover {
		box-shadow: 0 0 0 20px rgba(98,0,238,.1);
	}

	&.active {
		box-shadow: 0 0 0 40px rgba(98,0,238,.2);
	}
}
`;

export const RangeInput = styled.input.attrs({ type: 'range' })`
position: absolute;
pointer-events: none;
-webkit-appearance: none;
z-index: 2;
height: 20px;
width: 100%;
opacity: 0;

&::-webkit-slider-thumb {
	pointer-events: all;
	width: 30px;
	height: 30px;
	border-radius: 0;
	border: 0 none;
	background-color: red;
	-webkit-appearance: none;
}
`

export const HeadComponent = styled.div`
display:flex;
justify-content:space-evenly;
`
