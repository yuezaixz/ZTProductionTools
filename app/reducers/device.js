import * as types from '../constants/ActionTypes';

const initialState = {
    debug: true,
    index: 0,
    processingStr: '搜索中',
    isProcessing: true,
    isSearching: true,
}

export default function(state = initialState, action) {
    switch(action.type) {
        case types.START_SEARCH_DEVICE:
            var temp = {...state, isSearching: true, isProcessing: true, processingStr:'搜索中'};
            return temp;
        case types.STOP_SEARCH_DEVICE:
            return {...state, isSearching: false, isProcessing: false, device_list: []};
        case types.START_DEVICE_CONNECT:
            return {...state, 
                failConnectedMsg: "", 
                isConnecting: true, 
                isProcessing: true, 
                processingStr:'连接中', 
                connecting_uuid: action.uuid
            };
        case types.SUCCESS_DEVICE_CONNECT:
            return {...state, 
                isConnecting: false, 
                connecting_uuid:'', 
                name: action.name, 
                isProcessing: false, 
                processingStr:'已连接', 
                uuid: action.uuid, 
                serviceUUID: action.serviceUUID, 
                noitfyUUID: action.noitfyUUID, 
                writeUUID: action.writeUUID
            };
        case types.FAIL_DEVICE_CONNECT:
            return {...state, 
                isConnecting: false, 
                isProcessing: false, 
                processingStr:'连接失败', 
                connecting_uuid:'', 
                failConnectedMsg: action.errorMsg
            };
        case types.UPDATE_DEVICE_LIST:
            return {...state, device_list: [...action.devices]};
        case types.SUCCESS_DEVICE_DISCONNECT:
            return {...state, successDisconnect:true}
        case types.DEVICE_DISCONNECT:
            return {...state, 
                uuid: "", 
                serviceUUID: "", 
                noitfyUUID: "", 
                writeUUID: "", 
                voltage:""
            };
        case types.START_READ_VOLTAGE:
            return {...state, isReadingVoltage: true};
        case types.READ_VOLTAGE:
            return {...state, isReadingVoltage: false, ...action.data};
        case types.READ_VERSION:
            return {...state, ...action.data};
        case types.READ_MACADDRESS:
            return {...state, madAddress: action.macAddress};
        case types.READ_SLEEPDATA:
            return {...state, ...action.data};
        case types.READ_SLEEPSTATUS:
        {
            let pillowStatus = action.status
            let isFlating = pillowStatus > 2
            let isSlide = pillowStatus == 2 ? true : (pillowStatus == 1 ? false : state.isSlide)
            let isProcessing = pillowStatus > 2
            let isDown = pillowStatus == 4
            let processingStr = ['请点击', '请点击', '请点击', '充气中', '放气中'][pillowStatus]
            return {...state, pillowStatus, isSlide, isFlating ,isProcessing, processingStr, isDown};
        }
        case types.READ_LOG:
            return {...state, logList: action.logList};
        case types.CLEAR_LOG:
            return {...state, logList: []};

        /****************充放气测试****************/
        case types.START_MANUAL:
            return {...state, isStartingManual: true};
        case types.SUCCESS_START_MANUAL:
            return {...state, isStartingManual: false};
        case types.STOP_MANUAL:
            return {...state, isStopingManual: true, hadInflateTest: true};
        case types.SUCCESS_STOP_MANUAL:
            return {...state, isStopingManual: false};
        case types.REINIT_APP:
            return {...initialState}
    }

    return state;
}