import React, {useState, useEffect} from "react";

const Timer = ({value}) =>{

    const [countdown, setCount] = useState(value - 1)
    const [change, setChange] = useState(10)
    var timer, timer2;

    useEffect(()=>{
        // timer2 = setInterval(()=>{
        //     setCount(value)
        //     clearInterval(timer)
        // }, 5000)
        timer = setInterval(()=>{
            if(value % countdown === 0){
                console.log("im in modulo")
                setCount(value)
            }else{
                console.log("im outside moduleo")
                setCount(countdown - 1)
            }
        },1000)
        
        return ()=>clearInterval(timer)
    })

    return(
        <div style={{marginRight:'15px', fontSize:'20px', fontWeight:'bold'}}>Timer: {countdown}</div>
    )
}

export default Timer