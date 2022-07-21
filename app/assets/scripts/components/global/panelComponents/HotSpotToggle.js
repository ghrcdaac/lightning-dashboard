import React from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { truncated } from "../../../styles/helpers";
import { FormSwitch } from "../../../styles/form/switch";
import { changeHotspot } from "../../../redux/action/HotspotAction";

const MainContainer = styled.div`
display:flex;
height:74px;
width:100%;
border-bottom: 0.1px solid #E8E8E8;
`
const Swatch = styled.div`
position:absolute;
height:69px;
margin-left:2px;
margin-top:2px;
border-radius: 25px;
width:3.8px;
z-index:999999;
background-color:#C0C0C0;
`
const Main = styled.div`
display:flex;
justify-content:center;
text-align:center;
align-items:center;
`
const LayerTitle = styled.h1`
  ${truncated()}
  font-size: 1rem;
  line-height: 1.25rem;
  margin: 0;
  margin-bottom:10px;
  margin-left:-82px;
  sub {
    bottom: 0;
  }
`;


const HotSpotToggle = ({activeLayers}) =>{

    const HOTSPOT = useSelector(state=>state.HOTSPOT_REDUCER.HOTSPOT)
    const dispatch = useDispatch();

    const ToggleHandler = (e) =>{
        dispatch(changeHotspot(!HOTSPOT))
    }

    return(
        <MainContainer>
                <Swatch />
            <Main>
                <div>
                    <LayerTitle>HotSpots</LayerTitle>
                    <h6 style={{marginLeft:'17px'}}>Note: Activate layer for HotSpot</h6>
                </div>
                {(activeLayers.length !== 0) && <div style={{marginLeft:'45px'}}>
                    <FormSwitch
                    hideText
                    //name={`toggle-${id}`}
                    //disabled={disabled}
                    checked={HOTSPOT}
                    onChange={ToggleHandler}
                    >
                    Toggle layer visibility
                </FormSwitch>
                </div>}
            </Main>
        </MainContainer>
    )
}

export default HotSpotToggle