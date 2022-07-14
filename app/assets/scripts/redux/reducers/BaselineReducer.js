const InitState = {
    BASELINE_ID:null,
    BASELINE_DATE:null
}

const BASELINE_REDUCER = (state = InitState, action) =>{
    if(action.type === 'BASELINE_ID'){
        return{
            BASELINE_ID:action.payload, 
            BASELINE_DATE:state.BASELINE_DATE
        }
    }else if(action.type === 'BASELINE_DATE'){
        return{
            BASELINE_ID:state.BASELINE_ID, 
            BASELINE_DATE:action.payload
        }
    }else if(action.type === 'BASELINE_RESET'){
        return{
            BASELINE_ID:null, 
            BASELINE_DATE:null
        }
    }else{
        return state
    }
}

export default BASELINE_REDUCER