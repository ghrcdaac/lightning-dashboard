import React from "react";
import styled from "styled-components";
import BarChart from "../../common/bar-chart/chart";
import { BarChartIndex } from "../../../data/DataIndex";
import HistogramJSON from '../../../data/BarChart.json'
import { Link } from "react-router-dom";
import Download from "../../../utils/Download";
import Button from "../../../styles/button/button";
import BButton from "../BButton/BButton";

const ChartContainer = styled.div`
display:flex;
flex-direction:column;
//justify-content:center;
text-align:center;
//align-items:center;
//width:100%;
margin-bottom:40px;
`
const ChartTitle = styled.div`

`

const BarChartPanel = ({ layer }) =>{

    // const SEASONAL = BarChartIndex("TRMM LIS Seasonal")
    // const MONTHLY = BarChartIndex("TRMM LIS Monthly")
    // const DIURNAL = BarChartIndex("TRMM LIS Diurnal")
    // const FULL = BarChartIndex("TRMM LIS Full")

    const DATA = BarChartIndex(layer)

    return(
        <>
            <ChartContainer>
                <ChartTitle>{DATA.id}</ChartTitle>
                <BarChart
                yDomain={[DATA.min,DATA.max]}
                data={DATA.data.data}
                yUnit={'FRD'}
                id={DATA.id}
                />
                <div style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
                <BButton name="Download Data" color="#4CAF50" data={DATA}/>
                </div>
            </ChartContainer>
            {/* <ChartContainer>
                <ChartTitle>{SEASONAL.id}</ChartTitle>
                <BarChart
                yDomain={[SEASONAL.min,SEASONAL.max]}
                data={SEASONAL.data.data}
                yUnit={'FRD'}
                id={SEASONAL.id}
                />
                <div style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
                    <BButton name="Download Data" color="#4CAF50" data={SEASONAL}/>
                </div>
            </ChartContainer>
            <ChartContainer>
                <ChartTitle>{MONTHLY.id}</ChartTitle>
                <BarChart
                yDomain={[MONTHLY.min,MONTHLY.max]}
                data={MONTHLY.data.data}
                yUnit={'FRD'}
                id={MONTHLY.id}
                />
            </ChartContainer>
            <ChartContainer>
                <ChartTitle>{DIURNAL.id}</ChartTitle>
                <BarChart
                yDomain={[DIURNAL.min,DIURNAL.max]}
                data={DIURNAL.data.data}
                yUnit={'FRD'}
                id={DIURNAL.id}
                />
            </ChartContainer>      
            <ChartContainer>
                <ChartTitle>{FULL.id}</ChartTitle>
                <BarChart
                yDomain={[FULL.min,FULL.max]}
                data={FULL.data.data}
                yUnit={'FRD'}
                id={FULL.id}
                />
            </ChartContainer>        */}
        </>
    )
}

export default BarChartPanel
