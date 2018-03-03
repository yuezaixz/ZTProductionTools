import React, {Component} from 'react';

import {
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    Image,
    Alert
} from 'react-native';
import {Theme, BasicStyle} from '../../styles';

class ListItem extends Component {
    handleConnect = ()=>{
        if (this.props.home_data.isConnecting) {
            //todo 提示连接中，请稍等
            return;
        }
        if (this.props.home_data.uuid == this.props.data.uuid) {
            return;
        }
        this.props.actions.stopSearchDevice()
        this.props.actions.startDeviceConnect(this.props.data);
    }
    render() {
        return (
            <View style={[styles.container, {borderBottomWidth: this.props.isLast?0:1}]}>
                <TouchableHighlight
                    activeOpacity={Theme.active.opacity}
                    underlayColor='transparent'
                    style={styles.body}
                    onPress={this.handleConnect}>
                    <Text style={BasicStyle.text}>{this.props.data.name}</Text>
                </TouchableHighlight>
                <Text style={styles.timer}>{this.props.home_data.isConnecting && this.props.home_data.connecting_uuid==this.props.data.uuid?'连接中':(this.props.data.uuid==this.props.home_data.uuid?'已连接':this.props.data.rssi)}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: Theme.color.brown
    },
    body: {
        flex: 1,
        padding: 15,
    },
    btnIcon: {
        width: 24,
        height: 24
    },
    timer: {
        fontSize: 12,
        fontStyle: 'italic'
    }
});

export default ListItem;
