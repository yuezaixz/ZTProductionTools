import * as types from '../constants/ActionTypes';

const initialState = {

}

export default function(state = {index: 0}, action) {
    switch(action.type) {
        case types.START_READ_VOLTAGE:
            return {...state, isReadingVoltage: true};
        case types.READ_VOLTAGE:
            return {...state, isReadingVoltage: false, voltage: action.voltage};
        /****************次数读取****************/
        case types.START_READ_INFLATE_TIME:
            return {...state, isReadingInflatTime: true};
        case types.READ_INFLATE_TIME:
            return {...state, isReadingInflatTime: false, inflateTime: action.inflateTime};
        /****************老化测试相关功能****************/

        case types.SEND_OTHER_COMMAND:
            return {...state};
        case types.SUCCESS_OTHER_COMMAND:
            return {...state};
        case types.SWITCH_TO_OLD:
            return {...state, isOld: true};
        case types.SWITCH_TO_OLD_FOR_STOP:
            return {...state, isStopOld: true};
        case types.SUCCESS_STOP_OLD_TEST:
            return {...state, isStopOld: false};
        case types.SWITCH_TO_INFLATE:
            return {...state, isOld: false};
        
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
        case types.START_INFLATE:
            return {...state, isInflate: true};
        case types.COMPLETE_INFLATE:
            return {...state, isInflate: false};
        case types.START_FLATE:
            return {...state, isFlate: true};
        case types.COMPLETE_FLATE:
            return {...state, isFlate: false};
        /****************传感器校准****************/
        //开始校准,进入退出透传模式
        case types.START_ADJUST_SUB:
            return {...state, isStartAdjustSUB: true};
        case types.SUCCESS_START_ADJUST_SUB:
            return {...state, isStartAdjustSUB: false};
        case types.STOP_ADJUST_SUB:
            return {...state, isStopAdjustSUB: true};
        case types.SUCCESS_STOP_ADJUST_SUB:
            return {...state, isStopAdjustSUB: false};
        //开始校准,进入退出校准模式
        case types.START_ADJUST:
            return {...state, isStartAdjust: true};
        case types.SUCCESS_START_ADJUST:
            return {...state, isStartAdjust: false};
        case types.STOP_ADJUST:
            return {...state, isStopAdjust: true};
        case types.SUCCESS_STOP_ADJUST:
            return {...state, isStopAdjust: false, hadAdjust: true};
        //校准传感器
        case types.SENSOR_ADJUST:
            return {...state, isSensorAdjust: true};
        case types.SUCCESS_SENSOR_ADJUST:
            // new Set(Array.from(a).filter((item)=>{return item!=2}))
            return {...state, isSensorAdjust: false,
                completeSensorIndex:action.isSuccess? new Set([...(state.completeSensorIndex || []), action.index]):new Set(Array.from(state.completeSensorIndex || []).filter((item)=>{return item != action.index})),
                errorSensorIndex:!action.isSuccess? new Set([...(state.errorSensorIndex || []), action.index]):new Set(Array.from(state.errorSensorIndex || []).filter((item)=>{return item != action.index}))};
        case types.CLEAR_DEVICE_DATA:
            return {...state, hadAdjust: false, hadInflateTest: false, fcpMax: 0, fcpMin: 0, hadFATTest: false, voltage: 0, completeSensorIndex:new Set([]), errorSensorIndex:new Set([])}
    }

    return state;
}