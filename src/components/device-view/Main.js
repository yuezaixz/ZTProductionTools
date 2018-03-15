import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    AsyncStorage,
    TouchableHighlight,
    Dimensions, NativeEventEmitter, NativeModules
} from 'react-native';
import {Theme} from "../../styles";
import * as util from "../../utils/InsoleUtils"
import * as StorageKeys from '../../constants/StorageKeys'

import NotificationCenter from '../../public/Com/NotificationCenter/NotificationCenter'
import PillowManager from '../../manager/PillowManager'

let {height, width} = Dimensions.get('window');

class Main extends Component {
    state = {
        logList:[]
    }
    stdVoltage = 3.8
    airPressureThreshold = 10

    handleVoltage = ()=>{
        this.props.actions.startReadVoltage(this.props.device_data.uuid, this.props.device_data.serviceUUID, this.props.device_data.writeUUID)
        this.props.getLoading().show()
    }
    handleReadFAT = ()=>{
        this.props.actions.startReadFAT(this.props.device_data.uuid, this.props.device_data.serviceUUID, this.props.device_data.writeUUID)
        this.props.getLoading().show()
    }
    handleReadFCP = ()=>{
        this.props.actions.startReadFCP(this.props.device_data.uuid, this.props.device_data.serviceUUID, this.props.device_data.writeUUID)
        this.props.getLoading().show()
    }
    handleTestInflat = ()=>{
        this.props.actions.startManual(this.props.device_data.uuid, this.props.device_data.serviceUUID, this.props.device_data.writeUUID)
        this.props.getLoading().show()
    }
    voltageIsPassed = (voltage, stdVoltage)=> {
        return voltage < stdVoltage + 50 && voltage > stdVoltage - 50
    }
    airPressureIsPassed = (airPressure, airPressureThreshold)=> {
        return airPressure > airPressureThreshold
    }
    componentWillMount() {
        AsyncStorage.getItem(StorageKeys.STD_VOLTAGE,function (error, result) {
            if (!error && result) {
                this.stdVoltage = parseInt(result)
            }
        }.bind(this))
        AsyncStorage.getItem(StorageKeys.AIR_PRESSURE_THRESHOLD,function (error, result) {
            if (!error && result) {
                this.airPressureThreshold = parseInt(result)
            }
        }.bind(this))
    }

    readVoltage(data) {
        if (data.voltage) {
            this.props.actions.readVoltage(data.voltage)
        }
        this.props.getLoading().dismiss()
    }

    readLogList(data) {
        if (data.log_list) {
            this.setState({logList:data.log_list})
        }
    }

    readFCP(data) {
        if (data.max && data.min) {
            this.props.actions.readFCP(data.max, data.min)
        }
        this.props.getLoading().dismiss()
    }

    completeInflate() {
        this.props.actions.completeInflate()
        this.props.getLoading().dismiss()
    }

    completeFlate() {
        this.props.actions.completeFlate()
        this.props.getLoading().dismiss()
    }

    recvACK() {
        //根据当前状态判断是什么操作的接受成功
        if (this.props.device_data.isReadingFAT) {
            this.props.actions.successReadRAT()
            this.props.getLoading().dismiss()
        } else if (this.props.device_data.isStartingManual) {
            this.props.actions.successStartManual()
            this.props.actions.startInflate(this.props.device_data.uuid, this.props.device_data.serviceUUID, this.props.device_data.writeUUID)
        } else if (this.props.device_data.isStopingManual) {
            this.props.actions.successStopManual()
            this.props.getLoading().dismiss()
        } else if (this.props.device_data.isStartAdjustSUB) {
            this.props.actions.successStartAdjustSUB()
            this.props.actions.startAdjust(this.props.device_data.uuid, this.props.device_data.serviceUUID, this.props.device_data.writeUUID)
        } else if (this.props.device_data.isStartAdjust) {
            this.props.actions.successStartAdjust()
            // 写命令去开始校准
            this.props.navigation.navigate('Adjust')
            setTimeout((()=>{this.props.getLoading().dismiss()}).bind(this),100)//100ms后在结束loading
        }
    }

    disconnectHandle(){
        // console.log('recive loseConnecting')
        // this.props.getLoading().show('重连中')
    }

    reconnectHandle(){
        // console.log('recive reconnect')
        // this.props.getLoading().dismiss()
    }

    componentDidMount() {
        this.voltageListener = NotificationCenter.createListener(NotificationCenter.name.deviceData.log_list, this.readLogList.bind(this), '');
        this.voltageListener = NotificationCenter.createListener(NotificationCenter.name.deviceData.voltage, this.readVoltage.bind(this), '');
        this.readFCPListener = NotificationCenter.createListener(NotificationCenter.name.deviceData.readFCP, this.readFCP.bind(this), '');
        this.completeInflateListener = NotificationCenter.createListener(NotificationCenter.name.deviceData.completeInflate, this.completeInflate.bind(this), '');
        this.completeFlateListener = NotificationCenter.createListener(NotificationCenter.name.deviceData.completeFlate, this.completeFlate.bind(this), '');
        this.recvACKListener = NotificationCenter.createListener(NotificationCenter.name.deviceData.recvACK, this.recvACK.bind(this), '');
        this.disconnectListener = NotificationCenter.createListener(NotificationCenter.name.search.loseConnecting, this.disconnectHandle.bind(this), '');
        this.reconnectListener = NotificationCenter.createListener(NotificationCenter.name.search.reconnect, this.reconnectHandle.bind(this), '');
    }
    componentWillUnmount() {
        NotificationCenter.removeListener(this.voltageListener);
        NotificationCenter.removeListener(this.completeInflateListener);
        NotificationCenter.removeListener(this.completeFlateListener);
        NotificationCenter.removeListener(this.recvACKListener);
        NotificationCenter.removeListener(this.readFCPListener);
        NotificationCenter.removeListener(this.disconnectListener);
        NotificationCenter.removeListener(this.reconnectListener);
    }
    componentDidUpdate () {
        if (!this.props.device_data.uuid) {//断开成功
            this.props.navigation.goBack()
        }
    }
    manualStatusStr(data) {
        if(data.isStartingManual) {
            return "准备开始测试中"
        } else if(data.isInflate) {
            return "充气中"
        } else if(data.isFlate) {
            return "放气中"
        } else if(data.isStopingManual) {
            return "完成测试中"
        } else if(data.hadInflateTest) {
            return "已测试"
        }
    }
    renderLogList(){
        if(!this.state.logList){ return null}
        return this.state.logList.map((item, idx) => {
            return <Text key={"key"+idx} style={styles.log_text}>{""+(idx+1)+"."+item}</Text>;
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.voltage_block}>
                    <View style={styles.block_line} />
                    <Text style={styles.block_title}>电压测试</Text>
                    <View style={styles.block_main} >
                        <Text style={[styles.block_main_text,this.props.device_data.voltage?(this.voltageIsPassed(parseInt(this.props.device_data.voltage),this.stdVoltage*1000)?styles.text_passed:styles.text_fail):null]}>
                            电压:{this.props.device_data.voltage || '--'}mV
                        </Text>
                        <TouchableHighlight
                            activeOpacity={Theme.active.opacity}
                            underlayColor='transparent'
                            style={[styles.block_main_button,styles.block_main_button_right]}
                            onPress={this.handleVoltage.bind(this)}>
                            <Text style={[styles.block_main_button_text]}>
                                读取
                            </Text>
                        </TouchableHighlight>
                    </View>
                </View>
                <View style={styles.base_block}>
                    <View style={styles.block_line} />
                    <Text style={[styles.block_title,styles.block_title_long]}>板级基本功能测试</Text>
                    <View style={styles.block_main} >
                        <Text style={styles.block_main_text}>{this.props.device_data.hadFATTest ? '已':'未'}测试</Text>
                        <TouchableHighlight
                            activeOpacity={Theme.active.opacity}
                            underlayColor='transparent'
                            style={[styles.block_main_button,styles.block_main_button_right,{width:140}]}
                            onPress={this.handleReadFAT}>
                            <Text style={[styles.block_main_button_text]}>
                                板级功能测试
                            </Text>
                        </TouchableHighlight>
                    </View>
                </View>
                <View style={styles.air_pressure_block}>
                    <View style={styles.block_line} />
                    <Text style={[styles.block_title,styles.block_title_long]}>气压校准功能测试</Text>
                    <View style={[styles.block_main,styles.block_main_big]} >
                        <Text style={[styles.block_main_text,{flex:1},this.props.device_data.fcpMax?(this.airPressureIsPassed((this.props.device_data.fcpMax?(parseInt(this.props.device_data.fcpMax)-parseInt(this.props.device_data.fcpMin)):0),this.airPressureThreshold)?styles.text_passed:styles.text_fail):null]}>
                            差值：{this.props.device_data.isReadingFCP?"检测中，请稍等":(this.props.device_data.fcpMax?(parseInt(this.props.device_data.fcpMax)-parseInt(this.props.device_data.fcpMin)):"--")}
                        </Text>
                        <Text style={[styles.block_main_text,{flex:1,textAlign:'center'}]}>峰值：{this.props.device_data.fcpMax || "--"}</Text>
                        <Text style={[styles.block_main_text,{flex:1,textAlign:'right'}]}>谷值：{this.props.device_data.fcpMin || "--"}</Text>
                        <TouchableHighlight
                            activeOpacity={Theme.active.opacity}
                            underlayColor='transparent'
                            style={[styles.block_main_button,styles.block_main_button_right,{width:140,top:40}]}
                            onPress={this.handleReadFCP}>
                            <Text style={[styles.block_main_button_text]}>
                                气压校准
                            </Text>
                        </TouchableHighlight>
                    </View>
                </View>
                <View style={styles.log_block} >
                    {this.renderLogList()}
                </View>
                {/*<View style={styles.inout_flate_block}>*/}
                    {/*<View style={styles.block_line} />*/}
                    {/*<Text style={[styles.block_title,styles.block_title_middle]}>充放气功能测试</Text>*/}
                    {/*<View style={styles.block_main} >*/}
                        {/*<Text style={styles.block_main_text}>{this.manualStatusStr(this.props.device_data)}</Text>*/}
                        {/*<TouchableHighlight*/}
                            {/*activeOpacity={Theme.active.opacity}*/}
                            {/*underlayColor='transparent'*/}
                            {/*style={[styles.block_main_button,styles.block_main_button_right,{width:140}]}*/}
                            {/*onPress={this.handleTestInflat}>*/}
                            {/*<Text style={[styles.block_main_button_text]}>*/}
                                {/*充放气测试*/}
                            {/*</Text>*/}
                        {/*</TouchableHighlight>*/}
                    {/*</View>*/}
                {/*</View>*/}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex:8
    },
    voltage_block: {
        flex:2
    },
    base_block: {
        flex:2
    },
    air_pressure_block: {
        flex:3
    },
    inout_flate_block: {
        flex:2
    },
    log_block: {
        flex:4
    },
    block_title: {
        flex:1,
        width:80,
        backgroundColor: '#FFFFFF',
        alignSelf:'center',
        textAlign:'center'
    },
    block_title_middle: {
        width:120
    },
    block_title_long: {
        width:140
    },
    block_line: {
        backgroundColor: '#000000',
        position: 'absolute',
        top:7,
        left: 20,
        height:1,
        right:20
    },
    block_main: {
        flex:3,
        flexDirection:'row',
        paddingLeft:30,
        paddingRight:30,
        paddingTop:10
    },
    block_main_big: {
        flex:4.7
    },
    block_main_text: {
        fontSize:17
    },
    log_text: {
        fontSize:14
    },
    block_main_button: {
        backgroundColor:'#D8D8D8',
        borderColor:'#979797',
        borderWidth:1
    },
    block_main_button_right: {
        position:'absolute',
        top:0,
        right:30,
        width:70,
        height:35,
        justifyContent: 'center',
        alignItems: 'center',
    },
    block_main_button_text: {
        fontSize:17,
        color:'#000000',
    },
    shadow_btn: {
        width: 50,
        height: 30,
        borderWidth:1,
        borderRadius:10,
        backgroundColor:'#AAAAAA',
        position:'absolute',
        right:20,
        alignItems:'center',
        justifyContent:'center'
    },
    insole_info: {
        paddingTop:20,
        height: 60,
        width:width
    },
    text_passed: {
        color:'#7ED321'
    },
    text_fail: {
        color: '#E85613'
    },
    title: {
        textAlign: 'center',
        fontSize: 17,
        position:'relative'
    }
});

export default Main;