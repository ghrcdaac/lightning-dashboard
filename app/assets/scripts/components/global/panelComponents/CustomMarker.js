import React, {useState} from "react";
import ReactMapGL, {Marker, Popup } from 'react-map-gl';

const CustomMarker = ({feature}) => {

    const [Popup, setPopup] = useState(false)
    const popupHandler = (value) =>{
        setPopup(value)
    }

    console.log(feature.lng, feature.lat)
    return (
      <Marker
        longitude={feature.lng}
        latitude={feature.lat}>
        <div className="marker" onClick={() => popupHandler(true)}>
          <span><b>1</b></span>
        </div>
      </Marker>
  )};

  export default CustomMarker