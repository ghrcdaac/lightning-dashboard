import isslis from './Spring2022.json'
import hs3 from '../HS3/HS3.json'

export const connector = (layer_name, )=>{

}

//get year
export const get_arg1 = (id) =>{
    var json_data;
    if(id === 'ISS LIS'){
        json_data = isslis
    }else if(id === 'HS3'){
        json_data = hs3
    }
    console.log(id)
    console.log(json_data)
    const year = []
    json_data.map((element)=>{
        year.push(element.year)
    })
    return year
}

//get month
export const get_arg2 = (id,arg1) =>{
    var json_data;
    if(id === 'ISS LIS'){
        json_data = isslis
    }else if(id === 'HS3'){
        json_data = hs3
    }
    
    const data = json_data.filter(element=>element.year === arg1)
    const month = []
    console.log(data)
    data[0].data.map((element)=>{
        month.push(element.month)
    })

    return month
}

//get day
export const get_arg3 = (id,arg1,arg2) =>{
    var json_data;
    if(id === 'ISS LIS'){
        json_data = isslis
    }else if(id === 'HS3'){
        json_data = hs3
    }
    
    //arg1 => year
    //arg2 => month
    const year_data = json_data.filter(element=>element.year === arg1)
    const month_data = year_data[0].data.filter(element=>element.month === arg2)
    const day = Object.keys(month_data[0].day_indices)

    return day
}

//get time
export const get_arg4 = (id,arg1, arg2, arg3) =>{
    var json_data;
    if(id === 'ISS LIS'){
        json_data = isslis
    }else if(id === 'HS3'){
        json_data = hs3
    }
    const year_data = json_data.filter(element=>element.year === arg1)
    const month_data = year_data[0].data.filter(element=>element.month === arg2)
    const day_data = month_data[0].day_indices[arg3]

    const data_list = []

    console.log(year_data)
    console.log(month_data)
    console.log(day_data)

    if(id === 'ISS LIS'){
        for(var i = day_data[0];i<=day_data[1];i++){
            data_list.push(month_data[0].file[i].substring(25,31))
        }
    }else if(id === 'HS3'){
        for(var i = day_data[0];i<=day_data[1];i++){
            const f1 = 11, f3 = 11;
            const mid = month_data[0].file[i].length - f1 - f3
            data_list.push(month_data[0].file[i].substring(f1,f1+mid))
        }
    }
    return data_list
}