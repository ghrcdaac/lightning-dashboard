import { HOTSPOT } from "../constants/HotspotConstant"

const InitState = {
    HOTSPOT:false,
}

const HOTSPOT_REDUCER = (state=InitState, action) =>{
    if(action.type === HOTSPOT){
        return{
            ...state,
            HOTSPOT:action.payload
        }
    }else{
        return state
    }
}

export default HOTSPOT_REDUCER
