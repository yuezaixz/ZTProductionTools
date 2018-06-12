import * as types from '../../src/constants/ActionTypes';
import PillowManager from '../../src/manager/PillowManager'

export function deviceDisconnect(uuid) {
    return async (dispatch, getState) =>{
        dispatch({type: types.DEVICE_DISCONNECT, uuid: uuid})
        PillowManager
            .ShareInstance()
            .deviceDisconnect(uuid)
            .then(()=>{
                dispatch({type: types.SUCCESS_DEVICE_DISCONNECT, uuid: uuid})
            })
            .catch((error) => {
                dispatch({type: types.FAIL_DEVICE_DISCONNECT, errorMsg: error})
            });
    }



    return {type: types.DEVICE_DISCONNECT}
}

export function startReadVoltage() {
    return async (dispatch, getState) =>{
        PillowManager.ShareInstance().startReadVoltage()
            .then(()=>{
                dispatch({type: types.START_READ_VOLTAGE})
            })
    }
}

export function readVoltage(voltage) {
    return {type: types.READ_VOLTAGE, voltage}
}

/****************板级功能测试****************/
export function startReadFAT(uuid, serviceUUID, writeUUID) {
    return async (dispatch, getState) =>{
        PillowManager.ShareInstance().startReadFAT()
            .then(()=>{
                dispatch({type: types.START_READ_FAT})
            })
    }
}

export function successReadRAT() {
    return {type: types.SUCCESS_READ_FAT}
}

/****************气压校准，读取电流ADC****************/
export function startReadFCP(uuid, serviceUUID, writeUUID) {
    return async (dispatch, getState) =>{
        PillowManager.ShareInstance().startReadFCP()
            .then(()=>{
                dispatch({type: types.START_READ_FCP})
            })
    }
}

export function readFCP(max, min) {
    return {type: types.READ_FCP, max, min}
}

/****************充放气测试****************/
//进入手控模式
export function startManual(uuid, serviceUUID, writeUUID) {
    return async (dispatch, getState) =>{
        PillowManager.ShareInstance().startManual()
            .then(()=>{
                dispatch({type: types.START_MANUAL})
            })
    }
}

export function successStartManual() {
    return {type: types.SUCCESS_START_MANUAL}
}
//退出手控模式
export function stopManual(uuid, serviceUUID, writeUUID) {
    return async (dispatch, getState) =>{
        PillowManager.ShareInstance().stopManual()
            .then(()=>{
                dispatch({type: types.STOP_MANUAL})
            })
    }
}

export function successStopManual() {
    return {type: types.SUCCESS_STOP_MANUAL}
}
//充气
export function startInflate(uuid, serviceUUID, writeUUID) {
    return async (dispatch, getState) =>{
        PillowManager.ShareInstance().startInflate()
            .then(()=>{
                dispatch({type: types.START_INFLATE})
            })
    }
}

export function clearDeviceData() {
    return {type: types.CLEAR_DEVICE_DATA}
}

export function completeInflate() {
    return {type: types.COMPLETE_INFLATE}
}
//放气
export function startFlate(uuid, serviceUUID, writeUUID) {
    return async (dispatch, getState) =>{
        PillowManager.ShareInstance().startFlate()
            .then(()=>{
                dispatch({type: types.START_FLATE})
            })
    }
}

export function completeFlate() {
    return {type: types.COMPLETE_FLATE}
}

/****************传感器校准****************/
//开始校准,进入退出透传模式
export function startAdjustSUB(uuid, serviceUUID, writeUUID) {
    return async (dispatch, getState) =>{
        PillowManager.ShareInstance().startAdjustSUB()
            .then(()=>{
                dispatch({type: types.START_ADJUST_SUB})
            })
    }
}

export function successStartAdjustSUB() {
    return {type: types.SUCCESS_START_ADJUST_SUB}
}

export function stopAdjustSUB(uuid, serviceUUID, writeUUID) {
    return async (dispatch, getState) =>{
        PillowManager.ShareInstance().stopAdjustSUB()
            .then(()=>{
                dispatch({type: types.STOP_ADJUST_SUB})
            })
    }
}

export function successStopAdjustSUB() {
    return {type: types.SUCCESS_STOP_ADJUST_SUB}
}

//开始校准,进入退出校准模式
export function startAdjust(uuid, serviceUUID, writeUUID) {
    return async (dispatch, getState) =>{
        PillowManager.ShareInstance().startAdjust()
            .then(()=>{
                dispatch({type: types.START_ADJUST})
            })
    }
}

export function successStartAdjust() {
    return {type: types.SUCCESS_START_ADJUST}
}

export function stopAdjust(uuid, serviceUUID, writeUUID) {
    return async (dispatch, getState) =>{
        PillowManager.ShareInstance().stopAdjust()
            .then(()=>{
                dispatch({type: types.STOP_ADJUST})
            })
    }
}

export function successStopAdjust() {
    return {type: types.SUCCESS_STOP_ADJUST}
}

export function sensorAdjust(uuid, serviceUUID, writeUUID, index) {
    return async (dispatch, getState) =>{
        PillowManager.ShareInstance().sensorAdjust(index)
            .then(()=>{
                dispatch({type: types.SENSOR_ADJUST})
            })
    }
}

export function successSensorAdjust(index, isSuccess) {
    return {type: types.SUCCESS_SENSOR_ADJUST, index, isSuccess}
}