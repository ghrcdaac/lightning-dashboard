import React,{useState} from 'react';
import styled, { withTheme, ThemeProvider } from 'styled-components';
import { IoIosInformationCircleOutline } from "../../../../../../node_modules/react-icons/io";
import Modal from 'react-modal';
// import LayerInformation from ""

Modal.setAppElement('#app-container');

const Container = styled.div`
width: 151px;
min-width: 151px;
display: flex;
flex-direction: column;
border-radius: 6px;
height: 101px;
margin-right:40px;
color:white;
&:hover,
&:focus {
  /* Blue glow effect on hover or focus */
  box-shadow: 2px 2px 10px #0036B1;
//   border: 3px solid #0036B1;
  background-color: rgba(29, 161, 242, 1);
  cursor:pointer;
}
background-color: ${props => props.isActive ? 'rgba(29, 161, 242, 1)' : '#373943'}
`
const ImageContainer = styled.div`
width:100%;
height:65%;
// background-image: url('https://www.distancecme.com/wp-content/uploads/2018/05/Lightening-scaled.jpg'); /* Replace with your image URL */
background-image: url('${(props)=>props.link}');
background-size: cover;
background-position: center;
border-radius: 4px 4px 0px 0px;
border:0px;
background-color:black;
`
const TextContainer = styled.div`
width:100%;
height:35%;
text-align:center;
justify-content:center;
align-items:center;
display:flex;
font-weight: bold;
font-size: 12px;
`
const InfoButtonWrapper = styled.div`
background-color:red;
`

const TextIconWrapper = styled.div`
display:flex;
width:100%;
height:35%;
// text-align:center;
justify-content:space-around;
align-items:center;
font-weight: bold;
font-size: 12px;
`

const LayerCard = ({ layer, clicked, activeLayer }) =>{
   
  const [modalIsOpen, setModal] = useState(false);

  const infoClickHandler = () =>{
    setModal(!modalIsOpen)
  }

  const customStyles = {
    content: {
      top: '35%',
      left: '45%',
      height:"25%",
      width:"25%"
    },
  };

  return (
      <Container isActive={activeLayer[0] === layer.name}>
        <ImageContainer link={layer.image} onClick={()=>clicked(layer)}/>
        <TextIconWrapper>
          <TextContainer onClick={()=>clicked(layer)}>
              {layer.name}
          </TextContainer>
          <InfoButtonWrapper onClick={infoClickHandler}>
            <IoIosInformationCircleOutline size={25}/>
          </InfoButtonWrapper>
        </TextIconWrapper>
        <Modal
        isOpen={modalIsOpen}
        style={customStyles}
        contentLabel="Example Modal"
        >
          <h2 style={{textAlign:'center'}}>TRMM LIS FULL</h2>
        </Modal>
      </Container>
  )
}

export default LayerCard