import { 
    BASELINE_DATE_F,
    BASELINE_DATE_I,
    BASELINE_ID,
    BASELINE_RESET,
    CALENDAR_ACTIVE,
    CALENDAR_ICON
} from "../constants/BaselineConstants"

const InitState = {
    BASELINE_ID:"Datasets",
    PREV_BASELINE_ID:null,
    BASELINE_DATE_F:null,
    BASELINE_DATE_I:null,
    CALENDAR_ACTIVE:false,
    CALENDAR_ICON:false,
}

const BASELINE_REDUCER = (state = InitState, action) =>{
    if(action.type === BASELINE_ID){
        return{
            ...state,
            PREV_BASELINE_ID:state.BASELINE_ID,
            BASELINE_ID:action.payload,
        }
    }else if(action.type === BASELINE_DATE_F){
        return{
            ...state,
            BASELINE_DATE_F:action.payload,
        }
    }else if(action.type === BASELINE_DATE_I){
        return{
            ...state,
            BASELINE_DATE_I:action.payload,
        }
    }else if(action.type === CALENDAR_ICON){
        return{
            ...state,
            CALENDAR_ICON:action.payload,
        }
    }else if(action.type === CALENDAR_ACTIVE){
        return{
            ...state,
            CALENDAR_ACTIVE:!state.CALENDAR_ACTIVE,
        }
    }else if(action.type === BASELINE_RESET){
        return InitState
    }else{
        return state
    }
}

export default BASELINE_REDUCER