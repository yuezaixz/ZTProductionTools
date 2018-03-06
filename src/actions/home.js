import * as types from '../constants/ActionTypes';
import * as BleUUIDs from '../constants/BleUUIDs';
import BleManager from 'react-native-ble-manager';
import {Platform} from 'react-native';

var loopTimer = 0;
var isSearching = false;

function endTimer(){
    loopTimer && cancelAnimationFrame(loopTimer);
    loopTimer = null;
}

export function startSearchDevice() {
    if (isSearching) {
        return {type: types.START_SEARCH_DEVICE};
    }
    isSearching = true;
    var lastUpdateTime = 0;
    var callback = null;
    function startTimer(cb) {
        callback = cb
        loopHandle()

    }

    function loopHandle() {
        var now = new Date().getTime();
        if(now-lastUpdateTime>1000*1){
            lastUpdateTime = now;
            callback()
        }
        loopTimer = requestAnimationFrame(loopHandle);
    }

    return async (dispatch, getState) =>{
        dispatch({type: types.START_SEARCH_DEVICE})
        var now = new Date().getTime();
        lastUpdateTime = now;

        //适配搜索在不同平台的问题。这个库在iOS需要一直去调用scan，在安卓不用。原生代码实现的问题？
        if (Platform.OS === 'android') {
            BleManager.scan([BleUUIDs.SEARCH_ANDROID_SERVICE_UUID], 0, true).then((results) => {
                console.log('Scanning...');
            })
        }

        if (Platform.OS === 'ios') {
            BleManager.scan([BleUUIDs.SEARCH_IOS_SERVICE_UUID], 3, true).then((results) => {
                console.log('Scanning...');
            })
        }

        startTimer(function () {
            if (Platform.OS === 'ios') {
                BleManager.scan([BleUUIDs.SEARCH_IOS_SERVICE_UUID], 3, true).then((results) => {
                    console.log('Scanning...');
                })
            }
            BleManager.getDiscoveredPeripherals([])
                .then((peripheralsArray) => {
                    var new_list = []

                    var tempState = getState()
                    var current_list = tempState.home.device_list || []
                    if (peripheralsArray ){
                        for (var i = 0; i < peripheralsArray.length; i++) {
                            var peripheral = peripheralsArray[i]
                            var isExit = false;
                            for (var j = 0; j < current_list.length; j++) {
                                var device = current_list[j]
                                if(device.uuid == peripheral.id) {
                                    isExit = true
                                    device.rssi = peripheral.rssi
                                    break
                                }
                            }
                            if (!isExit) {
                                new_list.push({name:peripheral.name,uuid:peripheral.id, rssi:peripheral.rssi})
                            }
                        }
                    }

                    new_list = [...new_list,...current_list]
                    dispatch({type: types.UPDATE_DEVICE_LIST, devices:new_list})
                });
        });

    }
}

export function stopSearchDevice() {
    isSearching = false
    endTimer()
    BleManager.stopScan()
    return {type: types.STOP_SEARCH_DEVICE}
}

export function startDeviceConnect(device) {
    stopSearchDevice()//连接前停止搜索
    return async (dispatch, getState) =>{
        dispatch({type: types.START_DEVICE_CONNECT, uuid: device.uuid})
        BleManager.connect(device.uuid)
            .then(() => {
                //这里只是连上，还要notify和write
                BleManager.retrieveServices(device.uuid)
                    .then((peripheralInfo) => {
                        console.log('Peripheral info:', peripheralInfo);
                        var notifyCharacteristic = null
                        var writeCharacteristic = null
                        if (peripheralInfo.characteristics) {
                            for (var i = 0; i < peripheralInfo.characteristics.length; i++) {
                                var characteristic = peripheralInfo.characteristics[i]
                                if (characteristic.characteristic.toUpperCase() == BleUUIDs.ZT_NOTIFICATION_CHARACTERISTIC_UUID) {
                                    notifyCharacteristic = characteristic.characteristic
                                } else if (characteristic.characteristic.toUpperCase() == BleUUIDs.ZT_WRITE_CHARACTERISTIC_UUID) {
                                    writeCharacteristic = characteristic.characteristic
                                }
                            }
                        }
                        if (notifyCharacteristic && writeCharacteristic) {
                            BleManager.startNotification(device.uuid, BleUUIDs.ZT_SERVICE_UUID, notifyCharacteristic)
                                .then(() => {
                                    dispatch({
                                        type: types.SUCCESS_DEVICE_CONNECT,
                                        uuid: device.uuid,
                                        name: device.name,
                                        serviceUUID:BleUUIDs.ZT_SERVICE_UUID,
                                        noitfyUUID: notifyCharacteristic,
                                        writeUUID: writeCharacteristic})
                                })
                                .catch((error) => {
                                    dispatch({type: types.FAIL_DEVICE_CONNECT, errorMsg: "startNotification失败"})
                                });

                        } else {
                            dispatch({type: types.FAIL_DEVICE_CONNECT, errorMsg: "鞋垫特征初始化失败"})
                        }
                    });

            })
            .catch((error) => {
                dispatch({type: types.FAIL_DEVICE_CONNECT, errorMsg: error})
            });

    }
}
