import React, {useState, useRef, useEffect} from "react";
import styled, { withTheme, ThemeProvider } from 'styled-components';
import {toast} from 'react-toastify';

const Container = styled.div`
position: absolute;
top:500;
height:auto;
width:auto;
`

const toastWrapper = ({ top, bottom, left, right, text }) =>{
    toast.configure()
    return(
        <Container>
            {
                toast.info('Hey, Welcome to Lightning Dashboard', {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                })
            }
        </Container>
    )
}

export default toastWrapper