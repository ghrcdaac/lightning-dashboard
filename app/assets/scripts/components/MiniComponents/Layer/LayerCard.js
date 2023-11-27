import React,{useEffect, useState} from 'react';
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
width:80%;
height:35%;
text-align:center;
justify-content:center;
align-items:center;
display:flex;
font-weight: bold;
font-size: 12px;
`
const InfoButtonWrapper = styled.div`
display:flex;
justify-content:center;
align-items:center;
height:100%:
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
margin-bottom:10px;
`

const InfoWrapper = styled.div`
display:flex;
width:100%
margin-bottom:200px;
`
const InfoTitle = styled.h5`
width:20%;
`
const InfoText = styled.p`
width:80%;
`
const CloseModal = styled.div`
cursor:pointer;
display:flex;
justify-content:center;
align-items:center;
border-radius:5px;
:hover {
  background-color:rgb(0,0,0,0.1);
}
`

const LayerCard = ({ layer, clicked, activeLayer }) =>{
   
  const [modalIsOpen, setModal] = useState(false);
  const [info, setInfo] = useState()

  const infoClickHandler = () =>{
    setModal(true)
  }

  const closeHandler = () =>{
    setModal(false)
  }

  const customStyles = {
    content: {
      top: '20%',
      left: '30%',
      height: '45%',
      width: '45%',
      overflowY: 'auto', // Enable vertical scrolling
      WebkitOverflowScrolling: 'touch', // Enable smooth scrolling on iOS devices
      scrollbarWidth: 'thin', // Set the width of the scrollbar
      scrollbarColor: '#4d4d4d #e0e0e0', // Set the color of the scrollbar
    },
  };
  

  useEffect(()=>{
    const data = LayerInformation.filter((dataLayer)=>dataLayer.id === layer.id)
    setInfo(data[0])
  }, [layer])


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
        {modalIsOpen &&
        <Modal
        isOpen={modalIsOpen}
        style={customStyles}
        contentLabel="Example Modal"
        >
          <ModalTitle>
            <h2 style={{width:"90%", textAlign:'center'}}>{info.id}</h2>
            <CloseModal onClick={closeHandler}>
              <IoMdClose size={25} />
            </CloseModal>
          </ModalTitle>
          <div style={{width:"100%"}}>
            <InfoWrapper>
              <InfoTitle>Full Name:</InfoTitle>
              <InfoText>{info.title}</InfoText>
            </InfoWrapper>
            <InfoWrapper>
              <InfoTitle>Short Name:</InfoTitle>
              <InfoText>{info.shortname}</InfoText>
            </InfoWrapper>
            <InfoWrapper>
              <InfoTitle>Platforms:</InfoTitle>
              <InfoText>{info.overview.platforms}</InfoText>
            </InfoWrapper>
            <InfoWrapper>
              <InfoTitle>Instruments:</InfoTitle>
              <InfoText>{info.overview.instruments}</InfoText>
            </InfoWrapper>
            <InfoWrapper>
              <InfoTitle>Data Formats:</InfoTitle>
              <InfoText>{info.overview.data_formats}</InfoText>
            </InfoWrapper>
            <InfoWrapper>
              <InfoTitle>Data Centers:</InfoTitle>
              <InfoText>{info.overview.data_centers}</InfoText>
            </InfoWrapper>
            <InfoWrapper>
              <InfoTitle>Temporal Extent:</InfoTitle>
              <InfoText>{info.overview.temporal_extent}</InfoText>
            </InfoWrapper>
            <InfoWrapper>
              <InfoTitle>Spatial Extent:</InfoTitle>
              <InfoText>{info.overview.spatial_extent}</InfoText>
            </InfoWrapper>
            <InfoWrapper>
              <InfoTitle>Description:</InfoTitle>
              <InfoText>{info.description}</InfoText>
            </InfoWrapper>
          </div>
        </Modal>}
      </Container>
  )
}

export default LayerCard