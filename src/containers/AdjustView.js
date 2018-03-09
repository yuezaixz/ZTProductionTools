import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Dimensions, NativeEventEmitter, NativeModules
} from 'react-native';
import {
    Header,
    Main,
    Footer,
} from '../components/adjust-view';
import Actions from '../actions';
import * as util from "../utils/InsoleUtils";
import Button from '../components/common/Button'

let {height, width} = Dimensions.get('window');
const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

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

class AdjustView extends Component {
    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params || {};

        return {
            title:"传感器校准",
            headerLeft: (
                <Button onPress={params.backAction} style={{width:60}} textStyle={{fontSize:14,textAlign:'center'}} title="返回" />
            ),
        };
    };

    _backAction(){
        this.props.navigation.pop()
    }

    constructor(props){
        super(props);
        this.state = {isVisible: true}
    }
    componentWillMount() {
        this.props.navigation.setParams({ backAction: this._backAction.bind(this) });
        this.props.navigation.addListener(
            'didFocus',
            payload => {
                this.handlerUpdate = bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', this.handleUpdateValueForCharacteristic.bind(this) );
            }
        );
        this.props.navigation.addListener(
            'willBlur',
            payload => {
                this.handlerUpdate = bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', this.handleUpdateValueForCharacteristic.bind(this) );
            }
        );
    }
    componentDidMount() {

    }
    componentWillUnmount(){

    }
    handleUpdateValueForCharacteristic(data) {
        console.log('Received data from ' + data.peripheral + ' text ' + data.text + ' characteristic ' + data.characteristic, data.value);
        var datas = data.value
        var dataStr = util.arrayBufferToBase64Str(datas)
        console.log(dataStr)
        if (this.props.device_data.uuid == data.peripheral) {
            if (util.startWith(dataStr, "\\*5S")) {
                var index = indexMap[dataStr.substring(3,5)]
                var isSuccess = indexMap[dataStr.substring(6,7)] === '1'
                this.props.actions.successSensorAdjust(index, isSuccess)
                if (index == 15) {
                    // 不能自动去结束，要等他手动操作
                    // this.props.actions.stopAdjust(this.props.device_data.uuid, this.props.device_data.serviceUUID, this.props.device_data.writeUUID)
                } else {
                    //不需要自动校准下一个
                    // this.props.actions.sensorAdjust(this.props.device_data.uuid, this.props.device_data.serviceUUID, this.props.device_data.writeUUID,index+1)//校准下一个
                }

            } else if (util.startWith(dataStr, "Recv ACK")) {
                if (this.props.device_data.isStopAdjustSUB) {
                    this.props.actions.successStopAdjustSUB()
                    //返回主界面,断开连接
                    this.props.actions.deviceDisconnect(this.props.device_data.uuid)
                    this.props.actions.clearDeviceData()
                    //延迟点点
                    setTimeout(()=>{this.props.navigation.popToTop()},100)
                } else if (this.props.device_data.isStopAdjust) {
                    this.props.actions.successStopAdjust()
                    this.props.actions.stopAdjustSUB(this.props.device_data.uuid, this.props.device_data.serviceUUID, this.props.device_data.writeUUID)
                }
            }
        }
    }
    render() {
        return (
            <View style={styles.container}>
                {/*<Header {...this.props}/>*/}
                <Main {...this.props}/>
                <Footer {...this.props}/>
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
        device_data: {...state.device, ...state.home}
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
)(AdjustView);

