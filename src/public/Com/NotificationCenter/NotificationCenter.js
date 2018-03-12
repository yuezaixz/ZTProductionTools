'use strict';

import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter'
import NotificationName from './NotificationName';

function _lister_create_broadcast_for_(name, callback, init) {
    let res =  RCTDeviceEventEmitter.addListener(name, callback);
    if (init) {
        callback(init);
    }
    return res
}

function _lister_remove_broadcast_for_(listener) {
    listener.remove()
}

function _poster_post_broadcast_for_(name, data) {
    RCTDeviceEventEmitter.emit(name, data)
}

module.exports = {
    name: NotificationName,

    createListener(name, callback, init) {
        return _lister_create_broadcast_for_(name, callback, init);
    },

    removeListener(listener) {
        return _lister_remove_broadcast_for_(listener);
    },

    post(name, data) {
        _poster_post_broadcast_for_(name, data);
    },
};
