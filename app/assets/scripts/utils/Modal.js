import React,{useState} from 'react';
import styled, { withTheme, ThemeProvider } from 'styled-components';
import ReactDOM from 'react-dom'
import {Background} from './FilteredData'
import ReactPlayer from 'react-player';
// import ArrowRightIcon from '@mui/icons-material/ArrowRight';

const ModalBackground = styled.div`
width: 95vw;
height: 95vh;
background-color: rgba(200, 200, 200,0.6);
position: relative;
display: flex;
justify-content: center;
align-items: center;
z-index:999999;
bottom:100vh;
border-radius: 12px;
`
const Button = styled.button`
position:absolute;
z-index:10000;
top:1rem;
right:1rem;
padding:5px;
cursor:pointer;
background-color: Transparent;
background-repeat:no-repeat;
border: none;
font-weight:bold;
`
const Backward = styled.button`
position:absolute;
z-index:10000;
top:45%;
left:1rem;
padding:5px;
cursor:pointer;
//border-radius:50%;
padding:30px;
height:50px;
width:50px;
font-weight:bold;
border:1px solid;
font-size: 40px;

background-color: Transparent;
background-repeat:no-repeat;
border: none;
// font-weight:bold;
`
const Forward = styled.button`
position:absolute;
z-index:10000;
top:45%;
right:1rem;
padding:5px;
cursor:pointer;
//border-radius:50%;
padding:30px;
height:50px;
width:50px;
font-weight:bold;
border:1px solid;
font-size: 40px;

background-color: Transparent;
background-repeat:no-repeat;
border: none;
// font-weight:bold;
`

const ImageContainer = styled.div`
background-image:url(${(props)=>props.background})
// background-repeat: no-repeat;
`

const Modal = (props) =>{

    const [index, setIndex] = useState(0)
    const BackgroundData = Background(props.background)

    const backwardHandler = () =>{
        if(index === 0){
            setIndex(BackgroundData.length - 1)
        }else{
            setIndex(index - 1)
        }
    }
    const forwardHandler = () =>{
        if(index === BackgroundData.length - 1){
            setIndex(0)
        }else{
            setIndex(index + 1)
        }
    }

    return ReactDOM.createPortal(
        <>
            <ModalBackground>
                <Button onClick={()=>props.onClick()}>
                    &#9587;
                </Button>
                <div style={{backgroundImage:'url('+BackgroundData[index]+')', backgroundRepeat:'no-repeat', borderRadius:'15px', justifyContent:'center', alignItems:'center', maxHeight:'100%', maxWidth:'100%'}}>
                    <img src={BackgroundData[index]} style={{visibility:'hidden', maxHeight:'100%', maxWidth:'100%'}}/>
                </div>
                <Backward onClick={backwardHandler}>&#8249;</Backward>
                <Forward onClick={forwardHandler}>&#8250;</Forward>
            </ModalBackground>        
        </>
        ,document.getElementById('portal')
    )

    // return ReactDOM.createPortal(
    //     <>
    //         <ModalBackground>
    //             <Button onClick={()=>props.onClick()}>
    //                 &#9587;
    //             </Button>
    //             <div style={{justifyContent:'center', alignItems:'center', maxHeight:'100%', maxWidth:'100%'}}>
    //                 {/* <img src={BackgroundData[index]} style={{visibility:'hidden', maxHeight:'100%', maxWidth:'100%'}}/> */}
    //                 {/* <video src='https://www.youtube.com/watch?v=V3-Ex0WOrI8' type="video/mp4" controls/> */}
    //                 <ReactPlayer url="https://www.youtube.com/watch?v=7sDY4m8KNLc" controls />
    //             </div>
    //             <Backward onClick={backwardHandler}>&#8249;</Backward>
    //             <Forward onClick={forwardHandler}>&#8250;</Forward>
    //         </ModalBackground>        
    //     </>
    //     ,document.getElementById('portal')
    // )
}

export default Modal
