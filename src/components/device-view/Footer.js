import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableHighlight,
    Dimensions
} from 'react-native';
import {Theme} from "../../styles";

let {height, width} = Dimensions.get('window');

class Footer extends Component {
    handleNext = ()=>{
        if (!this.props.device_data.isStartAdjust || !this.props.device_data.isStartAdjustSUB) {//防止多次发送
            this.props.getLoading().show()
            this.props.actions.startAdjustSUB(this.props.device_data.uuid, this.props.device_data.serviceUUID, this.props.device_data.writeUUID)
        }
    }
    render() {
        return (
            <View style={styles.container}>
            <TouchableHighlight
                activeOpacity={Theme.active.opacity}
                underlayColor='transparent'
                style={{flex:1}}
                onPress={this.handleNext.bind(this)}>
                <View style={styles.buttonContainer} >
                    <Text style={[this.props.device_data.hadFATTest&&this.props.device_data.voltage?styles.text:styles.textDisable, styles.title]}>
                        下一步（传感器校准）
                    </Text>
                </View>
            </TouchableHighlight>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        justifyContent:'center'
    },
    bottom: {

    },
    text: {
        color: '#7ED321'
    },
    textDisable: {
        color: '#777777'
    },
    buttonContainer: {
        position:'absolute',
        top:10,
        bottom:10,
        left:10,
        right:10,
        backgroundColor:'#D8D8D8',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth:1,
        borderColor:'#979797',
        borderRadius:4
    },
    title: {
        textAlign: 'center',
        fontSize: 20
    }
});

export default Footer;
