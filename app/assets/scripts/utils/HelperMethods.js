import React,{useState} from 'react';
import styled, { withTheme, ThemeProvider } from 'styled-components';
import { add, sub, format, isSameMonth, isSameDay } from 'date-fns';
import { string } from 'prop-types';

export function date_to_string(date, layer){

    var dateString = "";

    if(layer === 'TRMM LIS Full'){

    }else if(layer === 'TRMM LIS Monthly' || layer === 'OTD Monthly'){
        var month = date.getMonth() + 1;

        if(month < 10){
            dateString = date.getFullYear() + '0' + month 
        }else{
            dateString = date.getFullYear() + '' + month
        }        
    }else if(layer === 'TRMM LIS Daily' || layer === 'OTD Daily'){
        var month = date.getMonth() + 1;
        var day = date.getDate();

        if(month < 10 && day < 10){
            dateString = date.getFullYear() + '_0' + month + '_0' + day 
        }else if(month < 10){
            dateString = date.getFullYear() + '_0' + month + '_' + day
        }else if(day < 10){
            dateString = date.getFullYear() + '_' + month + '_0' + day
        }else if(month > 10 && day > 10){
            dateString = date.getFullYear() + '_' + month + '_' + day
        }
    }else{
        dateString = 'null'
    }

    return dateString
}

export function baseline_link(layers, activeLayer, dateString){
    var initLink = '';
    for(var i = 0;i<layers.length;i++){
        if(layers[i].id === activeLayer){
            initLink = layers[i].source.tiles[0]
            break;
        }
    }

    initLink = initLink.replace('{date}', dateString)

    return [initLink]
}

export function get_layer(id, layers){
    var layer;
    for(var i = 0;i<layers.length;i++){
        if(layers[i].id === id){
            layer = layers[i]
            break;
        }
    }

    return layer;
}

export function dateFormat(date, interval, id){

    const month = ["Jan","Feb","Mar","Apr","May","June","July","Aug","Sept","Oct","Nov","Dec"];
    var dateString = '';

    if(Array.isArray(date)){
        if(id === 'TRMM LIS Full'){
            dateString = date[1] + ' ' + date[2]
        }else if(id === 'TRMM LIS Seasonal'){
            dateString = date[1]
        }else if(id === 'TRMM LIS Diurnal'){
            dateString = date[1] + ' ' + date[2]
        }
    }else{        
        if(interval === 'month-day-year' && typeof date !== 'undefined' && date !== null){            
            if(id === 'TRMM LIS Seasonal'){
                if(month[date.getMonth()] === 'Mar'){
                    dateString = 'Spring'
                }else if(month[date.getMonth()] === 'Jul'){
                    dateString = 'Summer'
                }else if(month[date.getMonth()] === 'Oct'){
                    dateString = 'Autumn'
                }else{
                    dateString = 'Winter'
                }
            }else{
                dateString = month[date.getMonth()] + ' ' + date.getDate() + ' ' + date.getFullYear();
            }
        }
    }

    return dateString;
}

export function HotSpotDate(id, date){
    var newDate;

    var day = date.getDate();
    if(day <=9){
        day = '0' + day.toString();
    }
    const month = date.getMonth() + 1;
    const year = '2013';

    if(month <= 9){
        newDate = year + '-0' + month + '-' + day;   
    }else{
        newDate = year + '-' + month + '-' + day;
    }

    return newDate
}

export function dateSlice(date){
    
}

export function metadata_format(data){
   const formatted_data = []
   data.data.forEach((element)=>{
    if(element.Data !== 'nan'){
        formatted_data.push({
            "flashes":element.Data,
            'lat':element.Latitude,
            'lng':element.Longitude
        })
    }
   })

   return formatted_data
}

export function data_for_mapbox_data_driven_property(data){

    console.log(data)
    var average = 0
    for(var i = 0;i<(data.length);i++){
        if(data.data[i].Data !== 'nan'){
            average = average + parseFloat(data.data[i].Data)
        }
    }
    average = average / (data.length)
    console.log("AVERAGE: ",average)
    const times = 5.5 / average
    const formatted_data = []
    console.log("Here")
    data.data.forEach((element)=>{
        const desc = `Lat: ${element.Latitude}<br>Lon: ${element.Longitude}<br>FSD: ${element.Data}`
        if(element.Data !== 'nan'){            
            formatted_data.push({
                "type": "Feature",
                "properties": {
                  "frd":parseFloat(element.Data/20 * times),
                  'description':desc
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [ parseFloat(element.Longitude), parseFloat(element.Latitude) ]
                }
            })
        }
    })
    console.log("HelperMethods.js Line 159. Formatted Data: ")
    console.log(formatted_data)
    return {
        'type':'geojson',
        'data':{
            'type':'FeatureCollection',
            'features':formatted_data
        }
    }
}

export function get_metadata_api_file_path(layer_name, date){
    console.log(layer_name, date)
    const layer_len = layer_name[0].length
    if(layer_name[0].substring(0,2) === "TR"){
        const layer_type = layer_name[0].substring(9, layer_len)
        console.log("##",layer_type)
        if(layer_type === 'Full'){
            return 'TRMM-LIS/VHRFC_LIS_FRD/VHRFC_LIS_FRD.txt'
        }else if(layer_type === 'Monthly'){
            var month = date.getMonth()
            month = month + 1
            return `TRMM-LIS/VHRMC_LIS_FRD/${month}.0.txt` 
        }else if(layer_type === 'Seasonal'){
            var month = date.getMonth()
            if(month === 2){
                return `TRMM-LIS/VHRSC_LIS_FRD/1.0.txt`
            }else if(month === 6){
                return `TRMM-LIS/VHRSC_LIS_FRD/2.0.txt`
            }else if(month === 9){
                return `TRMM-LIS/VHRSC_LIS_FRD/3.0.txt`
            }else{
                return `TRMM-LIS/VHRSC_LIS_FRD/4.0.txt`
            }
        }else if(layer_type === 'Diurnal'){
            var month = date.getMonth() * 2
            var day = date.getDate()
            if(day === 15){
                month = month + 1
            }
            const path = `TRMM-LIS/VHRDC_LIS_FRD/${month}.0.txt`
            return path 
        }else if(layer_type === 'Daily'){
            const calendar = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
            var month = date.getMonth()
            var start = 0;
            for(var i = 0;i<month;i++){
                start += calendar[i]
            }
            var day = date.getDate()
            start += day
            var path = `TRMM-LIS/VHRAC_LIS_FRD/${start}.0.txt`
            return path
        }
    }else if(layer_name[0].substring(0,2) === "OT"){
        const layer_type = layer_name[0].substring(4, layer_len)
        console.log("##",layer_type)
        if(layer_type === 'Full'){
            return 'OTD/HRFC_COM_FR/HRFC_COM_FR.txt'
        }else if(layer_type === 'Monthly'){
            var month = date.getMonth()
            month = month + 1
            return `OTD/HRMC_COM_FR/${month}.0.txt` 
        }else if(layer_type === 'Diurnal'){
            var month = date.getMonth() * 2
            var day = date.getDate()
            if(day === 15){
                month = month + 1
            }
            const path = `OTD/LRDC_COM_FR/${month}.5.txt`
            return path 
        }else if(layer_type === 'Daily'){
            const calendar = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
            var month = date.getMonth()
            var start = 0;
            for(var i = 0;i<month;i++){
                start += calendar[i]
            }
            var day = date.getDate()
            start += day - 1
            var path = `OTD/LRAC_COM_FR/${start}.5.txt`
            return path
        }
    }else if(layer_name[0].substring(0,2) === "IS"){
        
    }else if(layer_name[0].substring(0,2) === 'HS'){

    }
}
