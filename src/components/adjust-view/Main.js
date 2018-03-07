import React, {Component} from 'react';

import {
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    Image,
    Dimensions,
    ScrollView
} from 'react-native';
import {Theme} from "../../styles";

class Main extends Component {
    handleSensorAdjust(index) {
        this.props.actions.sensorAdjust(this.props.device_data.uuid, this.props.device_data.serviceUUID, this.props.device_data.writeUUID, index)
    }
    componentDidUpdate () {

    }
    colorStyle(index) {
        if ((this.props.device_data.completeSensorIndex || new Set([])).has(index)) {
            return styles.row_button_text_done
        } else if ((this.props.device_data.errorSensorIndex || new Set([])).has(index)) {
            return styles.row_button_text_error
        } else {
            return styles.row_button_text_color
        }
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={[styles.row]}>
                    <TouchableHighlight
                        activeOpacity={Theme.active.opacity}
                        underlayColor='transparent'
                        style={[styles.row_start, styles.row_button]}
                        onPress={() => {this.handleSensorAdjust(0)}}>
                        <Text style={[styles.row_button_text,this.colorStyle(0)]}>
                            1
                        </Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                        activeOpacity={Theme.active.opacity}
                        underlayColor='transparent'
                        style={[styles.row_start, styles.row_button]}
                        onPress={() => {this.handleSensorAdjust(8)}}>
                        <Text style={[styles.row_button_text,this.colorStyle(8)]}>
                            9
                        </Text>
                    </TouchableHighlight>
                </View>
                <View style={[styles.row]}>
                    <TouchableHighlight
                        activeOpacity={Theme.active.opacity}
                        underlayColor='transparent'
                        style={[styles.row_start, styles.row_button]}
                        onPress={() => {this.handleSensorAdjust(1)}}>
                        <Text style={[styles.row_button_text,this.colorStyle(1)]}>
                            2
                        </Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                        activeOpacity={Theme.active.opacity}
                        underlayColor='transparent'
                        style={[styles.row_start, styles.row_button]}
                        onPress={() => {this.handleSensorAdjust(9)}}>
                        <Text style={[styles.row_button_text,this.colorStyle(9)]}>
                            10
                        </Text>
                    </TouchableHighlight>
                </View>
                <View style={[styles.row]}>
                    <TouchableHighlight
                        activeOpacity={Theme.active.opacity}
                        underlayColor='transparent'
                        style={[styles.row_start, styles.row_button]}
                        onPress={() => {this.handleSensorAdjust(2)}}>
                        <Text style={[styles.row_button_text,this.colorStyle(2)]}>
                            3
                        </Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                        activeOpacity={Theme.active.opacity}
                        underlayColor='transparent'
                        style={[styles.row_start, styles.row_button]}
                        onPress={() => {this.handleSensorAdjust(10)}}>
                        <Text style={[styles.row_button_text,this.colorStyle(10)]}>
                            11
                        </Text>
                    </TouchableHighlight>
                </View>
                <View style={[styles.row]}>
                    <TouchableHighlight
                        activeOpacity={Theme.active.opacity}
                        underlayColor='transparent'
                        style={[styles.row_start, styles.row_button]}
                        onPress={() => {this.handleSensorAdjust(3)}}>
                        <Text style={[styles.row_button_text,this.colorStyle(3)]}>
                            4
                        </Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                        activeOpacity={Theme.active.opacity}
                        underlayColor='transparent'
                        style={[styles.row_start, styles.row_button]}
                        onPress={() => {this.handleSensorAdjust(11)}}>
                        <Text style={[styles.row_button_text,this.colorStyle(11)]}>
                            12
                        </Text>
                    </TouchableHighlight>
                </View>
                <View style={[styles.row]}>
                    <TouchableHighlight
                        activeOpacity={Theme.active.opacity}
                        underlayColor='transparent'
                        style={[styles.row_start, styles.row_button]}
                        onPress={() => {this.handleSensorAdjust(4)}}>
                        <Text style={[styles.row_button_text,this.colorStyle(4)]}>
                            5
                        </Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                        activeOpacity={Theme.active.opacity}
                        underlayColor='transparent'
                        style={[styles.row_start, styles.row_button]}
                        onPress={() => {this.handleSensorAdjust(12)}}>
                        <Text style={[styles.row_button_text,this.colorStyle(12)]}>
                            13
                        </Text>
                    </TouchableHighlight>
                </View>
                <View style={[styles.row]}>
                    <TouchableHighlight
                        activeOpacity={Theme.active.opacity}
                        underlayColor='transparent'
                        style={[styles.row_start, styles.row_button]}
                        onPress={() => {this.handleSensorAdjust(5)}}>
                        <Text style={[styles.row_button_text,this.colorStyle(5)]}>
                            6
                        </Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                        activeOpacity={Theme.active.opacity}
                        underlayColor='transparent'
                        style={[styles.row_start, styles.row_button]}
                        onPress={() => {this.handleSensorAdjust(13)}}>
                        <Text style={[styles.row_button_text,this.colorStyle(13)]}>
                            14
                        </Text>
                    </TouchableHighlight>
                </View>
                <View style={[styles.row]}>
                    <TouchableHighlight
                        activeOpacity={Theme.active.opacity}
                        underlayColor='transparent'
                        style={[styles.row_start, styles.row_button]}
                        onPress={() => {this.handleSensorAdjust(6)}}>
                        <Text style={[styles.row_button_text,this.colorStyle(6)]}>
                            7
                        </Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                        activeOpacity={Theme.active.opacity}
                        underlayColor='transparent'
                        style={[styles.row_start, styles.row_button]}
                        onPress={() => {this.handleSensorAdjust(14)}}>
                        <Text style={[styles.row_button_text,this.colorStyle(14)]}>
                            15
                        </Text>
                    </TouchableHighlight>
                </View>
                <View style={[styles.row]}>
                    <TouchableHighlight
                        activeOpacity={Theme.active.opacity}
                        underlayColor='transparent'
                        style={[styles.row_start, styles.row_button]}
                        onPress={() => {this.handleSensorAdjust(7)}}>
                        <Text style={[styles.row_button_text,this.colorStyle(7)]}>
                            8
                        </Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                        activeOpacity={Theme.active.opacity}
                        underlayColor='transparent'
                        style={[styles.row_start, styles.row_button]}
                        onPress={() => {this.handleSensorAdjust(15)}}>
                        <Text style={[styles.row_button_text,this.colorStyle(15)]}>
                            16
                        </Text>
                    </TouchableHighlight>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 8,
        paddingBottom:20
    },
    row: {
        flex:1,
        flexDirection:'row',
    },
    row_start: {
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    row_end: {
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    row_button_text: {
        textAlign:'center'
    },
    row_button_text_color: {
        color:'#000000'
    },

    row_button_text_error: {
        color:'#d33131'
    },
    row_button_text_done: {
        color:'#7ED321'
    },
    row_button: {
        backgroundColor:'#D8D8D8',
        borderColor:'#979797',
        borderWidth:1,
        borderRadius:4,
        marginLeft:25,
        marginRight:25,
        marginTop:5,
        marginBottom:10
    }
});

export default Main;
