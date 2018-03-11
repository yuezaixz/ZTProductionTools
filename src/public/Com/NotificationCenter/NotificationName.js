'use strict';

module.exports = {
    search:{
        startSearch: 'com.podoon.ztproduct.startSearch',
        updateList:'com.podoon.ztproduct.List',
        stopSearch:'com.podoon.ztproduct.stopSearch'
    },
    deviceData: {
        voltage: 'com.podoon.ztproduct.voltage',                //读取到电量
        completeInflate: 'com.podoon.ztproduct.completeInflate',               //充气成功
        completeFlate: 'com.podoon.ztproduct.completeFlate',               //放气成功
        successSensorAdjust: 'com.podoon.ztproduct.successSensorAdjust',               //校准某传感器成功
        recvACK: 'com.podoon.ztproduct.recvACK',               //收到ACK通知
    }
};
