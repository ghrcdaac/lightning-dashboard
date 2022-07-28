import HotSpotJSON from './HotSpot'

const DataIndex = (id) =>{
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

export default DataIndex