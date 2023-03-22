import styled, { withTheme, ThemeProvider } from 'styled-components';
//import { themeVal } from '../../styles/utils/general';
import {themeVal} from '../../../styles/utils/general'
import { visuallyHidden, truncated } from '../../../styles/helpers';


export const Body = styled.body`
margin: 0; padding: 0; height: 100vh; display: flex; justify-content: center; align-items: center; background-color: blue;
` 

export const Middle = styled.div`
position: relative; width: 80%; max-width: 500px;;
` 

export const Slider = styled.div`
position: relative;
z-index: 1;
height: 6px;
margin: 0 15px;
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
	left: ${(props)=>props.left_value}%;
	right: ${(props)=>100-props.right_value}%;
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
		left: ${(props)=>props.left_value}%;
		transform: translate(-15px, -10px);
	}

	&.right {
		right: ${(props)=>100-props.right_value}%;
		transform: translate(15px, -10px);
	}

	&.hover {
		box-shadow: 0 0 0 20px rgba(98,0,238,.1);
	}

	&.active {
		box-shadow: 0 0 0 40px rgba(98,0,238,.2);
	}
}
`
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


