import { HOTSPOT } from "../constants/HotspotConstant";

export const changeHotspot = (payload) =>{
    return{
        type:HOTSPOT,
        payload:payload
    }
}