import * as types from '../constants/ActionTypes';

const initialState = {

}

export default function(state = {index: 0}, action) {
    switch(action.type) {
        case types.DEVICE_DISCONNECT:
            return {...state, uuid: "", serviceUUID: "", noitfyUUID: "", writeUUID: ""};
        case types.START_READ_VOLTAGE:
            return {...state, isReadingVoltage: true};
        case types.READ_VOLTAGE:
            return {...state, isReadingVoltage: false};
        case types.START_CHECK_VOLTAGE:
            return {...state};
    }

    return state;
}