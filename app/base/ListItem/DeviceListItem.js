import React, {Component} from 'react';

import {
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
} from 'react-native';
import {Theme, BasicStyle} from '../../styles';

class DeviceListItem extends Component {
    handleConnect = ()=>{
        if (this.props.onConnect) {
            this.props.onConnect(this.props.data.uuid)
        }
    }
    render() {
        return (
            <View style={[styles.container, {borderBottomWidth: this.props.isLast?0:1}]}>
                <Text style={styles.name}>{this.props.data.localName || this.props.data.name}📡  {this.props.data.rssi}</Text>
                <TouchableHighlight
                    activeOpacity={Theme.active.opacity}
                    underlayColor='transparent'
                    style={styles.body}
                    onPress={this.handleConnect}>
                    <Text style={styles.timer}>点击连接</Text>
                </TouchableHighlight>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        height: 60,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 5,
        marginRight: 5,
        paddingTop: 5,
        paddingBottom: 5,
        borderBottomWidth: 1,
        borderBottomColor: Theme.color.separatorColor
    },
    btnIcon: {
        width: 24,
        height: 24
    },
    name: {
        flex: 3,
        paddingLeft: Theme.constant.leftRightPadding,
        textAlign: 'left',
        ...Theme.font.common
    },
    body: {
        paddingRight: Theme.constant.leftRightPadding,
        flex: 1
    },
    timer: {
        textAlign: 'right',
        ...Theme.font.common
    }
});

export default DeviceListItem;
