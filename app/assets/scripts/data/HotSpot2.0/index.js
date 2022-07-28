import data from './data'

export const HotSpotData = (id) =>{
    return data.data
}

export const getSingleHotSpot = (id)=>{
    data.data.forEach((hotspot)=>{
        if(hotspot.id === id){
            return hotspot
        }
    })
}