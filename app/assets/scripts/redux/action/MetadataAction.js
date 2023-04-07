import { METADATA, LAT_DATA, LON_DATA, REMOVE_METADATA, FRD_DATA } from "../constants/MetadataConstant";

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

export const changeFRD = (payload) =>{
    return {
        type:FRD_DATA,
        payload:payload
    }
}

export const removeMetadata = (payload) =>{
    return {
        type:REMOVE_METADATA,
        payload:payload
    }
}