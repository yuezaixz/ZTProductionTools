import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableHighlight,
    Dimensions, NativeEventEmitter, NativeModules
} from 'react-native';
import {Theme} from "../../styles";
import * as util from "../../utils/InsoleUtils"


const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

let {height, width} = Dimensions.get('window');

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

class Main extends Component {
    handleVoltage = ()=>{
        this.props.actions.startReadVoltage(this.props.device_data.uuid, this.props.device_data.serviceUUID, this.props.device_data.writeUUID)
    }
    handleReadFAT = ()=>{
        this.props.actions.startReadFAT(this.props.device_data.uuid, this.props.device_data.serviceUUID, this.props.device_data.writeUUID)
    }
    handleReadFCP = ()=>{
        this.props.actions.startReadFCP(this.props.device_data.uuid, this.props.device_data.serviceUUID, this.props.device_data.writeUUID)
    }
    handleTestInflat = ()=>{
        this.props.actions.startManual(this.props.device_data.uuid, this.props.device_data.serviceUUID, this.props.device_data.writeUUID)
    }
    componentDidMount() {
        this.handlerUpdate = bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', this.handleUpdateValueForCharacteristic.bind(this) );
    }
    componentWillUnmount() {
        this.handlerUpdate.remove();
    }
    componentDidUpdate () {
        if (!this.props.device_data.uuid) {//断开成功
            this.props.navigation.goBack()
        }
    }
    handleUpdateValueForCharacteristic(data) {
        console.log('Received data from ' + data.peripheral + ' text ' + data.text + ' characteristic ' + data.characteristic, data.value);
        var datas = data.value
        var dataStr = util.arrayBufferToBase64Str(datas)
        console.log(dataStr)
        if (this.props.device_data.uuid == data.peripheral) {
            if (util.startWith(dataStr, "Batt")) {
                var voltage = dataStr.substring(7,dataStr.length-2)
                this.props.actions.readVoltage(voltage)
            } else if (util.startWith(dataStr, "Reached Side Line")) {//充气成功
                this.props.actions.completeInflate()
                this.props.actions.startFlate(this.props.device_data.uuid, this.props.device_data.serviceUUID, this.props.device_data.writeUUID)
            } else if (util.startWith(dataStr, "Reached Flat Line")) {//放气成功
                this.props.actions.completeFlate()
                this.props.actions.stopManual(this.props.device_data.uuid, this.props.device_data.serviceUUID, this.props.device_data.writeUUID)
            } else if (util.startWith(dataStr, "\\*5S")) {
                var index = indexMap[dataStr.substring(3,5)]
                var isSuccess = indexMap[dataStr.substring(6,7)] === '1'
                if (isSuccess) {
                    this.props.actions.successSensorAdjust(index)
                    if (index == 15) {
                        this.props.actions.stopAdjust(this.props.device_data.uuid, this.props.device_data.serviceUUID, this.props.device_data.writeUUID)
                    } else {
                        this.props.actions.sensorAdjust(this.props.device_data.uuid, this.props.device_data.serviceUUID, this.props.device_data.writeUUID,index+1)//校准下一个
                    }
                } else {
                    //TODO 失败
                }

            } else if (util.startWith(dataStr, "PUMP TH:")) {
                var min = parseInt(dataStr.substring(8,10))
                var max = parseInt(dataStr.substring(12,14))
                this.props.actions.readFCP(max, min)
            } else if (util.startWith(dataStr, "Recv ACK")) {
                if (this.props.device_data.isReadingFAT) {
                    this.props.actions.successReadRAT()
                } else if (this.props.device_data.isStartingManual) {
                    this.props.actions.successStartManual()
                    this.props.actions.startInflate(this.props.device_data.uuid, this.props.device_data.serviceUUID, this.props.device_data.writeUUID)
                } else if (this.props.device_data.isStopingManual) {
                    this.props.actions.successStopManual()
                } else if (this.props.device_data.isStartAdjustSUB) {
                    this.props.actions.successStartAdjustSUB()
                    this.props.actions.startAdjust(this.props.device_data.uuid, this.props.device_data.serviceUUID, this.props.device_data.writeUUID)
                } else if (this.props.device_data.isStopAdjustSUB) {//TODO 这个是在下个页面的操作
                    this.props.actions.successStopAdjustSUB()
                    //TODO 提示成功
                } else if (this.props.device_data.isStartAdjust) {
                    this.props.actions.successStartAdjust()
                    //TODO 跳转下个页面
                } else if (this.props.device_data.isStopAdjust) {//TODO 这个是在下个页面的操作
                    this.props.actions.successStopAdjust()
                    this.props.actions.stopAdjustSUB(this.props.device_data.uuid, this.props.device_data.serviceUUID, this.props.device_data.writeUUID)
                }
            }
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

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.voltage_block}>
                    <View style={styles.block_line} />
                    <Text style={styles.block_title}>电压测试</Text>
                    <View style={styles.block_main} >
                        <Text style={styles.block_main_text}>电压:{this.props.device_data.voltage || '--'}mV</Text>
                        <TouchableHighlight
                            activeOpacity={Theme.active.opacity}
                            underlayColor='transparent'
                            style={[styles.block_main_button,styles.block_main_button_right]}
                            onPress={this.handleVoltage}>
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
                        <Text style={[styles.block_main_text,{flex:1}]}>
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
                <View style={styles.inout_flate_block}>
                    <View style={styles.block_line} />
                    <Text style={[styles.block_title,styles.block_title_middle]}>充放气功能测试</Text>
                    <View style={styles.block_main} >
                        <Text style={styles.block_main_text}>{this.manualStatusStr(this.props.device_data)}</Text>
                        <TouchableHighlight
                            activeOpacity={Theme.active.opacity}
                            underlayColor='transparent'
                            style={[styles.block_main_button,styles.block_main_button_right,{width:140}]}
                            onPress={this.handleTestInflat}>
                            <Text style={[styles.block_main_button_text]}>
                                充放气测试
                            </Text>
                        </TouchableHighlight>
                    </View>
                </View>
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
    text: {
        color: '#E85613'
    },
    title: {
        textAlign: 'center',
        fontSize: 17,
        position:'relative'
    }
});

export default Main;