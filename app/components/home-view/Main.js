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
import SearchingView from '../../common/SearchingView';
import DeviceListItem from '../../base/ListItem/DeviceListItem';
import {Theme, BasicStyle} from '../../styles';

class Main extends Component {

    renderList  = () =>{
        const { device_data } = this.props;
        if(!device_data || !device_data.device_list){ return null}
        if (device_data.onlyStrong) {
            let deviceItems = []
            if (device_data.strongDevice) {
                deviceItems.push(
                    <DeviceListItem {...this.props}
                        name={device_data.strongDevice.localName || device_data.strongDevice.name}
                        uuid={device_data.strongDevice.uuid}
                        key={device_data.strongDevice.uuid+0}
                        rssi={device_data.strongDevice.rssi}
                        onlyStrong={true}
                        data={device_data.strongDevice}
                        isLast={false}/>
                )
            }
            deviceItems.push(
                <TouchableHighlight
                    activeOpacity={Theme.active.opacity}
                    underlayColor='transparent'
                    key={'moreButton'}
                    onPress={this.props.disOnlyStrong}>
                    <View style={[styles.moreContainer, {borderBottomWidth: this.props.isLast?0:1}]}>
                        <Text style={[styles.moreText]}>
                            Click to search more
                        </Text>
                    </View>
                </TouchableHighlight>
            )
            return deviceItems
        } else {
            return device_data.device_list.map((item, idx) => {
                return <DeviceListItem {...this.props}
                                 name={item.localName || item.name}
                                 uuid={item.uuid}
                                 key={item.uuid+idx}
                                 rssi={item.rssi}
                                 data={item}
                                 isLast={idx==device_data.device_list.length-1}/>;
            });
        }
    }

    renderBody = () => {
        const { device_data } = this.props;
        if (device_data.isSearching) {
            return this.renderList()
        } else {
            return (
                <View style={styles.device} >
                    <View style={[styles.deviceItem,BasicStyle.rowFlex, BasicStyle.flexAllCenter]} >
                        <Text style={styles.deviceItemTitle}>Back time</Text>
                        <Text style={styles.deviceItemContent}>{device_data.flatTime}</Text>
                    </View>
                    <View style={[styles.deviceItem,BasicStyle.rowFlex, BasicStyle.flexAllCenter]}>
                        <Text style={styles.deviceItemTitle}>Side time</Text>
                        <Text style={styles.deviceItemContent}>{device_data.slideTime}</Text>
                    </View>
                    <View style={[styles.deviceItem,BasicStyle.rowFlex, BasicStyle.flexAllCenter]}>
                        <Text style={styles.deviceItemTitle}>Switch times</Text>
                        <Text style={styles.deviceItemContent}>{device_data.rollCount || '0'+'次'}</Text>
                    </View>
                    <View style={[styles.deviceItem,BasicStyle.rowFlex, BasicStyle.flexAllCenter]}>
                        <Text style={styles.deviceItemTitle}>Sleep habits</Text>
                        <Text style={styles.deviceItemContent}>{device_data.sleepPose}</Text>
                    </View>
                    <TouchableHighlight 
                        activeOpacity={Theme.active.opacity}
                        underlayColor='transparent'
                        onPress={this.props.adjustAction}
                        style={[styles.deviceItem, BasicStyle.flexAllCenter]}>
                        <View style={[BasicStyle.rowFlex, BasicStyle.flexAllCenter]}>
                            <Text style={styles.deviceItemTitle}>Adjust height of side sleeping</Text>
                            <Image style={styles.deviceItemArrow} source={require('../../statics/images/arrow_right.png')} ></Image>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight 
                        activeOpacity={Theme.active.opacity}
                        underlayColor='transparent'
                        onPress={this.props.rebootAction}
                        style={[styles.deviceItem, BasicStyle.flexAllCenter]}>
                        <View style={[BasicStyle.rowFlex, BasicStyle.flexAllCenter]}>
                            <Text style={styles.deviceItemTitle}>Restart</Text>
                            <Image style={styles.deviceItemArrow} source={require('../../statics/images/arrow_right.png')} ></Image>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight 
                        activeOpacity={Theme.active.opacity}
                        underlayColor='transparent'
                        onPress={this.props.clearDataAction}
                        style={[styles.deviceItem, BasicStyle.flexAllCenter]}>
                        <View style={[BasicStyle.rowFlex, BasicStyle.flexAllCenter]} >
                            <Text style={styles.deviceItemTitle}>Data reset</Text>
                            <Image style={styles.deviceItemArrow} source={require('../../statics/images/arrow_right.png')} ></Image>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight 
                        activeOpacity={Theme.active.opacity}
                        underlayColor='transparent'
                        onPress={this.props.logAction}
                        style={[styles.deviceItem, BasicStyle.flexAllCenter]}>
                        <View style={[BasicStyle.rowFlex, BasicStyle.flexAllCenter]}>
                            <Text style={styles.deviceItemTitle}>Log(assisting R&D)</Text>
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

    renderStatusView() {
        if (this.props.device_data.isSearching) {
            return (
                <SearchingView {...this.props.device_data}/>
            )
        } else {
            return (<StatusView onDisconnect={this.props.onDisconnect} {...this.props.device_data}></StatusView>)
        }
    }

    render() {
        return (
            <View style={styles.container}>
                {this.renderStatusView()}

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
    },
    moreContainer: {
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
    moreText: {
        width: '100%',
        textAlign: 'center',
        color: 'white'
    }
});

export default Main;
