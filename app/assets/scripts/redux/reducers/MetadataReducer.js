import { METADATA } from "../constants/MetadataConstant";
import { LAT_DATA } from "../constants/MetadataConstant";
import { LON_DATA } from "../constants/MetadataConstant";

const InitState = {
    METADATA:false,
    LAT_DATA:[],
    LON_DATA:[]
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
    }else{
        return state
    }
}

export default METADATA_REDUCER