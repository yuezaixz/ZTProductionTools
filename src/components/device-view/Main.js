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

let that = null

class Main extends Component {
    handleVoltage = ()=>{
        this.props.actions.startReadVoltage(this.props.device_data.uuid, this.props.device_data.serviceUUID, this.props.device_data.writeUUID)
    }
    componentDidMount() {
        that = this
        this.handlerUpdate = bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', this.handleUpdateValueForCharacteristic );
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
        if (that.props.device_data.uuid == data.peripheral) {
            if (util.startWith(dataStr, "Batt")) {
                var voltage = dataStr.substring(7,dataStr.length-2)
                that.props.actions.readVoltage(voltage)
            }
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
                        <Text style={styles.block_main_text}>未测试</Text>
                        <TouchableHighlight
                            activeOpacity={Theme.active.opacity}
                            underlayColor='transparent'
                            style={[styles.block_main_button,styles.block_main_button_right,{width:140}]}
                            onPress={this.handleNext}>
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
                        <Text style={[styles.block_main_text,{flex:1}]}>差值：10</Text>
                        <Text style={[styles.block_main_text,{flex:1,textAlign:'center'}]}>峰值：10</Text>
                        <Text style={[styles.block_main_text,{flex:1,textAlign:'right'}]}>谷值：10</Text>
                        <TouchableHighlight
                            activeOpacity={Theme.active.opacity}
                            underlayColor='transparent'
                            style={[styles.block_main_button,styles.block_main_button_right,{width:140,top:40}]}
                            onPress={this.handleNext}>
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
                        <Text style={styles.block_main_text}>未测试</Text>
                        <TouchableHighlight
                            activeOpacity={Theme.active.opacity}
                            underlayColor='transparent'
                            style={[styles.block_main_button,styles.block_main_button_right,{width:140}]}
                            onPress={this.handleNext}>
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
