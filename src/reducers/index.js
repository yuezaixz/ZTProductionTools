import { combineReducers } from 'redux';
import home from './home';
import device from './device';
import global from './global';

const rootReducer = combineReducers({
    home, device, global
});

export default rootReducer;