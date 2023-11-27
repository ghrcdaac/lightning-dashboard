import React,{useState} from 'react';
import styled, { withTheme, ThemeProvider } from 'styled-components';
import { IoIosInformationCircleOutline } from "../../../../../../node_modules/react-icons/io";
import { IoMdClose } from "../../../../../../node_modules/react-icons/io";
import Modal from 'react-modal';
import LayerInformation from "../../../data/layer_info.json"

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
display:"flex";
justify-content:"center";
align-items:center;
`

const TextIconWrapper = styled.div`
display:flex;
width:100%;
height:35%;
text-align:center;
justify-content:center;
align-items:center;
font-weight: bold;
font-size: 12px;
`
const ModalTitle = styled.div`
display:flex;
align-items:center;
justify-content:center;
`

const LayerCard = ({ layer, clicked, activeLayer }) =>{
   
  const [modalIsOpen, setModal] = useState(false);

  const infoClickHandler = () =>{
    setModal(true)
  }

  const closeHandler = () =>{
    setModal(false)
  }

  const customStyles = {
    content: {
      top: '30%',
      left: '40%',
      height:"35%",
      width:"35%"
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
            <IoIosInformationCircleOutline size={20}/>
          </InfoButtonWrapper>
        </TextIconWrapper>
        <Modal
        isOpen={modalIsOpen}
        style={customStyles}
        contentLabel="Example Modal"
        >
          <ModalTitle>
            <h2 style={{width:"90%", textAlign:'center'}}>TRMM LIS FULL</h2>
            <div onClick={closeHandler} style={{cursor:'pointer'}}>
              <IoMdClose size={25} />
            </div>
          </ModalTitle>
          <div>

          </div>
        </Modal>
      </Container>
  )
}

export default LayerCard