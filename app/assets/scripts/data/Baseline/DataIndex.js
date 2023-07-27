import Baseline2 from './Baseline2'

export const getBaselineData = (id) =>{
    var a;
    Baseline2.forEach((element)=>{
        if(element.id === id){
            a = element
        }
    })
    return a
}
