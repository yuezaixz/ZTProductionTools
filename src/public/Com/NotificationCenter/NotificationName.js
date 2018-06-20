'use strict';

module.exports = {
    search:{
        startSearch: 'com.podoon.ztproduct.startSearch',
        updateList:'com.podoon.ztproduct.List',
        stopSearch:'com.podoon.ztproduct.stopSearch',
        connected:'com.podoon.ztproduct.connected',
        loseConnecting:'com.podoon.ztproduct.loseConnecting',
        reconnect:'com.podoon.ztproduct.reconnect'
    },
    deviceData: {
        log_list: 'com.podoon.ztproduct.log_list',                //读取到日志
        voltage: 'com.podoon.ztproduct.voltage',                //读取到电量
        readFCP: 'com.podoon.ztproduct.readFCP',                //读取到电量
        completeInflate: 'com.podoon.ztproduct.completeInflate',               //充气成功
        completeFlate: 'com.podoon.ztproduct.completeFlate',               //放气成功
        successSensorAdjust: 'com.podoon.ztproduct.successSensorAdjust',               //校准某传感器成功
        recvACK: 'com.podoon.ztproduct.recvACK',               //收到ACK通知
        sensorAdjust: 'com.podoon.ztproduct.sensorAdjust',               //收到ACK通知
        macAddress: 'com.podoon.ztproduct.macAddress',
        version: 'com.podoon.ztproduct.version',
        sleepData: 'com.podoon.ztproduct.sleepData',
        sleepStatus: 'com.podoon.ztproduct.sleepStatus',
        foundLastDevice: 'com.podoon.ztproduct.foundLastDevice',
    }
};
