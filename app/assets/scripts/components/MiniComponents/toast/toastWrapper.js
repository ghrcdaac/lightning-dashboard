import React, {useState, useRef, useEffect} from "react";
import styled, { withTheme, ThemeProvider } from 'styled-components';
import {toast, ToastContainer} from 'react-toastify';
import { css } from 'glamor'

const Container = styled.div`
// color: white;
position: absolute;
right: 50;
top: 50;
width: 300px;
height: 300px;
// background: red;
`
const containerStyle = css({
    position: "relative"
});

var Swal = require('sweetalert2')

const ToastWrapper = ({ top, bottom, left, right, text }) =>{
    toast.configure()
    const toastHandler = () =>{
        toast("Hey, Welcome to Lightning Dashboard.", {
            position: "top-center",
            autoClose: 1800,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        })
        setTimeout(()=>{
            toast("Select one of the datasets from the bottom.", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            })
        }, 3000)
    }
    return(
        <Container>
            <button onClick={toastHandler}>Notify!</button>
            <ToastContainer/>
        </Container>
    )
}

export default ToastWrapper