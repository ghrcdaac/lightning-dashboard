import isslis from './Spring2022.json'

//get year
export const get_arg1 = () =>{
    const year = []
    isslis.map((element)=>{
        year.push(element.year)
    })
    return year
}

//get month
export const get_arg2 = (arg) =>{
    const data = isslis.filter(element=>element.year === arg)
    const month = []
    console.log(data)
    data[0].data.map((element)=>{
        month.push(element.month)
    })

    return month
}

//get day
export const get_arg3 = (arg1,arg2) =>{
    //arg1 => year
    //arg2 => month
    const year_data = isslis.filter(element=>element.year === arg1)
    const month_data = year_data[0].data.filter(element=>element.month === arg2)
    const day = Object.keys(month_data[0].day_indices)

    return day
}

//get time
export const get_arg4 = (arg1, arg2, arg3) =>{
    const year_data = isslis.filter(element=>element.year === arg1)
    const month_data = year_data[0].data.filter(element=>element.month === arg2)
    const day_data = month_data[0].day_indices[arg3]

    const data_list = []

    console.log(year_data)
    console.log(month_data)
    console.log(day_data)

    for(var i = day_data[0];i<=day_data[1];i++){
        data_list.push(month_data[0].file[i].substring(25,31))
    }

    console.log(data_list)
    return data_list
}