import React, {useState, useRef, useEffect} from "react";
import styled, { withTheme, ThemeProvider } from 'styled-components';
import {toast, ToastContainer} from 'react-toastify';
import { css } from 'glamor'

const Container = styled.div`
position: absolute;
top:5000;
left: 500;
height:auto;
width:auto;
`
const containerStyle = css({
    position: "relative"
});

const ToastWrapper = ({ top, bottom, left, right, text }) =>{
    toast.configure()
    const toastHandler = () =>{
        toast("helllllllloo")
    }
    return(
        <Container>
            <button onClick={toastHandler}>Notify!</button>
            <ToastContainer className={containerStyle} />
            <ToastContainer
        className={containerStyle}
        position="top-center"
        autoClose={10000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
        </Container>
    )
}

export default ToastWrapper