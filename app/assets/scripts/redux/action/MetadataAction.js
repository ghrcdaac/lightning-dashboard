import { METADATA, LAT_DATA, LON_DATA, REMOVE_METADATA, FRD_DATA, ISSLIS_PATH, HS3_PATH, SPINNER } from "../constants/MetadataConstant";

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

export const changeIsslisPath = (payload) =>{
    return {
        type:ISSLIS_PATH, 
        payload:payload
    }
}

export const changeHs3Path = (payload) =>{
    return {
        type:HS3_PATH,
        payload:payload
    }
}

export const changeSpinner = (payload) =>{
    return {
        type: SPINNER,
        payload:payload
    }
}