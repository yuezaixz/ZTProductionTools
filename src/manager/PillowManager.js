import BleManager from 'react-native-ble-manager';
import {
    AsyncStorage,
    Platform,
    NativeEventEmitter,
    NativeModules
} from 'react-native';
import * as BleUUIDs from "../constants/BleUUIDs";
import * as util from "../utils/InsoleUtils";
import NotificationCenter from '../public/Com/NotificationCenter/NotificationCenter'
import { stringToBytes } from 'convert-string';
import * as StorageKeys from '../constants/StorageKeys'

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

let instance = null;

const indexMap = {
    '01':0,
    '02':1,
    '03':2,
    '04':3,
    '05':4,
    '06':5,
    '07':6,
    '08':7,
    '09':8,
    '0A':9,
    '0B':10,
    '0C':11,
    '0D':12,
    '0E':13,
    '0F':14,
    '10':15,
}

const sensorIndexCMDMap = ['01','02','03','04','05','06','07','08','09','0A','0B','0C','0D','0E','0F','10']
//传感器校准，1~16个传感器的校准

export default class PillowManager{
    loopTimer = 0;
    isSearching = false;
    isDfu = false;
    lastUpdateTime = 0;
    loopCallback = null;
    device_list = [];
    current_pillow = null

    isLoseConnecting = false;
    log_list = []

    lastConnectUUID = null

    constructor() {
        if (!instance) {
            instance = this;
            AsyncStorage.getItem(StorageKeys.LAST_CONNECT_UUID, function (error, result) {
                if (!error && result) {
                    this.lastConnectUUID = result ? JSON.parse(result) : null
                }
            }.bind(this))
        }
        // this.initTestData()
        return instance;
    }

    initTestData() {
        setTimeout(() => {
            this.device_list = [
                {name:'测试',uuid:'DF-FDAF-FSDF-FASD-FSDF-VD-EF', rssi:-34},
                {name:'测试',uuid:'DF-FDAF-FSDF-FASD-FSDF-VD-EF', rssi:-34},
                {name:'测试',uuid:'DF-FDAF-FSDF-FASD-FSDF-VD-EF', rssi:-34},
                {name:'测试',uuid:'DF-FDAF-FSDF-FASD-FSDF-VD-EF', rssi:-34},
                {name:'测试',uuid:'DF-FDAF-FSDF-FASD-FSDF-VD-EF', rssi:-34},
                {name:'测试',uuid:'DF-FDAF-FSDF-FASD-FSDF-VD-EF', rssi:-34},
                {name:'测试',uuid:'DF-FDAF-FSDF-FASD-FSDF-VD-EF', rssi:-34},
                {name:'测试',uuid:'DF-FDAF-FSDF-FASD-FSDF-VD-EF', rssi:-34}
            ]
        }, 2000);
    }

    reconnect() {
        if (this.isDfu) {
            return
        }

        // console.log('开始重连')
        // if (this.isLoseConnecting){
        //     this.startDeviceConnect(this.current_pillow).then((device)=>{
        //         this.isLoseConnecting = true
        //         NotificationCenter.post(NotificationCenter.name.search.reconnect)
        //     }).catch((error)=>{
        //         console.log('重连失败')
        //         setTimeout(this.reconnect.bind(this),3000)
        //     })
        // }
    }

    setUp() {
        this.handlerUpdate = bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', this.handleUpdateValueForCharacteristic.bind(this) );
        this.disconnectListener = bleManagerEmitter.addListener(
            'BleManagerDisconnectPeripheral',
            ((args) => {
                if(this.current_pillow && this.current_pillow.uuid == args.peripheral) {
                    //TODO 断开时候，要先设置状态，让DeviceView和AdjustView显示重连中

                    this.isLoseConnecting = true
                    NotificationCenter.post(NotificationCenter.name.search.loseConnecting)

                    this.reconnect()
                }
            }).bind(this)
        );
        BleManager.start({showAlert: false})
            .then(() => {
                // Success code
                console.log('Module initialized');
            });
    }

    handleUpdateValueForCharacteristic(data) {
        //TODO 返回值用listener吧，电量的写好了，待测试

        console.log('Received data from ' + data.peripheral + ' text ' + data.text + ' characteristic ' + data.characteristic, data.value);
        var datas = data.value
        var dataStr = util.arrayBufferToBase64Str(datas)
        this.log_list.unshift(util.curentTimeStr()+'||' + dataStr)
        // this.log_list.push(dataStr)
        if (this.log_list.length > 200) {
            this.log_list.shift()
        }
        NotificationCenter.post(NotificationCenter.name.deviceData.log_list, {log_list:this.log_list})
        console.log(dataStr)
        if (this.current_pillow.uuid == data.peripheral) {
            if (util.startWith(dataStr, "BattV")) {
                if (dataStr.substring(6, 7) != ":") {//防止旧数据
                    return
                }
            
                var responseStr1 = dataStr.substring(7, dataStr.length - 2)
                console.log('电量:' + responseStr1 + 'mV')
                let voltage = parseInt(responseStr1)
            
                var responseStr2 = dataStr.substring(5, 6)
                console.log('用电模式:' + responseStr2)
            
                let isCharging = responseStr2 !== '0'

                var percent = util.voltagePercent(parseFloat(responseStr1) / 1000, parseInt(responseStr2))
                this.startReadVersion()
                NotificationCenter.post(NotificationCenter.name.deviceData.voltage, {voltage, percent, isCharging})
            } else if (util.startWith(dataStr, 'P:') && dataStr.indexOf('A:') === -1) {
                var responseStr1 = dataStr.substring(2, dataStr.length)
                var splitted = responseStr1.split(",");
                var data = {
                    rollCount: parseInt(splitted[0]),
                    flatTime: util.timeStr(parseInt(splitted[1])) || "0分",
                    slideTime: util.timeStr(parseInt(splitted[2])) || "0分",
                    slidePercent: parseInt(splitted[3]),
                    sleepPose: parseInt(splitted[1]) == 0 && parseInt(splitted[2])==0?'暂无统计': (parseInt(splitted[1]) > parseInt(splitted[2])?'仰睡':'侧睡'),
                }
                this.startReadMacaddress()
                NotificationCenter.post(NotificationCenter.name.deviceData.sleepData, data)

            } else if (util.startWith(dataStr, 'MC:')) {
                var responseStr1 = dataStr.substring(3, dataStr.length)
                NotificationCenter.post(NotificationCenter.name.deviceData.macAddress, {macAddress:responseStr1})
            } else if (util.startWith(dataStr, 'FW Ver')) {
                var responseStr1 = dataStr.substring(9, dataStr.length)
                var splitted = responseStr1.split(".");
                let majorVersion = parseInt(splitted[0])
                let minorVersion = parseInt(splitted[1])
                let reVersion = parseInt(splitted[2])
                var data = {
                    majorVersion, minorVersion, reVersion, version: responseStr1
                }
                this.log_list.push('版本:'+responseStr1)
                this.current_pillow = {...this.current_pillow, ...data}
                this.startReadSleepData()
                NotificationCenter.post(NotificationCenter.name.deviceData.version, data)
            } else if (~dataStr.indexOf('$SP')) {
                let status = 0
                var responseStr1 = dataStr.substring(4, 6)
                var responseStr2 = dataStr.substring(9, 11)
                if (responseStr2 === '0') {
                    status = parseInt(responseStr1)
                } else {
                    status = 2 + parseInt(responseStr2)
                }
                NotificationCenter.post(NotificationCenter.name.deviceData.sleepStatus, {status, poseCode:parseInt(responseStr1), flatCode:parseInt(responseStr2)})
            } else if (util.startWith(dataStr, "Reached Side Line")) {//充气成功
                NotificationCenter.post(NotificationCenter.name.deviceData.completeInflate)
            } else if (util.startWith(dataStr, "Reached Flat Line")) {//放气成功
                NotificationCenter.post(NotificationCenter.name.deviceData.completeFlate)
            } else if (util.startWith(dataStr, "PUMP TH:")) {
                var min = parseInt(dataStr.substring(8, 10), 16)
                var max = parseInt(dataStr.substring(12, 14), 16)
                NotificationCenter.post(NotificationCenter.name.deviceData.readFCP, {max,min})
            } else if (util.startWith(dataStr, "\\*5S")) {
                var index = indexMap[dataStr.substring(3,5)]
                var isSuccess = dataStr.substring(5,6) === '1'
                console.log("sensorAdjust:"+index+","+isSuccess)
                NotificationCenter.post(NotificationCenter.name.deviceData.sensorAdjust, {index,isSuccess})

            } else if (util.startWith(dataStr, "Recv ACK")) {
                NotificationCenter.post(NotificationCenter.name.deviceData.recvACK)
            } else if (util.startWith(dataStr, "RecvACK:") && dataStr.length > 8 ) {
                let responseStr = dataStr.substring(8, dataStr.length)
                NotificationCenter.post(NotificationCenter.name.deviceData.recvACK, {command:responseStr})
            } else if (dataStr === '$WR:H-ADJUST DONE!') {
                NotificationCenter.post(NotificationCenter.name.deviceData.recvACK, {command:'ADJUST DONE'})
            }
        }
    }

    static reinit() {
        if (instance && instance.current_pillow) {
            instance.deviceDisconnect(instance.current_pillow.uuid, true).then(()=>{
                instance = null
            })
        } else {
            instance = null
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
        this.loopTimer = requestAnimationFrame(this.loopHandle.bind(this));
    }

    enableLog() {
        this.clearLog()
        const data = stringToBytes('SDI:5');
        return this.writeData(data)
    }

    disableLog() {
        const data = stringToBytes('SDI:0');
        return this.writeData(data)
    }

    //API
    startReadVoltage() {
        const data = stringToBytes('GHV');
        return this.writeData(data)
    }

    startDfu() {
        this.isDfu = true
        const data = stringToBytes('dfu');
        return this.writeData(data)
    }

    clearData() {
        const data = stringToBytes('GLC');
        return this.writeData(data).then(() => {
            setTimeout(() => {
                const data2 = stringToBytes('GLS');
                this.writeData(data2)
            }, 1000);
        }).catch((err) => {
            console.log('clearData', err)
        });
    }

    clearLog() {
        this.log_list = []
        if (this.current_pillow && this.current_pillow.version) {
            this.log_list.push('版本:'+this.current_pillow.version)
            NotificationCenter.post(NotificationCenter.name.deviceData.log_list, {log_list:this.log_list})
        }
    }

    startReadVersion() {
        const data = stringToBytes('GVN');
        return this.writeData(data)
    }

    startReadSleepData() {
        const data = stringToBytes('GLS');
        return this.writeData(data)
    }

    startReadMacaddress() {
        const data = stringToBytes('GMAC');
        return this.writeData(data)
    }

    startDfu() {
        const data = stringToBytes('dfu');
        return this.writeData(data)
    }

    startClearSleepData() {
        const data = stringToBytes('GLS');
        return this.writeData(data)
    }

    startReadFAT() {
        const data = stringToBytes('FAT');
        return this.writeData(data)
    }

    startReadFCP() {
        const data = stringToBytes('FCP');
        return this.writeData(data)
    }

    startManual() {
        const data = stringToBytes('HCM1');
        return this.writeData(data)
    }

    stopManual() {
        const data = stringToBytes('HCM0');
        return this.writeData(data)
    }

    startRising() {
        const data = stringToBytes('HIM1');
        return this.writeData(data)
    }

    startFalling() {
        const data = stringToBytes('HDM1');
        return this.writeData(data)
    }

    startPausing() {
        const data = stringToBytes('HAM0');
        return this.writeData(data)
    }

    startSaveHeight() {
        const data = stringToBytes('HCD');
        return this.writeData(data)
    }

    startInflate() {
        const data = stringToBytes('HIM1');
        return this.writeData(data)
    }

    startFlate() {
        const data = stringToBytes('HDM1');
        return this.writeData(data)
    }

    startAdjustSUB() {
        return new Promise((resolve, reject) => {
            const data = stringToBytes('SUB:1');
            this.writeData(data)

            resolve()
        });
    }

    stopAdjustSUB() {
        return new Promise((resolve, reject) => {
            const data = stringToBytes('SUB:0');
            this.writeData(data)

            resolve()
        });
    }

    startAdjust() {
        return new Promise((resolve, reject) => {
            const data = stringToBytes('SUC:AB003E');
            this.writeData(data)

            resolve()
        });
    }

    stopAdjust() {
        return new Promise((resolve, reject) => {
            const data = stringToBytes('SUC:AB013E');
            this.writeData(data)

            resolve()
        });
    }

    sensorAdjust(index) {
        return new Promise((resolve, reject) => {
            var cmd = 'SUC:AB'+sensorIndexCMDMap[index]+'5E'
            console.log(cmd)
            const data = stringToBytes(cmd);
            this.writeData(data)

            resolve()
        });
    }

    startSearchDevice() {
        return new Promise((resolve, reject) => {
            if (this.isSearching) {
                reject(new Error("已经在搜索中"))
            } else {
                this.isSearching = true
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
                NotificationCenter.post(NotificationCenter.name.search.startSearch)
                resolve()

                this.startTimer(() => {
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
                                    if (peripheral.rssi === 127) {
                                        continue
                                    }
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
                                        var device = {
                                            name:peripheral.name,
                                            localName:'Deeper护颈枕' + peripheral.id.substring(peripheral.id.length - 5, peripheral.id.length),
                                            uuid:peripheral.id, 
                                            rssi:peripheral.rssi
                                        }

                                        if (this.lastConnectUUID && this.lastConnectUUID === device.uuid ) {
                                            NotificationCenter.post(NotificationCenter.name.search.foundLastDevice, {device})
                                        }
                                        new_list.push(device)
                                    }
                                }
                            }

                            this.device_list = [...new_list,...current_list]

                            NotificationCenter.post(NotificationCenter.name.search.updateList, {data:this.device_list})
                        });
                });
            }
        });
    }

    stopSearchDevice() {
        this.isSearching = false
        this.device_list = []
        this.endTimer()
        BleManager.stopScan()
        NotificationCenter.post(NotificationCenter.name.search.stopSearch)
        return true
    }

    startDeviceConnect(device) {
        this.lastConnectUUID = device.uuid
        AsyncStorage.setItem(StorageKeys.LAST_CONNECT_UUID, JSON.stringify(device.uuid))
        this.stopSearchDevice()//连接前停止搜索
        this.isDfu = false
        this.isLoseConnecting = false
        this.log_list = []
        return new Promise((resolve, reject) => {
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
                                        resolve(this.current_pillow)
                                        setTimeout(() => {
                                            this.startReadVoltage()
                                            NotificationCenter.post(NotificationCenter.name.search.connected, {currentPillow:this.current_pillow})
                                        }, 500);
                                    })
                                    .catch((error) => {
                                        reject(new Error("startNotification失败"+error))
                                    });

                            } else {
                                reject(new Error("鞋垫特征初始化失败"))
                            }
                        });

                })
                .catch((error) => {
                    reject(error)
                });
        });
    }

    deviceDisconnect(uuid, isKeepLast) {
        if (!isKeepLast) {
            this.lastConnectUUID = null
            AsyncStorage.removeItem(StorageKeys.LAST_CONNECT_UUID)
        }

        return new Promise((resolve, reject) => {
            if (!this.current_pillow) {
                reject(new Error('无当前设备'))
            } else if(this.isLoseConnecting) {
                resolve(uuid)
                this.isLoseConnecting = false
            } else {
                this.isLoseConnecting = false
                BleManager.disconnect(uuid)
                    .then(() => {
                        resolve(uuid)
                    })
                    .catch((error) => {
                        reject(error)
                    });
            }

        });
    }

    writeData(command) {
        let current_device = this.current_pillow
        return new Promise((resolve, reject) => {
            if (current_device) {
                BleManager.write(current_device.uuid, current_device.serviceUUID, current_device.writeUUID, command)
                    .then(() => {
                        resolve()
                    })
                    .catch((error) => {
                        reject(error)
                    });
            } else {
                reject(new Error("未连接设备"))
            }
        });
    }

}
