import HotSpotJSON from './HotSpot'
import BarChartJSON from './BarChart'
import Baseline2 from './Baseline2'

export const HotSpotIndex = (id) =>{
    var a;
    HotSpotJSON.layers.forEach((element)=>{
        if(element.name === id){
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
        data:layerData,
        id:id
    }
}

export const getBaselineData = (id) =>{
    var a;
    Baseline2.forEach((element)=>{
        if(element.id === id){
            a = element
        }
    })
    return a
}
