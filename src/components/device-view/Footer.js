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
    handleDisconnect = ()=>{
        this.props.actions.deviceDisconnect(this.props.device_data.uuid);
    }
    render() {
        return (
            <TouchableHighlight
                activeOpacity={Theme.active.opacity}
                underlayColor='transparent'
                onPress={this.handleDisconnect}>
                <View style={styles.container}>
                    <Text style={[styles.text, styles.title]}>
                        断开连接
                    </Text>
                </View>
            </TouchableHighlight>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: width,
        height: 40,
        borderWidth:1,
        borderRadius:10,
        backgroundColor:'#AAAAAA',
        position:'absolute',
        bottom:20,
        alignItems:'center',
        justifyContent:'center'
    },
    text: {
        color: '#E85613'
    },
    title: {
        textAlign: 'center',
        fontSize: 20,
        position:'relative'
    }
});

export default Footer;
