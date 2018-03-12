import React, { Component } from 'react';
import {
    Platform,
    PermissionsAndroid,
    AsyncStorage
} from 'react-native';
import { Provider } from 'react-redux';

import App from './containers/App';
import configureStore from './store/configureStore';
import * as StorageKeys from './constants/StorageKeys'
import PillowManager from './manager/PillowManager'

class Root extends Component {
    componentWillMount() {
        AsyncStorage.getItem(StorageKeys.CONNECT_THRESHOLD,function (error, result) {
            if(!error) {
                if (!result) {
                    //默认值，最好放个配置文件中
                    AsyncStorage.setItem(StorageKeys.CONNECT_THRESHOLD,'40')
                    AsyncStorage.setItem(StorageKeys.AIR_PRESSURE_THRESHOLD,'10')
                    AsyncStorage.setItem(StorageKeys.STD_VOLTAGE,'3.8')
                }
            }
        })
        PillowManager.ShareInstance().setUp()
    }
    componentDidMount() {
        if (Platform.OS === 'android' && Platform.Version >= 23) {
            PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
                if (result) {

                    console.log("Permission is OK");
                } else {
                    PermissionsAndroid.requestPermission(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
                        if (result) {
                            console.log("User accept");
                        } else {
                            console.log("User refuse");
                        }
                    });
                }
            });
        }

    }
    render() {
        return (
            <Provider store={configureStore()}>
                <App />
            </Provider>
        );
    }
}

export default Root;