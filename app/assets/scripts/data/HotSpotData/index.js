import FullJSON from './Full'
import SeasonalJSON from './Seasonal'
import MonthlyJSON from './Monthly'
import DiurnalJSON from './Diurnal'

import { HotSpotDate } from '../../utils/HelperMethods'

export const data = (layerName, date) =>{
    var datas;
    if(layerName === 'TRMM LIS Full'){
        datas = FullJSON.dates.filter((element)=>element.date === date)
    }else if(layerName === 'TRMM LIS Seasonal'){
        datas = SeasonalJSON.dates.filter((element)=>element.date === date)
    }else if(layerName === 'TRMM LIS Monthly'){
        datas = MonthlyJSON.dates.filter((element)=>element.date === date)
    }else if(layerName === 'TRMM LIS Diurnal'){
        datas = DiurnalJSON.dates.filter((element)=>element.date === date)
    }else if(layerName === 'TRMM LIS Daily'){
        datas = FullJSON.dates.filter((element)=>element.date === '2013-01-01')
    }
    return datas
}