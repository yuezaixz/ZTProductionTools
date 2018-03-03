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

export function startCheckVoltage(uuid, serviceUUID, writeUUID) {
    const data = stringToBytes('BR');

    return writeData(uuid, serviceUUID, writeUUID, types.START_CHECK_VOLTAGE, data);
}

export function startReadVoltage(uuid, serviceUUID, writeUUID) {
    const data = stringToBytes('BG');

    return writeData(uuid, serviceUUID, writeUUID, types.START_READ_VOLTAGE, data);
}

export function readVoltage(voltage) {
    return {type: types.READ_VOLTAGE, voltage}
}