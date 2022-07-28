import React from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { truncated } from "../../../styles/helpers";
import { FormSwitch } from "../../../styles/form/switch";
import { changeHotspot } from "../../../redux/action/HotspotAction";
import {FaSatellite} from "../../../../../../node_modules/react-icons/fa"

const MainContainer = styled.div`
display:flex;
height:60px;
width:100%;
border-bottom: 0.1px solid #E8E8E8;
`
const InnerContainer = styled.div`
display: flex;
justify-content: center;
align-items: center;
height:100%;
`

const Swatch = styled.div`
//position:absolute;
//height:69px;
height:95%;
margin-left:2px;
//margin-top:2px;
border-radius: 25px;
width:3.8px;
z-index:999999;
background-color:#C0C0C0;
//margin-bottom:5px;
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
  //margin-bottom:10px;
  margin-left:15px;
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
            <InnerContainer>
                <Swatch />
                <Main>
                    <div>
                        <LayerTitle title={'HotSpots'}>
                            <div style={{display:'flex'}}>
                                <FaSatellite/> 
                                <h3 style={{marginLeft:"15px"}}>HotSpots</h3>
                            </div>
                            </LayerTitle>
                    </div>
                    <div style={{marginLeft:'90px'}}>
                        <FormSwitch
                        hideText
                        //name={`toggle-${id}`}
                        //disabled={disabled}
                        checked={HOTSPOT}
                        onChange={ToggleHandler}
                        >
                        Toggle layer visibility
                        </FormSwitch>
                    </div>
                </Main>
            </InnerContainer>
        </MainContainer>
    )
}

export default HotSpotToggle