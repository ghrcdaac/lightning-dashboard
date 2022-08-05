import React from "react";
import styled from "styled-components";
import BarChart from "../common/bar-chart/chart";
import { BarChartIndex } from "../../data/DataIndex";

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
    const DAILY = BarChartIndex("TRMM LIS Daily")

    return(
        <>
            <ChartContainer>
                <ChartTitle>TRMM LIS Seasonal</ChartTitle>
                <BarChart
                yDomain={[SEASONAL.min,SEASONAL.max]}
                data={SEASONAL.data.data}
                yUnit={'FRD'}
                //selectedDate={this.props.date}
                />
            </ChartContainer>
            <ChartContainer>
                <ChartTitle>TRMM LIS Monthly</ChartTitle>
                <BarChart
                yDomain={[MONTHLY.min,MONTHLY.max]}
                data={MONTHLY.data.data}
                yUnit={'FRD'}
                //selectedDate={this.props.date}
                />
            </ChartContainer>
            <ChartContainer>
                <ChartTitle>TRMM LIS Diurnal</ChartTitle>
                <BarChart
                yDomain={[DIURNAL.min,DIURNAL.max]}
                data={DIURNAL.data.data}
                yUnit={'FRD'}
                //selectedDate={this.props.date}
                />
            </ChartContainer>      
            <ChartContainer>
                <ChartTitle>TRMM LIS Daily</ChartTitle>
                <BarChart
                yDomain={[DAILY.min,DAILY.max]}
                data={DAILY.data.data}
                yUnit={'FRD'}
                //selectedDate={this.props.date}
                />
            </ChartContainer>       
        </>
    )
}

export default BarChartPanel
