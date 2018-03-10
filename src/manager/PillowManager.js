import {NativeModules} from 'react-native'
import BleManager from 'react-native-ble-manager';
import {
    Platform,
    NativeEventEmitter,
    NativeModules
} from 'react-native';
import * as BleUUIDs from "../constants/BleUUIDs";
import * as util from "../utils/InsoleUtils";

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

let instance = null;

export default class PillowManager{
    loopTimer = 0;
    isSearching = false;
    lastUpdateTime = 0;
    loopCallback = null;
    device_list = [];
    current_pillow = null

    constructor() {
        if (!instance) {
            instance = this;
            this.handlerUpdate = bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', this.handleUpdateValueForCharacteristic.bind(this) );
        }
        return instance;
    }

    handleUpdateValueForCharacteristic(data) {
        console.log('Received data from ' + data.peripheral + ' text ' + data.text + ' characteristic ' + data.characteristic, data.value);
        var datas = data.value
        var dataStr = util.arrayBufferToBase64Str(datas)
        console.log(dataStr)
        if (this.current_pillow.uuid == data.peripheral) {
            if (util.startWith(dataStr, "Batt")) {
                var voltage = dataStr.substring(7, dataStr.length - 2)
                //TODO
            } else if (util.startWith(dataStr, "Reached Side Line")) {//充气成功
                //TODO this.props.actions.completeInflate()
                //TODO this.props.actions.startFlate(this.props.device_data.uuid, this.props.device_data.serviceUUID, this.props.device_data.writeUUID)
            } else if (util.startWith(dataStr, "Reached Flat Line")) {//放气成功
                //TODO this.props.actions.completeFlate()
                //TODO this.props.actions.stopManual(this.props.device_data.uuid, this.props.device_data.serviceUUID, this.props.device_data.writeUUID)
            } else if (util.startWith(dataStr, "PUMP TH:")) {
                var min = parseInt(dataStr.substring(8, 10), 16)
                var max = parseInt(dataStr.substring(12, 14), 16)
                //TODO this.props.actions.readFCP(max, min)
            } else if (util.startWith(dataStr, "\\*5S")) {
                var index = indexMap[dataStr.substring(3,5)]
                var isSuccess = indexMap[dataStr.substring(6,7)] === '1'
                //TODO this.props.actions.successSensorAdjust(index, isSuccess)

            } else if (util.startWith(dataStr, "Recv ACK")) {
                //TODO 通知Recv ACK，并不用去管是什么，让外头处理就好了
            }
        }
    }

    static ShareInstance(){
        let singleton = new PillowManager();
        return singleton;
    }

    startTimer(cb) {
        this.loopCallback = cb
        this.loopHandle()
    }

    endTimer (){
        this.loopTimer && cancelAnimationFrame(this.loopTimer);
        this.loopTimer = null;
    }

    loopHandle() {
        var now = new Date().getTime();
        if(now-this.lastUpdateTime>1000*1){
            this.lastUpdateTime = now;
            this.loopCallback()
        }
        this.loopTimer = requestAnimationFrame(this.loopHandle);
    }

    //API
    startSearchDevice() {
        if (this.isSearching) {
            return false;
        }
        this.lastUpdateTime = new Date().getTime();
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

        this.startTimer(function () {
            if (Platform.OS === 'ios') {
                BleManager.scan([BleUUIDs.SEARCH_IOS_SERVICE_UUID], 3, true).then((results) => {
                    console.log('Scanning...');
                })
            }
            BleManager.getDiscoveredPeripherals([])
                .then((peripheralsArray) => {
                    var new_list = []

                    var current_list = this.device_list || []
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
                                var device = {name:peripheral.name,uuid:peripheral.id, rssi:peripheral.rssi}
                                new_list.push(device)
                            }
                        }
                    }

                    this.device_list = [...new_list,...current_list]

                    //TODO 通知刷新？
                });
        });
    }

    stopSearchDevice() {
        this.isSearching = false
        this.endTimer()
        BleManager.stopScan()
        return true
    }

    startDeviceConnect(device) {
        this.stopSearchDevice()//连接前停止搜索
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
                                    this.current_pillow = {...device, serviceUUID:BleUUIDs.ZT_SERVICE_UUID,
                                        noitfyUUID: notifyCharacteristic, writeUUID: writeCharacteristic}
                                    //TODO
                                    // dispatch({
                                    //     type: types.SUCCESS_DEVICE_CONNECT,
                                    //     uuid: device.uuid,
                                    //     name: device.name,
                                    //     serviceUUID:BleUUIDs.ZT_SERVICE_UUID,
                                    //     noitfyUUID: notifyCharacteristic,
                                    //     writeUUID: writeCharacteristic})
                                })
                                .catch((error) => {
                                    //TODO dispatch({type: types.FAIL_DEVICE_CONNECT, errorMsg: "startNotification失败"+error})
                                });

                        } else {
                            //TODO dispatch({type: types.FAIL_DEVICE_CONNECT, errorMsg: "鞋垫特征初始化失败"})
                        }
                    });

            })
            .catch((error) => {
                //TODO dispatch({type: types.FAIL_DEVICE_CONNECT, errorMsg: error})
            });
    }

    deviceDisconnect(uuid) {
        BleManager.disconnect(uuid)
            .then(() => {
                //TODO dispatch({type: types.SUCCESS_DEVICE_DISCONNECT, uuid: uuid})
            })
            .catch((error) => {
                //TODO dispatch({type: types.FAIL_DEVICE_DISCONNECT, errorMsg: error})
            });
    }

    writeData(device, command, func) {
        BleManager.write(device.uuid, device.serviceUUID, device.writeUUID, command)
            .then(() => {
                //todo 写入成功
                // if (func) {
                //     func()
                // }
            })
            .catch((error) => {
                //todo 写入失败
                console.log(error);
            });

        //TODO return {type: successType}
    }

}
