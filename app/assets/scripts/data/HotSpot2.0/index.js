import data from './data'
import realData from './HOTSPOT_REAL_DATA'

export const HotSpotData = (id) =>{
    //return data.data
    return realData
}

export const getSingleHotSpot = (id)=>{
    data.data.forEach((hotspot)=>{
        if(hotspot.id === id){
            return hotspot
        }
    })
}