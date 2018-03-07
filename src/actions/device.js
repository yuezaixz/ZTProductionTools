import * as types from '../constants/ActionTypes';
import {
    NativeAppEventEmitter,
    NativeEventEmitter,
    NativeModules,
} from 'react-native';
import BleManager from 'react-native-ble-manager';

function writeData(uuid, serviceUUID, writeUUID, successType, command, func) {
    BleManager.write(uuid, serviceUUID, writeUUID, command)
        .then(() => {
            //todo 写入成功
            if (func) {
                func()
            }
        })
        .catch((error) => {
            //todo 写入失败
            console.log(error);
        });

    return {type: successType}
}

import { stringToBytes } from 'convert-string';

export function deviceDisconnect(uuid) {
    return async (dispatch, getState) =>{
        dispatch({type: types.DEVICE_DISCONNECT, uuid: uuid})
        BleManager.disconnect(uuid)
            .then(() => {
                dispatch({type: types.SUCCESS_DEVICE_CONNECT, uuid: uuid})
            })
            .catch((error) => {
                dispatch({type: types.FAIL_DEVICE_DISCONNECT, errorMsg: error})
            });

    }



    return {type: types.DEVICE_DISCONNECT}
}

export function startReadVoltage(uuid, serviceUUID, writeUUID) {
    const data = stringToBytes('GHV');

    return writeData(uuid, serviceUUID, writeUUID, types.START_READ_VOLTAGE, data);
}

export function readVoltage(voltage) {
    return {type: types.READ_VOLTAGE, voltage}
}

/****************板级功能测试****************/
export function startReadFAT(uuid, serviceUUID, writeUUID) {
    const data = stringToBytes('FAT');

    return writeData(uuid, serviceUUID, writeUUID, types.START_READ_FAT, data);
}

export function successReadRAT() {
    return {type: types.SUCCESS_READ_FAT}
}

/****************气压校准，读取电流ADC****************/
export function startReadFCP(uuid, serviceUUID, writeUUID) {
    const data = stringToBytes('FCP');

    return writeData(uuid, serviceUUID, writeUUID, types.START_READ_FCP, data);
}

export function readFCP(max, min) {
    return {type: types.READ_FCP, max, min}
}

/****************充放气测试****************/
//进入手控模式
export function startManual(uuid, serviceUUID, writeUUID) {
    const data = stringToBytes('HCM1');

    return writeData(uuid, serviceUUID, writeUUID, types.START_MANUAL, data);
}

export function successStartManual() {
    return {type: types.SUCCESS_START_MANUAL}
}
//退出手控模式
export function stopManual(uuid, serviceUUID, writeUUID) {
    const data = stringToBytes('HCM0');

    return writeData(uuid, serviceUUID, writeUUID, types.STOP_MANUAL, data);
}

export function successStopManual() {
    return {type: types.SUCCESS_STOP_MANUAL}
}
//充气
export function startInflate(uuid, serviceUUID, writeUUID) {
    const data = stringToBytes('HIM1');

    return writeData(uuid, serviceUUID, writeUUID, types.START_INFLATE, data);
}

export function completeInflate() {
    return {type: types.COMPLETE_INFLATE}
}
//放气
export function startFlate(uuid, serviceUUID, writeUUID) {
    const data = stringToBytes('HDM1');

    return writeData(uuid, serviceUUID, writeUUID, types.START_FLATE, data);
}

export function completeFlate() {
    return {type: types.COMPLETE_FLATE}
}

/****************传感器校准****************/
//开始校准,进入退出透传模式
export function startAdjustSUB(uuid, serviceUUID, writeUUID) {
    const data = stringToBytes('SUB:1');

    return writeData(uuid, serviceUUID, writeUUID, types.START_ADJUST_SUB, data);
}

export function successStartAdjustSUB() {
    return {type: types.SUCCESS_START_ADJUST_SUB}
}

export function stopAdjustSUB(uuid, serviceUUID, writeUUID) {
    const data = stringToBytes('SUB:0');

    return writeData(uuid, serviceUUID, writeUUID, types.STOP_ADJUST_SUB, data);
}

export function successStopAdjustSUB() {
    return {type: types.SUCCESS_STOP_ADJUST_SUB}
}

//开始校准,进入退出校准模式
export function startAdjust(uuid, serviceUUID, writeUUID) {
    const data = stringToBytes('SUC:AB003E');

    return writeData(uuid, serviceUUID, writeUUID, types.START_ADJUST, data);
}

export function successStartAdjust() {
    return {type: types.SUCCESS_START_ADJUST}
}

export function stopAdjust(uuid, serviceUUID, writeUUID) {
    const data = stringToBytes('SUC:AB013E');

    return writeData(uuid, serviceUUID, writeUUID, types.STOP_ADJUST, data);
}

export function successStopAdjust() {
    return {type: types.SUCCESS_STOP_ADJUST}
}

const sensorIndexCMDMap = ['01','02','03','04','05','06','07','08','09','0A','0B','0C','0D','0E','0F','10']
//传感器校准，1~16个传感器的校准
export function sensorAdjust(uuid, serviceUUID, writeUUID, index) {
    const data = stringToBytes('SUC:AB'+sensorIndexCMDMap[index]+'5E');

    return writeData(uuid, serviceUUID, writeUUID, types.SENSOR_ADJUST, data);
}

export function successSensorAdjust(index) {
    return {type: types.SUCCESS_SENSOR_ADJUST, index}
}