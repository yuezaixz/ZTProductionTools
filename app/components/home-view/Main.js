import React, {Component} from 'react';

import {
    StyleSheet,
    View,
    ScrollView,
    Image,
    TouchableHighlight,
    Text
} from 'react-native';
import StatusView from '../../common/StatusView';
import DeviceListItem from '../../base/ListItem/DeviceListItem';
import {Theme, BasicStyle} from '../../styles';

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
                <View style={styles.device} >
                    <View style={[styles.deviceItem,BasicStyle.rowFlex, BasicStyle.flexAllCenter]} >
                        <Text style={styles.deviceItemTitle}>仰卧时长</Text>
                        <Text style={styles.deviceItemContent}>{device_data.flatTime}</Text>
                    </View>
                    <View style={[styles.deviceItem,BasicStyle.rowFlex, BasicStyle.flexAllCenter]}>
                        <Text style={styles.deviceItemTitle}>侧卧时长</Text>
                        <Text style={styles.deviceItemContent}>{device_data.slideTime}</Text>
                    </View>
                    <View style={[styles.deviceItem,BasicStyle.rowFlex, BasicStyle.flexAllCenter]}>
                        <Text style={styles.deviceItemTitle}>翻身次数</Text>
                        <Text style={styles.deviceItemContent}>{device_data.rollCount || '--'+'次'}</Text>
                    </View>
                    <View style={[styles.deviceItem,BasicStyle.rowFlex, BasicStyle.flexAllCenter]}>
                        <Text style={styles.deviceItemTitle}>睡眠习惯</Text>
                        <Text style={styles.deviceItemContent}>{device_data.sleepPose}</Text>
                    </View>
                    <TouchableHighlight 
                        activeOpacity={Theme.active.opacity}
                        underlayColor='transparent'
                        onPress={this.props.adjustAction}
                        style={[styles.deviceItem, BasicStyle.flexAllCenter]}>
                        <View style={[BasicStyle.rowFlex, BasicStyle.flexAllCenter]}>
                            <Text style={styles.deviceItemTitle}>调整侧卧高度</Text>
                            <Image style={styles.deviceItemArrow} source={require('../../statics/images/arrow_right.png')} ></Image>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight 
                        activeOpacity={Theme.active.opacity}
                        underlayColor='transparent'
                        onPress={this.props.rebootAction}
                        style={[styles.deviceItem, BasicStyle.flexAllCenter]}>
                        <View style={[BasicStyle.rowFlex, BasicStyle.flexAllCenter]}>
                            <Text style={styles.deviceItemTitle}>重启枕头</Text>
                            <Image style={styles.deviceItemArrow} source={require('../../statics/images/arrow_right.png')} ></Image>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight 
                        activeOpacity={Theme.active.opacity}
                        underlayColor='transparent'
                        onPress={this.props.clearDataAction}
                        style={[styles.deviceItem, BasicStyle.flexAllCenter]}>
                        <View style={[BasicStyle.rowFlex, BasicStyle.flexAllCenter]} >
                            <Text style={styles.deviceItemTitle}>数据清零</Text>
                            <Image style={styles.deviceItemArrow} source={require('../../statics/images/arrow_right.png')} ></Image>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight 
                        activeOpacity={Theme.active.opacity}
                        underlayColor='transparent'
                        onPress={this.props.logAction}
                        style={[styles.deviceItem, BasicStyle.flexAllCenter]}>
                        <View style={[BasicStyle.rowFlex, BasicStyle.flexAllCenter]}>
                            <Text style={styles.deviceItemTitle}>日志(协助研发)</Text>
                            <Image style={styles.deviceItemArrow} source={require('../../statics/images/arrow_right.png')} ></Image>
                        </View>
                    </TouchableHighlight>

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
    },
    deviceItem: {
        height: 60,
        marginLeft: 5,
        marginRight: 5,
        paddingTop: 5,
        paddingBottom: 5,
        borderBottomWidth: 1,
        borderBottomColor: Theme.color.separatorColor,
    },
    deviceItemTitle: {
        flex: 3,
        paddingLeft: Theme.constant.leftRightPadding,
        textAlign: 'left',
        ...Theme.font.common,
    },
    deviceItemContent: {
        paddingRight: Theme.constant.leftRightPadding,
        flex: 1,
        textAlign: 'right',
        ...Theme.font.common

    },
    deviceItemArrow: {
        marginRight: Theme.constant.leftRightPadding,
        width: 14,
        height: 30,
        resizeMode: 'stretch',
    }
});

export default Main;
