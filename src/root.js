import React, { Component } from 'react';
import {
    Platform,
    PermissionsAndroid,
    AsyncStorage
} from 'react-native';
import { Provider } from 'react-redux';

import App from './containers/App';
import configureStore from './store/configureStore';
import BleManager from 'react-native-ble-manager';

class Root extends Component {
    componentWillMount() {
        AsyncStorage.getItem('connect_threshold',function (error, result) {
            if(!error) {
                if (!result) {
                    AsyncStorage.setItem('connect_threshold','40')
                    AsyncStorage.setItem('air_pressure_threshold','10')
                    AsyncStorage.setItem('std_voltage','5.82')
                }
            }
        })
        BleManager.start({showAlert: false})
            .then(() => {
                // Success code
                console.log('Module initialized');
            });
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