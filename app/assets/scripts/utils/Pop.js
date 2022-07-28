import React from "react";
import ReactDOM from 'react-dom'
import styled from "styled-components";
import {
    getAnchorTranslate,
    Popover,
    PopoverContents,
    PopoverHeader,
    PopoverHeadline,
    PopoverSubtitle,
    PopoverToolbar,
    PopoverBody,
    PopoverFooter
} from '../components/common/mb-map-explore/mb-popover/styled';

const Container = styled.div`
width: 100px;
height: 100px;
//background-color: rgba(200, 200, 200,0.6);
background-color:red;
//position: relative;
display: flex;
justify-content: center;
align-items: center;
z-index:999999;
bottom:100vh;
border-radius: 12px;
transform: translate(${(props)=>props.top}, ${(props)=>props.left});
`

const Pop = ({mbMap}) =>{

    const offset = [38,3]
    const lngLat = [-84.253, 45.235]
    const { pageYOffset, pageXOffset } = window;

    console.log(mbMap)
    
    const {
      width,
      height,
      top,
      left
    } = mbMap.getContainer().getBoundingClientRect();
    const mapTop = pageYOffset + top;
    const mapLeft = pageXOffset + left;
    const mapRight = pageXOffset + left + width;
    const mapBottom = pageYOffset + top + height;

    const pos = mbMap.project(lngLat);

    const anchorPosition = {
        top: mapTop + pos.y,
        left: mapLeft + pos.x
    };

    let anchorPoints = [];

    const popoverDomRect = this.popoverEl.getBoundingClientRect();
    const halfW = popoverDomRect.width / 2;
    if (anchorPosition.top - popoverDomRect.height - offsetTop < pageYOffset) {
      anchorPoints = ['top'];
      anchorPosition.top += offsetBottom;
    } else {
      anchorPoints = ['bottom'];
      anchorPosition.top -= offsetTop;
    }
    if (anchorPosition.left - halfW < mapLeft) {
      anchorPoints.push('left');
    } else if (anchorPosition.left + halfW > mapRight) {
      anchorPoints.push('right');
    }

    const hasPlacement = top !== null && left !== null;
    const anchor = anchorPoints.join('-');


    const popoverStyle = {
        transform: hasPlacement
          ? `${getAnchorTranslate(anchor)} translate(${left}px, ${top}px)`
          : undefined,
        display: !hasPlacement ? 'none' : undefined
      };

    console.log(anchorPosition)
    return ReactDOM.createPortal(
        <div>
            <Popover
            className={className}
            style={popoverStyle}
            ref={el => {
                this.popoverEl = el;
            }}
            >
            <PopoverContents anchor={anchor} verticalAttachment={anchorPoints[0]}>
                <div>wassup</div>
            </PopoverContents>
            </Popover>
        </div> 
        ,document.getElementById('portal')
    )
}

export default Pop