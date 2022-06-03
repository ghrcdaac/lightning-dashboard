import React,{useState} from 'react';
import styled, { withTheme, ThemeProvider } from 'styled-components';

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
