import React, {useEffect} from "react"

const Download = (data) =>{

    //const data = `name, email, twitter, tyler`

    const blob = new Blob([JSON.stringify(data)], {type:'octet-stream'});

    const href = URL.createObjectURL(blob);

    const a = Object.assign(document.createElement('a'),{
        href,
        style:'display:none',
        download:'mydata.json'
    })
    document.body.appendChild(a)

    a.click();
    URL.revokeObjectURL(href);
    a.remove();
}

export default Download