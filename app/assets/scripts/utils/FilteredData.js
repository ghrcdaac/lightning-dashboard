var arr = ['https://i0.wp.com/www.cbs42.com/wp-content/uploads/sites/81/2019/08/Storm.jpg?w=2000&ssl=1',
'https://static.stacker.com/s3fs-public/styles/sar_screen_maximum_large/s3/2022-03/severe-weather.png',
'https://i0.wp.com/alabamanewscenter.com/wp-content/uploads/2019/02/Lightning-Feature.jpg?fit=640%2C360&ssl=1',
'https://discovery.sndimg.com/content/dam/images/discovery/editorial/Curiosity/2020/2/18/GettyImages-John-B-Mueller-Photography-117960753.jpg.rend.hgtvcom.406.406.suffix/1582846241624.jpeg',
'https://www.cbs42.com/wp-content/uploads/sites/81/2017/07/cullman-co-lightning-e1500923334525_29520440_ver1.0.jpg?w=1280',
'https://s-media-cache-ak0.pinimg.com/736x/4b/5f/d7/4b5fd7b3d46755e7a0c60a4f27187739.jpg',
'https://i.natgeofe.com/n/0d00dd65-ca95-4e41-bc5f-639ccca147ba/270.jpg?w=636&h=477',
'https://indiaclimatedialogue.net/wp-content/uploads/2017/09/Lightning1.jpg',
'https://i.redd.it/m8mdw4mxfsoz.jpg',
'https://ghrc.nsstc.nasa.gov/lightning/images/data/data_nalma.png',
'https://s3-ap-southeast-1.amazonaws.com/assets-powerstores-com/data/org/19721/media/img/source/edit/1961037_edit.jpg',
'https://i.pinimg.com/originals/00/30/c1/0030c180e2d07e8f76d466463d76158d.jpg'
]

export const Background = (background) =>{
    const newData = []

    if(background !== ''){
        newData.push(background)
    }

    for(var i = 0;i<arr.length;i++){
        if(arr[i] !== background){
            newData.push(arr[i]);
        }
    }
    return newData
}