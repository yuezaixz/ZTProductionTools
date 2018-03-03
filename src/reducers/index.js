import { combineReducers } from 'redux';
import home from './home';
import device from './device';

const rootReducer = combineReducers({
    home, device
});

export default rootReducer;
