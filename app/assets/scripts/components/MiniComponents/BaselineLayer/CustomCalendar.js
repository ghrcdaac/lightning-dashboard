import React,{useState} from 'react';
import styled from 'styled-components';
import { getBaselineData } from '../../../data/Baseline/DataIndex';

const ButtonContainer = styled.div`
//position:absolute;
background-color:white;
display:flex;
text-align:center;
flex-wrap:wrap;
justify-content:center;
align-items:center;
max-height:250px;
overflow-y:scroll;

border-top-right-radius:5px;
border-top-left-radius:5px;
border-bottom-right-radius:5px;
border-bottom-left-radius:5px;
`
const Button = styled.div`
box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.5);
margin-bottom: 7px;
margin-top:5px;
margin-right: 7px;
border: 1px solid black;
cursor:pointer;
padding: 2px;
width: 75px;
height: 65px;
text-align:center;
justify-content:center;
align-items:center;
background-color:${(props)=>props.backgroundColor}
`

const CustomCalendar = ({ id, onClick, layer }) =>{

    //const arr = BaselineJSON.Baseline.filter((layer)=> layer.id === id)
    const arr = getBaselineData(layer.baseline[1])
    const [selected, useSelected] = useState({});

    return(
        <ButtonContainer>
            {arr !== null && arr.data.map((data)=>(
                <Button onClick={()=>{onClick(data[0], data, id);useSelected({id:id, date:data[0]})}} key={data[1]} backgroundColor={((id === selected.id) && (data[0] === selected.date) && '#007afc')}>
                    <div style={{display:'flex', flexDirection:'column', textAlign:'center', justifyContent:'center', alignItems:'center'}}>
                        <div>{data[1]}</div>
                        {data.length > 2 && <div>{data[2]}</div>}
                    </div>
                </Button>
            ))}
        </ButtonContainer>
    )
}

export default CustomCalendar