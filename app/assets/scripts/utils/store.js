'use strict';
import { createStore} from 'redux';

import reducers from '../redux';

const initialState = {};

const store = createStore(
  reducers,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
