import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
    StyleSheet,
    View,
    Text,
    ImageBackground,
    TouchableOpacity,
    Platform,
    PermissionsAndroid,
    NativeEventEmitter,
    AsyncStorage,
    NativeModules, Dimensions
} from 'react-native';
import Modal from 'react-native-simple-modal';
import BleManager from 'react-native-ble-manager';
let {height, width} = Dimensions.get('window');

import {
    Main
} from '../components/home-view';
import Actions from '../actions';
import NotificationCenter from "../../src/public/Com/NotificationCenter/NotificationCenter";
import {Theme} from '../styles';
import PillowManager from '../../src/manager/PillowManager';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

class HomeView extends Component {
    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params || {};

        return {
            title:"Deeper Pillow",
            // headerLeft: (
            //     <StatusBarLeftButton onPress={params.settingAction} textStyle={{color:"white"}} title="设置" ></StatusBarLeftButton>
            // ),
        };
    };
    isFirst = true
    state = {}
    constructor(props){
        super(props)
        this.state = {isVisible: true, open: false}
    }
    _adjustAction(){
        console.log('_adjustAction');
        
        this.props.navigation.navigate('Adjust')
    }
    _logAction(){
        console.log('_logAction');
        this.props.navigation.navigate('Log')
    }
    _rebootAction(){
        this.props.actions.showToast('Ready reboot')
        console.log('_rebootAction');
        PillowManager.ShareInstance().startDfu().then(() => {
            this.props.actions.showLoading('Please wait 1 minutes', 60*1000);
            setTimeout(() => {
                this.props.actions.reinitApp()
                this.props.actions.startSearchDevice()
            }, 60*1000);
        }).catch(error => {
            this.props.actions.showLoading('Please wait 1 minutes', 60*1000);
            setTimeout(() => {
                this.props.actions.reinitApp()
                this.props.actions.startSearchDevice()
            }, 60*1000);
        })
    }
    _clearDataAction(){
        this.props.actions.showModal('Tips','Are you sure to reset data？', [
            {keyTitle:'OK', callBack:()=>{
                this.props.actions.showToast('Ready to reset')
                PillowManager.ShareInstance().clearData().then(() => {
                    this.props.actions.showToast('Reset successfully', 2000)
                }).catch(error => {
                    console.log(error)
                    this.props.actions.showToast('Reset failed', 2000);
                })
            }}
        ])
    }
    _disconnectAction() {
        if (this.props.device_data.uuid) {
            this.props.actions.deviceDisconnect(this.props.device_data.uuid)
        }
        this.props.actions.startSearchDevice()
    }

    _disOnlyStrong() {
        this.props.actions.changeOnlyStrong(false)
    }

    _connectAction(device) {
        // 防止重复点击，停止搜索
        if (this.props.device_data.isConnecting) {
            this.props.actions.showLoading('Connecting');
            return;
        }
        if (this.props.device_data.uuid == device.uuid) {
            return;
        }
        this.props.actions.showLoading('Connecting');
        this.props.actions.stopSearchDevice()
        this.props.actions.startDeviceConnect(device)
    }
    componentWillMount() {
        this.props.navigation.addListener(
            'didFocus',
            payload => {
                this.setState({isVisible: true});
                if (!this.props.device_data.uuid) {
                    setTimeout(() => {
                        setTimeout(() => {this.props.actions.startSearchDevice()}, 500)
                        this.isFirst = false
                    }, 500)
                }
            }
        );
        this.props.navigation.addListener(
            'willBlur',
            payload => {
                this.props.actions.stopSearchDevice();
                this.setState({isVisible: false});
            }
        );

        this.updateListListener = NotificationCenter.createListener(NotificationCenter.name.search.updateList, this.updateDeviceList.bind(this), '');
        this.onConnectedListener = NotificationCenter.createListener(NotificationCenter.name.search.connected, this.onConnected.bind(this), '');
        this.voltageListener = NotificationCenter
                                .createListener(
                                    NotificationCenter.name.deviceData.voltage, 
                                    this.readVoltage.bind(this), 
                                    ''
                                );
        this.versionListener = NotificationCenter
                                .createListener(
                                    NotificationCenter.name.deviceData.version, 
                                    this.readVersion.bind(this), 
                                    ''
                                );

        this.voltageListener = NotificationCenter
                                .createListener(
                                    NotificationCenter.name.deviceData.voltage, 
                                    this.readVoltage.bind(this), 
                                    ''
                                );

        this.macAddressListener = NotificationCenter
                                .createListener(
                                    NotificationCenter.name.deviceData.macAddress, 
                                    this.readMacAddress.bind(this), 
                                    ''
                                );

        this.sleepDataListener = NotificationCenter
                                .createListener(
                                    NotificationCenter.name.deviceData.sleepData, 
                                    this.readSleepData.bind(this), 
                                    ''
                                );

        this.sleepStatusListener = NotificationCenter
                                .createListener(
                                    NotificationCenter.name.deviceData.sleepStatus, 
                                    this.readSleepStatus.bind(this), 
                                    ''
                                );

        this.foundLastDeviceListener = NotificationCenter
                                .createListener(
                                    NotificationCenter.name.search.foundLastDevice, 
                                    this.foundLastDevice.bind(this), 
                                    ''
                                );
    }

    onConnected() {
        if (!this.state.isVisible) {
            return
        }
        this.props.actions.showLoading('Connected successfully', 2000);
    }

    foundLastDevice(data) {
        if (!this.state.isVisible) {
            return
        }
        let device = data.device
        // 防止重复点击，停止搜索
        if (this.props.device_data.isConnecting) {
            this.props.actions.showLoading('Connecting');
            return;
        }
        if (this.props.device_data.uuid == device.uuid) {
            return;
        }
        this.props.actions.showLoading('Auto connecting');
        this.props.actions.stopSearchDevice()
        this.props.actions.startDeviceConnect(device)
    }

    readVoltage(data) {
        if (!this.state.isVisible) {
            return
        }
        console.log(data)
        this.props.actions.readVoltage(data)
    }

    readVersion(data) {
        if (!this.state.isVisible) {
            return
        }
        console.log(data)
        this.props.actions.readVersion(data)
    }

    readMacAddress(data) {
        if (!this.state.isVisible) {
            return
        }
        console.log(data.macAddress)
        this.props.actions.readMacAddress(data.macAddress)
    }

    readSleepData(data) {
        if (!this.state.isVisible) {
            return
        }
        console.log(data)
        this.props.actions.readSleepData(data)
    }

    readSleepStatus(data) {
        if (!this.state.isVisible) {
            return
        }
        console.log(data.status)
        if (this.props.device_data.pillowStatus != data.status) {
            this.props.actions.readSleepStatus(data.status, data.poseCode, data.flatCode)
        }
    }

    updateDeviceList(data) {
        if (!this.state.isVisible) {
            return
        }
        if (data.data) {
            this.props.actions.updateDeviceList(data.data, data.strongDevice)
        }
    }

    loadTestData() {
        if (!this.props.device_data.debug) {
            return
        }

    }

    componentDidMount() {
        this.loadTestData()
        bleManagerEmitter.addListener(
            'BleManagerDidUpdateState',
            (args) => {
                if (args.state === 'off') {
                    if (Platform.OS === 'android' ) {
                        BleManager.enableBluetooth()
                            .then(() => {
                                // Success code
                                console.log('The bluetooh is already enabled or the user confirm');
                            })
                            .catch((error) => {
                                // Failure code
                                console.log('The user refuse to enable bluetooth');
                            });
                    } else {
                        this.setState({open: true})
                    }
                } else {
                    if (this.isFirst) {
                        setTimeout(() => {this.props.actions.startSearchDevice()}, 500)
                        this.isFirst = false
                    } else {
                        //TODO 刷新？
                    }
                    console.log('bluetooth state:'+args.state)
                }
            }
        );

        BleManager.checkState();
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
    componentWillUnmount(){
        NotificationCenter.removeListener(this.updateListListener)
        NotificationCenter.removeListener(this.onConnectedListener)
        NotificationCenter.removeListener(this.voltageListener)
        NotificationCenter.removeListener(this.versionListener)
        NotificationCenter.removeListener(this.voltageListener)
        NotificationCenter.removeListener(this.macAddressListener)
        NotificationCenter.removeListener(this.sleepDataListener)
        NotificationCenter.removeListener(this.sleepStatusListener)
        NotificationCenter.removeListener(this.foundLastDeviceListener)
        bleManagerEmitter.removeAllListeners('BleManagerDidUpdateState')
        this.props.actions.stopSearchDevice()
    }
    bindEvents = ()=>{
        this.willFocusSubscription  = this.props.navigator.navigationContext.addListener('willfocus', (event) => {
            if (this.currentRoute !== event.data.route) {//切换会当前页面，开始搜索，列表显示
                this.setState({isVisible: false});
            }
        });
        this.didFocusSubscription  = this.props.navigator.navigationContext.addListener('didfocus', (event) => {
            if (this.currentRoute === event.data.route) {
                this.setState({isVisible: true});
            }
        });
    }
    unBindEvents = ()=>{
        this.willFocusSubscription.remove();
        this.didFocusSubscription.remove();
    }

    render() {
        return (
            <ImageBackground source={require('../statics/images/bg.jpg')} style={styles.container}>
                {/*<Header {...this.props}/>*/}
                <Main {...this.props} 
                    onDisconnect={this._disconnectAction.bind(this)} 
                    onConnect={this._connectAction.bind(this)} 
                    disOnlyStrong={this._disOnlyStrong.bind(this)} 
                    adjustAction={this._adjustAction.bind(this)} 
                    logAction={this._logAction.bind(this)} 
                    rebootAction={this._rebootAction.bind(this)} 
                    clearDataAction={this._clearDataAction.bind(this)}
                    lastDeviceId={"TODO"} 
                    isVisible={this.state.isVisible}
                />
            </ImageBackground>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignSelf: 'stretch',
        backgroundColor: Theme.color.bgColor
    }
});

function mapStateToProps(state) {
    return {
        device_data: state.device
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Actions, dispatch)
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(HomeView);

