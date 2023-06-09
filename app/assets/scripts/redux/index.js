'use strict';
import { combineReducers } from 'redux';

import BASELINE_REDUCER from './reducers/BaselineReducer';
import HOTSPOT_REDUCER from './reducers/HotspotReducer';
import METADATA_REDUCER from './reducers/MetadataReducer';

const reducers = combineReducers({
    BASELINE_REDUCER:BASELINE_REDUCER,
    HOTSPOT_REDUCER:HOTSPOT_REDUCER,
    METADATA_REDUCER:METADATA_REDUCER,
})

export default reducers