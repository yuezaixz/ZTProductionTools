import * as types from '../constants/ActionTypes';

const initialState = {
    isSearching: false,
    isConnecting: false,
    connecting_uuid:'',
    serviceUUID: '',
    noitfyUUID: '',
    writeUUID: '',
    failConnectedMsg: '',
    //测试数据
    // device_list: [{name:'Test1',uuid:'aaaa',rssi:-34},{name:'Test2',uuid:'bbbb',rssi:-48}]
    device_list: []
}

export default function home(state = initialState, action) {
    switch(action.type) {
        case types.START_SEARCH_DEVICE:
            var temp = {...state, isSearching: true};
            return temp;
        case types.STOP_SEARCH_DEVICE:
            return {...state, isSearching: false, device_list: []};
        case types.START_DEVICE_CONNECT:
            return {...state, failConnectedMsg: "", isConnecting: true, connecting_uuid: action.uuid, successDisconnect:true};
        case types.SUCCESS_DEVICE_CONNECT:
            return {...state, isConnecting: false, connecting_uuid:'', name: action.name, uuid: action.uuid, serviceUUID: action.serviceUUID, noitfyUUID: action.noitfyUUID, writeUUID: action.writeUUID};
        case types.FAIL_DEVICE_CONNECT:
            return {...state, isConnecting: false, connecting_uuid:'', failConnectedMsg: action.errorMsg};
        case types.UPDATE_DEVICE_LIST:
            return {...state, device_list: [...action.devices]};
        case types.SUCCESS_DEVICE_DISCONNECT:
            return {...state, successDisconnect:true}
        case types.DEVICE_DISCONNECT:
            return {...state, uuid: "", serviceUUID: "", noitfyUUID: "", writeUUID: "", voltage:"", fcpMax: "", fcpMin: "",
                completeSensorIndex:null,errorSensorIndex:null, hadInflateTest: false, hadFATTest: false, hadAdjust: false};
    }

    return state;
}