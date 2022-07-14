'use strict';
import { combineReducers } from 'redux';

import BASELINE_REDUCER from './reducers/BaselineReducer';

const reducers = combineReducers({
    BASELINE_REDUCER:BASELINE_REDUCER
})

export default reducers