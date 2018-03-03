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
import ListItem from './ListItem';

class Main extends Component {
    renderList  = () =>{
        const { home_data } = this.props;
        if(!home_data || !home_data.device_list){ return null}
        return home_data.device_list.map((item, idx) => {
            return <ListItem {...this.props}
                             name={item.name}
                             uuid={item.uuid}
                             key={item.uuid}
                             rssi={item.rssi}
                             data={item}
                             isLast={idx==home_data.device_list.length-1}/>;
        });
    }
    renderLoading = () => {
        if (this.props.home_data.uuid) {
            return (
                <View style={styles.loading}>
                    <Text style={styles.loadingText}>连接成功</Text>
                </View>
            )
        } else if (this.props.home_data.isConnecting) {
            return (
                <View style={styles.loading}>
                    <Text style={styles.loadingText}>连接中...</Text>
                </View>
            )
        } else if (this.props.home_data.isSearching) {
            return (
                <View style={styles.loading}>
                    <Text style={styles.loadingText}>搜索中...</Text>
                </View>
            )
        }
        return null;
    }
    componentDidUpdate () {
        if (this.props.home_data.uuid) {//连接成功，那就跳转了
            this.props.navigation.navigate('Device',{
                uuid: this.props.home_data.uuid,
                name: this.props.home_data.name,
                serviceUUID: this.props.home_data.serviceUUID,
                noitfyUUID: this.props.home_data.noitfyUUID,
                writeUUID: this.props.home_data.writeUUID
            })
        }
    }
    render() {
        return (
            <View style={styles.container}>
                {this.renderLoading()}
                <ScrollView style={styles.list}>
                    {this.renderList()}
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loading: {
        paddingTop: 10,
        alignItems: 'center'
    },
    loadingText: {
        fontSize: 12,
        fontStyle: 'italic'
    },
    list: {
        flex: 1,
        padding: 20
    }
});

export default Main;
