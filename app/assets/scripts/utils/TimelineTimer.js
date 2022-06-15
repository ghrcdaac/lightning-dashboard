import React from 'react';
import styled from 'styled-components';
import {FaPlay, FaPause} from '../../../../node_modules/react-icons/fa'

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

const TimerLabel = styled.span`
position: absolute;
  
/* Size should match the parent container */
width: 37px;
height: 37px;

/* Keep the label aligned to the top */
top: 0;

/* Create a flexible box that centers content vertically and horizontally */
display: flex;
align-items: center;
justify-content: center;

/* Sort of an arbitrary number; adjust to your liking */
font-size: 15px;
font-weight:bold;
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
        this.intervalTop = null;
        this.clickPlayHandler = this.clickPlayHandler.bind(this);
        this.clickPauseHandler = this.clickPauseHandler.bind(this);
        this.changeHandler = this.changeHandler.bind(this);
    }

    clickPlayHandler(e){
        if(this.state.value < 5 || this.state.value > 60){
            alert('Value needs to be between the range of 5-60 seconds')
        }else{
            this.interval = setInterval(()=>{
                this.props.nextDate('next-date',this.state.intervalId, this.interval);
            }, this.state.value * 1000)

            this.interval2 = setInterval(()=>{
                if(this.state.countdown - 1 === 0){
                    this.setState({
                        countdown:this.state.value
                    })
                }else{
                    this.setState({
                        countdown:this.state.countdown - 1
                    })
                }
            }, 1000)
            this.setState({
                intervalId:this.interval,
                playIcon:false
            })
        }
    }

    clickPauseHandler(e){
        clearInterval(this.state.intervalId)
        clearInterval(this.interval)
        clearInterval(this.interval2)
        this.setState({
            playIcon:true,
            countdown:this.state.value,
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
                {/* {!this.state.playIcon && <div style={{marginRight:'15px', fontSize:'20px', fontWeight:'bold'}}>Countdown: {this.state.countdown}</div>} */}
                {!this.state.playIcon && <div class="base-timer" style={{position:'relative', height:'37px', width:'37px'}}>
                    <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                        <g class="base-timer__circle" style={{fill:'none', stroke:'none'}}>
                        <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45" style={{strokeWidth:'10px', stroke:'green'}}/>
                        </g>
                    </svg>
                    <TimerLabel>{this.state.countdown}</TimerLabel>
                </div>}
                <div style={{display:"flex", marginRight:'20px', width:'113px', justifyContent:'space-between'}}>
                    {this.state.playIcon && <Input type="number" min="5" max="60" value={this.state.value} onChange={this.changeHandler}/>}
                    {this.state.playIcon && <Button onClick={this.clickPlayHandler}><FaPlay/></Button>}
                    {!this.state.playIcon && <Input type="number" min="5" max="60" value={this.state.value} onChange={this.changeHandler} disabled/>}
                    {!this.state.playIcon && <Button onClick={this.clickPauseHandler}><FaPause/></Button>}
                </div>
            </>
        )
    }
}

export default TimelineTimer