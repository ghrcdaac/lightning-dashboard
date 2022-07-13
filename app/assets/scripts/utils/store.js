'use strict';
import { createStore} from 'redux';

import reducer from '../redux';

const initialState = {};

const store = createStore(
  reducer,
  initialState,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
