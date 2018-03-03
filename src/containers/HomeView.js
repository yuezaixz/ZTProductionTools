import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Platform,
    PermissionsAndroid,
    NativeEventEmitter,
    NativeModules, Dimensions
} from 'react-native';
import Modal from 'react-native-simple-modal';
import BleManager from 'react-native-ble-manager';
let {height, width} = Dimensions.get('window');

import {
    Header,
    Main,
    Footer,
} from '../components/home-view';
import Actions from '../actions';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

class HomeView extends Component {
    isFirst = true
    state = {open: true};
    constructor(props){
        super(props);
        this.state = {isVisible: true}
    }
    componentDidMount() {
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
    render() {
        return (
            <View style={styles.container}>
                <Header {...this.props}/>
                <Main {...this.props} isVisible={this.state.isVisible}/>
                <Footer {...this.props}/>

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
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF'
    }
});

function mapStateToProps(state) {
    return {
        home_data: state.home
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

