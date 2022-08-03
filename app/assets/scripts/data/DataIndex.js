import HotSpotJSON from './HotSpot'
import BarChartJSON from './BarChart'

export const HotSpotIndex = (id) =>{
    console.log(id, HotSpotJSON)
    var a;
    HotSpotJSON.layers.forEach((element)=>{
        if(element.name === id){
            console.log(element.HotSpots)
            a = element.HotSpots
        }
    })

    return a
}

export const BarChartIndex = (id) =>{
    var layerData;
    BarChartJSON.forEach((layer)=>{
        if(layer.id === id){
            layerData = layer
        }
    })

    var min = layerData.data[0].indicator, max = layerData.data[0].indicator;
    layerData.data.forEach((data)=>{
        if(data.indicator < min){
            min  = data.indicator;
        }
        if(data.indicator > max){
            max = data.indicator;
        }
    })

    return{
        max:max,
        min:min,
        data:layerData
    }
}