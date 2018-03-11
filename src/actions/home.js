import * as types from '../constants/ActionTypes';
import * as BleUUIDs from '../constants/BleUUIDs';
import PillowManager from '../manager/PillowManager'

export function startSearchDevice() {
    return async (dispatch, getState) => {
        dispatch({type: types.START_SEARCH_DEVICE})

        PillowManager.ShareInstance().startSearchDevice().then((deviceList) => {
            dispatch({type: types.UPDATE_DEVICE_LIST, devices: deviceList})
        }).catch(error => {
            console.log(error)
            //重复开始，不处理了吧。
        })
    }
}

export function stopSearchDevice() {
    PillowManager.ShareInstance().stopSearchDevice()
    return {type: types.STOP_SEARCH_DEVICE}
}

export function startDeviceConnect(device) {
    stopSearchDevice()//连接前停止搜索
    return async (dispatch, getState) =>{
        dispatch({type: types.START_DEVICE_CONNECT, uuid: device.uuid})
        PillowManager.ShareInstance().startDeviceConnect(device)
            .then((device)=>{
                dispatch({
                    type: types.SUCCESS_DEVICE_CONNECT,
                    uuid: device.uuid,
                    name: device.name,
                    serviceUUID:BleUUIDs.ZT_SERVICE_UUID,
                    noitfyUUID: device.notifyCharacteristic,
                    writeUUID: device.writeCharacteristic})
            }).catch(error => {
                dispatch({type: types.FAIL_DEVICE_CONNECT, errorMsg: error})

        })
    }
}
