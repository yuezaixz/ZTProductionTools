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
            title:"Deeper护颈枕",
            // headerLeft: (
            //     <StatusBarLeftButton onPress={params.settingAction} textStyle={{color:"white"}} title="设置" ></StatusBarLeftButton>
            // ),
        };
    };
    isFirst = true
    state = {open: true}
    constructor(props){
        super(props)
        this.state = {isVisible: true}
    }
    _adjustAction(){
        console.log('_adjustAction');
        
        // this.props.navigation.navigate('Adjust')
    }
    _logAction(){
        console.log('_logAction');
        // this.props.navigation.navigate('Log')
    }
    _rebootAction(){
        console.log('_rebootAction');
    }
    _clearDataAction(){
        console.log('_clearDataAction');
    }
    _disconnectAction() {
        if (this.props.device_data.uuid) {
            this.props.actions.deviceDisconnect(this.props.device_data.uuid)
        }
        this.props.actions.startSearchDevice()
    }
    _connectAction(device) {
        // 防止重复点击，停止搜索
        if (this.props.device_data.isConnecting) {
            //todo 提示连接中，请稍等
            return;
        }
        if (this.props.device_data.uuid == device.uuid) {
            return;
        }
        //TODO 提示开始连接
        this.props.actions.stopSearchDevice()
        this.props.actions.startDeviceConnect(device)
    }
    componentWillMount() {
        this.props.navigation.addListener(
            'didFocus',
            payload => {
                setTimeout(() => {
                    setTimeout(() => {this.props.actions.startSearchDevice()}, 500)
                    this.isFirst = false
                    this.setState({isVisible: true});
                }, 500)
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
    }

    readVoltage(data) {
        console.log(data)
        this.props.actions.readVoltage(data)
    }

    readVersion(data) {
        console.log(data)
        this.props.actions.readVersion(data)
    }

    readMacAddress(data) {
        console.log(data.macAddress)
        this.props.actions.readMacAddress(data.macAddress)
    }

    readSleepData(data) {
        console.log(data)
        this.props.actions.readSleepData(data)
    }

    readSleepStatus(data) {
        console.log(data.status)
        this.props.actions.readSleepStatus(data.status)
    }

    updateDeviceList(data) {
        if (data.data) {
            this.props.actions.updateDeviceList(data.data)
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
        bleManagerEmitter.removeAllListeners('BleManagerDidUpdateState')
        bleManagerEmitter.removeAllListeners('BleManagerDisconnectPeripheral')
        NotificationCenter.removeListener(this.updateListListener);
        this.props.actions.stopSearchDevice()
    }
    bindEvents = ()=>{
        // this.willFocusSubscription  = this.props.navigator.navigationContext.addListener('willfocus', (event) => {
        //     if (this.currentRoute !== event.data.route) {//切换会当前页面，开始搜索，列表显示
        //         this.setState({isVisible: false});
        //     }
        // });
        // this.didFocusSubscription  = this.props.navigator.navigationContext.addListener('didfocus', (event) => {
        //     if (this.currentRoute === event.data.route) {
        //         this.setState({isVisible: true});
        //     }
        // });
    }
    unBindEvents = ()=>{
        // this.willFocusSubscription.remove();
        // this.didFocusSubscription.remove();
    }

    renderBleAlert = () => {
        if (this.state.open) 
            return (
                <View style={{position:'absolute',width: width, height: height}}>
                    <View  style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <Modal
                            offset={0}
                            open={this.state.open}
                            modalDidOpen={() => console.log('蓝牙提示框开启')}
                            modalDidClose={() => this.setState({open: false})}
                            style={{alignItems: 'center'}}>
                            <View>
                                <Text style={{fontSize: 20, marginBottom: 10}}>蓝牙未开启，请开启蓝牙!</Text>
                                <TouchableOpacity
                                    style={{margin: 5}}
                                    onPress={() => this.setState({open: false})}>
                                    <Text>好的</Text>
                                </TouchableOpacity>
                            </View>
                        </Modal>
                    </View>
                </View>
            )
        return null
    }

    render() {
        return (
            <ImageBackground source={require('../statics/images/bg.jpg')} style={styles.container}>
                {/*<Header {...this.props}/>*/}
                <Main {...this.props} 
                    onDisconnect={this._disconnectAction.bind(this)} 
                    onConnect={this._connectAction.bind(this)} 
                    adjustAction={this._adjustAction.bind(this)} 
                    logAction={this._logAction.bind(this)} 
                    rebootAction={this._rebootAction.bind(this).bind(this)} 
                    clearDataAction={this._clearDataAction}
                    lastDeviceId={"TODO"} 
                    isVisible={this.state.isVisible}
                />
                {this.renderBleAlert()}
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

