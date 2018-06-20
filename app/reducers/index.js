import { combineReducers } from 'redux';
import device from './device';
import global from './global';

const rootReducer = combineReducers({
    device, global
});

export default rootReducer;