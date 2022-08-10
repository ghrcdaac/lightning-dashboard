import React from "react";
import styled from "styled-components";
import BarChart from "../../common/bar-chart/chart";
import { BarChartIndex } from "../../../data/DataIndex";

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

const BarChartPanel = () =>{

    const SEASONAL = BarChartIndex("TRMM LIS Seasonal")
    const MONTHLY = BarChartIndex("TRMM LIS Monthly")
    const DIURNAL = BarChartIndex("TRMM LIS Diurnal")
    const FULL = BarChartIndex("TRMM LIS Full")

    return(
        <>
            <ChartContainer>
                <ChartTitle>{SEASONAL.id}</ChartTitle>
                <BarChart
                yDomain={[SEASONAL.min,SEASONAL.max]}
                data={SEASONAL.data.data}
                yUnit={'FRD'}
                id={SEASONAL.id}
                //selectedDate={this.props.date}
                />
            </ChartContainer>
            <ChartContainer>
                <ChartTitle>{MONTHLY.id}</ChartTitle>
                <BarChart
                yDomain={[MONTHLY.min,MONTHLY.max]}
                data={MONTHLY.data.data}
                yUnit={'FRD'}
                id={MONTHLY.id}
                //selectedDate={this.props.date}
                />
            </ChartContainer>
            <ChartContainer>
                <ChartTitle>{DIURNAL.id}</ChartTitle>
                <BarChart
                yDomain={[DIURNAL.min,DIURNAL.max]}
                data={DIURNAL.data.data}
                yUnit={'FRD'}
                id={DIURNAL.id}
                //selectedDate={this.props.date}
                />
            </ChartContainer>      
            <ChartContainer>
                <ChartTitle>{FULL.id}</ChartTitle>
                <BarChart
                yDomain={[FULL.min,FULL.max]}
                data={FULL.data.data}
                yUnit={'FRD'}
                id={FULL.id}
                //selectedDate={this.props.date}
                />
            </ChartContainer>       
        </>
    )
}

export default BarChartPanel
