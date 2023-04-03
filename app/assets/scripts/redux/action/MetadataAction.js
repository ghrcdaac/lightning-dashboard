import { METADATA } from "../constants/MetadataConstant";
import { LAT_DATA } from "../constants/MetadataConstant";
import { LON_DATA } from "../constants/MetadataConstant";

export const changeMetadata = (payload) =>{
    return{
        type:METADATA,
        payload:payload
    }
}

export const changeLAT = (payload) =>{
    return {
        type: LAT_DATA,
        payload:payload
    }
}

export const changeLON = (payload) =>{
    return {
        type: LON_DATA,
        payload:payload
    }
}