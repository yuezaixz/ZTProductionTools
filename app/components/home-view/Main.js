import React, {Component} from 'react';

import {
    StyleSheet,
    View,
    ScrollView
} from 'react-native';
import StatusView from '../../common/StatusView';
import DeviceListItem from '../../base/ListItem/DeviceListItem';

class Main extends Component {

    renderList  = () =>{
        const { device_data } = this.props;
        if(!device_data || !device_data.device_list){ return null}

        return device_data.device_list.map((item, idx) => {
            return <DeviceListItem {...this.props}
                             name={item.name}
                             uuid={item.uuid}
                             key={item.uuid+idx}
                             rssi={item.rssi}
                             data={item}
                             isLast={idx==device_data.device_list.length-1}/>;
        });
    }

    renderBody = () => {
        const { device_data } = this.props;
        if (device_data.isSearching) {
            return this.renderList()
        } else {
            return (
                <View>
                
                </View>
            )
        }
    }

    renderDevice = () => {
        const { device_data } = this.props;

        return (
            <View>

            </View>
        )
    }

    componentWillMount() {

    }
    componentDidUpdate () {
        if (!this.props.isVisible) {
            return;
        }
    }
    render() {
        return (
            <View style={styles.container}>
                <StatusView {...this.props}></StatusView>

                <ScrollView style={styles.body}>
                    {this.renderBody()}
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    body: {
    }
});

export default Main;
