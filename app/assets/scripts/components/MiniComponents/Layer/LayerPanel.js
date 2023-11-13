import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import LayerCard from './LayerCard';
import {FiArrowRight,FiArrowLeft} from "../../../../../../node_modules/react-icons/fi"
import {MdOutlineKeyboardArrowRight, MdOutlineKeyboardArrowLeft} from "../../../../../../node_modules/react-icons/md"

const OuterContainer = styled.div`
width:100%;
height:120px;
background-color: none;
position: absolute;
display:flex;
flex-direction:row;
bottom:${(props)=>props.bottom};
// background-color:red;
justify-content:center;
`

const LeftScrollBtn = styled.button`
  height: 100%;
  width: 3%;
  margin-right: 15px;
  background-color: 	rgb(168,168,168,0.2);
  border: none;
  transition: background-color 0.3s;

  &:hover {
    background-color: 	rgb(48,48,48, 1); /* Darkish gray */
    cursor:pointer;
  }
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  width: 90%;
  height: 100%;
  // background-color: red;
  position: relative;
  display: flex;
  flex-direction: row;
  overflow-x: hidden;
  bottom: ${(props) => props.bottom};
  overflow-y: hidden; /* Hide vertical scrollbar */
  scrollbar-width: none; /* Hide horizontal scrollbar for Firefox */
  -ms-overflow-style: none; /* Hide horizontal scrollbar for IE and Edge */
  // background-color:blue;
  &::-webkit-scrollbar {
    width: 8px; /* Adjust as needed */
    height:8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #ccc;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: #888;
  }

  &:hover {
    &::-webkit-scrollbar-thumb {
      background-color: #888;
    }
  }

  &:not(:hover) {
    &::-webkit-scrollbar-thumb {
      background-color: #ccc;
    }
  }
`;

const RightScrollBtn = styled.button`
  height: 100%;
  width: 3%;
  margin-left: 13px;
  background-color: 	rgb(168,168,168,0.2);
  border: none;
  transition: background-color 0.3s;

  &:hover {
    background-color: 	rgb(48,48,48, 1); /* Darkish gray */
    cursor:pointer;
  }
`;

// Define the keyframes for the animation
const slideAnimation = keyframes`
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-100px); /* Adjust the distance as needed */
  }
`;

const SliderButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 30px;
  height: 30px;
  background-color: #ccc;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  z-index: 1;
`;

const LeftSliderButton = styled(SliderButton)`
  left: 5px;
`;

const RightSliderButton = styled(SliderButton)`
  right: 5px;
`;

const LayerPanel = ({ onAction, layers, activeLayer }) => {
  var bottom = '20px';
  if (activeLayer.length !== 0) {
    bottom = '150px';
  }

  const clickHandler = (layer) => {
    localStorage.setItem('dataset_selected', true)
    onAction('layer.toggle', layer);
  };

  const scrollContainerLeft = () => {
    const container = document.getElementById('layer-container');
    if (container) {
      let scrollAmount = container.scrollLeft;
      const increment = -800; // Negative value to scroll left
  
      const targetScrollAmount = scrollAmount + increment;
      const scrollInterval = setInterval(() => {
  
        if (scrollAmount > targetScrollAmount) {
          scrollAmount += -25; // Decrement by -1 or a smaller value for smoother scrolling
          container.scrollLeft = scrollAmount;
        } else {
          clearInterval(scrollInterval); // Stop the interval once target is reached
        }
      }, 1);
    }
  };
  
  const scrollContainerRight = () => {
    const container = document.getElementById('layer-container');
    if (container) {
      let scrollAmount = container.scrollLeft;
      const increment = 800; // Adjust the increment as needed
  
      const targetScrollAmount = scrollAmount + increment;

      const scrollInterval = setInterval(() => {
  
        if (scrollAmount < targetScrollAmount) {
          scrollAmount += 25; // Increment by 1 or a smaller value for smoother scrolling
          container.scrollLeft = scrollAmount;
        } else {
          clearInterval(scrollInterval); // Stop the interval once target is reached
        }
      }, 1);
    }
  };

  return (
    <OuterContainer bottom={bottom}>
      <LeftScrollBtn onClick={scrollContainerLeft}><MdOutlineKeyboardArrowLeft size={25}/></LeftScrollBtn>
      <Container id="layer-container">
        {layers.map((layer) => (
          <LayerCard clicked={clickHandler} layer={layer} activeLayer={activeLayer} key={layer.name}/>
        ))}
      </Container>
      <RightScrollBtn onClick={scrollContainerRight}><MdOutlineKeyboardArrowRight size={25}/> </RightScrollBtn>
    </OuterContainer>
  );
};

export default LayerPanel;
