import * as types from '../constants/ActionTypes';

const initialState = {
    debug: true,
    index: 0,
    processingStr: 'Searching',
    isProcessing: true,
    isSearching: true,
    poseCode:0,
    flatCode:0,
    onlyStrong: true
}

export default function(state = initialState, action) {
    switch(action.type) {
        case types.START_SEARCH_DEVICE:
            var temp = {...state, isSearching: true, isProcessing: true, processingStr:'Searching'};
            return temp;
        case types.STOP_SEARCH_DEVICE:
            return {...state, isSearching: false, isProcessing: false, device_list: []};
        case types.START_DEVICE_CONNECT:
            return {...state, 
                failConnectedMsg: "", 
                isConnecting: true, 
                isProcessing: true, 
                processingStr:'Connecting', 
                connecting_uuid: action.uuid
            };
        case types.SUCCESS_DEVICE_CONNECT:
            return {...state, 
                isConnecting: false, 
                connecting_uuid:'', 
                name: action.name, 
                isProcessing: false, 
                processingStr:'Connected', 
                uuid: action.uuid,
                poseCode:0,
                flatCode:0,
                serviceUUID: action.serviceUUID, 
                noitfyUUID: action.noitfyUUID, 
                writeUUID: action.writeUUID
            };
        case types.FAIL_DEVICE_CONNECT:
            return {...state, 
                isConnecting: false, 
                isProcessing: false, 
                processingStr:'Connected failed', 
                connecting_uuid:'', 
                failConnectedMsg: action.errorMsg
            };
        case types.UPDATE_DEVICE_LIST:
            return {...state, device_list: [...action.devices], strongDevice:action.strongDevice};
        case types.SUCCESS_DEVICE_DISCONNECT:
            return {...state, successDisconnect:true}
        case types.ONLY_STRONG:
            return {...state, onlyStrong:action.onlyStrong}
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
            let isProcessing = action.flatCode > 0
            let processingStr = [null, 'Inflating', 'Deflating'][action.flatCode] || ['No use', 'Back Sleeping', 'Side Sleeping'][action.poseCode]
            return {...state, pillowStatus, poseCode:action.poseCode, flatCode:action.flatCode , isProcessing, processingStr};
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