import { METADATA, LAT_DATA, LON_DATA, REMOVE_METADATA, FRD_DATA, ISSLIS_PATH, HS3_PATH, SPINNER } from "../constants/MetadataConstant";

const InitState = {
    METADATA:false,
    LAT_DATA:[],
    LON_DATA:[],
    FRD_DATA:[],
    REMOVE_METADATA:false,
    ISSLIS_PATH:'',
    HS3_PATH:'',
    SPINNER: false
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
    }else if(action.type === FRD_DATA){
        return {
            ...state,
            FRD_DATA: action.payload
        }
    }else if(action.type === ISSLIS_PATH){
        return {
            ...state,
            ISSLIS_PATH: action.payload
        }
    }else if(action.type === HS3_PATH){
        return {
            ...state,
            HS3_PATH: action.payload
        }
    }else if(action.type === SPINNER){
        return {
            ...state,
            SPINNER: !state.SPINNER
        }
    }
    else{
        return state
    }
}

export default METADATA_REDUCER