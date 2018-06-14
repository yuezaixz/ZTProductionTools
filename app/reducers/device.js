import * as types from '../constants/ActionTypes';

const initialState = {
    debug: true,
    index: 0,
    processingStr: '搜索中',
    isProcessing: true
}

export default function(state = initialState, action) {
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
        case types.START_READ_VOLTAGE:
            return {...state, isReadingVoltage: true};
        case types.READ_VOLTAGE:
            return {...state, isReadingVoltage: false, voltage: action.voltage};
        /****************板级功能测试****************/
        case types.START_READ_FAT:
            return {...state, isReadingFAT: true};
        case types.SUCCESS_READ_FAT:
            return {...state, isReadingFAT: false, hadFATTest: true};
        /****************气压测试****************/
        case types.START_READ_FCP:
            return {...state, isReadingFCP: true};
        case types.READ_FCP:
            return {...state, isReadingFCP: false, fcpMax: action.max, fcpMin: action.min};
        /****************充放气测试****************/
        case types.START_MANUAL:
            return {...state, isStartingManual: true};
        case types.SUCCESS_START_MANUAL:
            return {...state, isStartingManual: false};
        case types.STOP_MANUAL:
            return {...state, isStopingManual: true, hadInflateTest: true};
        case types.SUCCESS_STOP_MANUAL:
            return {...state, isStopingManual: false};
    }

    return state;
}