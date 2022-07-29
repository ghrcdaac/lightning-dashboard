import React from "react";
import styled from "styled-components";

const OuterContainer = styled.div`
`
const Container = styled.div`
display:flex;
`

const TextContainer = styled.div`
width:100px;
`

const HotSpotBody = ({ rank, lat, lng, frd, ppl, country, ppl_lat, ppl_lon, dist }) =>{

    return(
        <OuterContainer>
            <Container>
                <TextContainer>Global_Rank:</TextContainer> {rank}
            </Container>
            <Container>
                <TextContainer>FRD:</TextContainer> {frd}
            </Container>
            <Container>
                <TextContainer>Lat:</TextContainer> {lat}
            </Container>
            <Container>
                <TextContainer>Lng:</TextContainer> {lng}
            </Container>
            <Container>
                <TextContainer>PPL:</TextContainer> {ppl}
            </Container>
            <Container>
                <TextContainer>Country:</TextContainer> {country}
            </Container>
            <Container>
                <TextContainer>PPL_Lat:</TextContainer> {ppl_lat}
            </Container>
            <Container>
                <TextContainer>PPL_Lon</TextContainer> {ppl_lon}
            </Container>
            <Container>
                <TextContainer>Dist:</TextContainer> {dist} km
            </Container>
        </OuterContainer>
    )   
}

export default HotSpotBody