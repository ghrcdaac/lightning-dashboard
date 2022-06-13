import React,{useState} from 'react';
import styled, { withTheme, ThemeProvider } from 'styled-components';
import { add, sub, format, isSameMonth, isSameDay } from 'date-fns';

export function date_to_string(date, layer){

    var dateString = "";

    if(layer === 'TRMM LIS Full'){

    }else if(layer === 'TRMM LIS Monthly'){
        var month = date.getMonth() + 1;

        if(month < 10){
            dateString = date.getFullYear() + '0' + month 
        }else{
            dateString = date.getFullYear() + '' + month
        }        
    }else if(layer === 'TRMM LIS Daily'){
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
