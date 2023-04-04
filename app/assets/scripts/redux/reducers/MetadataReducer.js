import { METADATA, LAT_DATA, LON_DATA, REMOVE_METADATA } from "../constants/MetadataConstant";

const InitState = {
    METADATA:false,
    LAT_DATA:[],
    LON_DATA:[],
    REMOVE_METADATA:false
}

const METADATA_REDUCER = (state=InitState, action) =>{
    if(action.type === METADATA){
        return{
            ...state,
            METADATA:!state.METADATA
        }
    }else if(action.type === LAT_DATA){
        return {
            ...state,
            LAT_DATA:action.payload
        }
    }else if(action.type === LON_DATA){
        return {
            ...state,
            LON_DATA: action.payload
        }
    }else if(action.type === REMOVE_METADATA){
        return {
            ...state,
            REMOVE_METADATA: !state.REMOVE_METADATA
        }
    }else{
        return state
    }
}

export default METADATA_REDUCER