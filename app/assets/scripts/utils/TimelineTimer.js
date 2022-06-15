import React from 'react';
import styled from 'styled-components';
import {FaPlay, FaPause} from '../../../../node_modules/react-icons/fa'
import Timer from './Timer';

const Input = styled.input`
width:70px;
padding:5px;
`
const Button = styled.button`
display:flex;
align-items:center;
justify-content:center;
text-align:center;
padding:8.5px;
cursor:pointer;
//border-radius:50%;
//box-shadow: 2px 4px 8px rgba(0,0,0,0.2);
//background-color:red;
`

class TimelineTimer extends React.Component {

    constructor (props) {
        super(props);
    
        this.state = {
            value:5,
            playIcon:true,
            intervalId:null,
            countdown:5,
        };

        this.interval = null;
        this.clickPlayHandler = this.clickPlayHandler.bind(this);
        this.clickPauseHandler = this.clickPauseHandler.bind(this);
        this.changeHandler = this.changeHandler.bind(this);
    }

    clickPlayHandler(e){
        if(this.state.value < 5 || this.state.value > 60){
            alert('Value needs to be between the range of 5-60 seconds')
        }else{
            this.interval = setInterval(()=>{
                // if(this.state.countdown === -1){
                //     this.setState({
                //         countdown:this.state.value
                //     })
                // }else{
                //     this.setState({
                //         countdown:countdown - 1
                //     })
                // }
                this.props.nextDate('next-date',this.state.intervalId, this.interval);
            }, this.state.value * 1000)

            this.setState({
                intervalId:this.interval,
                playIcon:false
            })
        }
    }

    clickPauseHandler(e){
        clearInterval(this.state.intervalId)
        clearInterval(this.interval)
        this.setState({
            playIcon:true
        })
    }

    changeHandler(e){
        this.setState({
            value:e.target.value,
            countdown:e.target.value,
        })
    }

    render(){
        return(
            <>
                {!this.state.playIcon && <Timer value={this.state.value}/>}
                <div style={{display:"flex", marginRight:'20px', width:'113px', justifyContent:'space-between'}}>
                    <Input type="number" min="5" max="60" value={this.state.value} onChange={this.changeHandler}/>
                    {this.state.playIcon && <Button onClick={this.clickPlayHandler}><FaPlay/></Button>}
                    {!this.state.playIcon && <Button onClick={this.clickPauseHandler}><FaPause/></Button>}
                </div>
            </>
        )
    }
}

// const TimelineTimer = forwardRef((props, ref) =>{

//     const [value, setValue] = useState(5)
//     const [playIcon, setIcon] = useState(true);
//     const [intervalId, setIntervalId] = useState();
//     var interval;

//     useImperativeHandle(ref, ()=>({
//         clickPauseHandler(e){
//             clearInterval(intervalId)
//             clearInterval(interval)
//             setIcon(true)
//         }
//     }))

//     function changeHandler(e){
//         setValue(e.target.value)
//     }

//     function clickPlayHandler(e){

//         if(value < 5 || value > 60){
//             alert('Value needs to be between the range of 5-60 seconds')
//         }else{
//             console.log(props)
//             interval = setInterval(()=>{
//                 props.nextDate('next-date',intervalId, interval, setIcon);
//             }, value * 1000)
//             setIntervalId(interval)
//             setIcon(false)
//         }
//     }

    
//     return(
//         <div style={{display:"flex", marginRight:'20px', width:'113px', justifyContent:'space-between'}}>
//             <Input type="number" min="5" max="60" value={value} onChange={changeHandler}/>
//             {playIcon && <Button onClick={clickPlayHandler}><FaPlay/></Button>}
//             {!playIcon && <Button><FaPause/></Button>}
//         </div>
//     )
//     // return(
//     //     <div style={{display:"flex", marginRight:'20px', width:'113px', justifyContent:'space-between'}}>
//     //         <Input type="number" min="5" max="60" value={value} onChange={changeHandler}/>
//     //         {playIcon && <Button onClick={clickPlayHandler}><FaPlay/></Button>}
//     //         {!playIcon && <Button onClick={clickPauseHandler}><FaPause/></Button>}
//     //     </div>
//     // )
// })

export default TimelineTimer