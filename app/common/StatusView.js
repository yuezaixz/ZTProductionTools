import React,{Component} from 'react';
import {
    View,
    Text,
    Image,
    TouchableHighlight,
    StyleSheet,
    Dimensions
} from 'react-native';

import {Theme, BasicStyle} from "../styles";
let {height, width} = Dimensions.get('window');

export default class StatusView extends Component{

    renderBattery = () => {
        if (this.props.uuid && !this.props.hiddenBattery) {
            const voltage = (parseInt(this.props.percent) || 100)
            // const voltage = 50
            const voltageStr = voltage + '%'
            return (
                <View style={styles.battery} >
                    <Text style={styles.batteryText} >{voltageStr}</Text>
                    <Image style={styles.batteryImage} source={require('../statics/images/main_battery_border.png')} ></Image>
                    <View style={[styles.batteryBlock,{width:voltage/5}]} ></View>
                </View>
            )
        }
        return null
    }

    renderDisconnect = () => {
        if (this.props.uuid && !this.props.hiddenBattery) {
            return (
                <TouchableHighlight
                        activeOpacity={Theme.active.opacity}
                        underlayColor='transparent'
                        style={styles.disconnectTouchContainer}
                        onPress={this.actionDisconnect.bind(this)}>
                    <View style={styles.disconnect} >
                        <Image style={styles.disconnectImage} source={require('../statics/images/main_disconnect_device.png')} ></Image>
                        <Text style={styles.disconnectText}>断开</Text>
                    </View>
                </TouchableHighlight>
            )
        }
    }

    renderPillow = () => {
        if (this.props.isSlide) {
            return (
                <View style={styles.pillow} >
                    <Image style={[this.props.isDown?BasicStyle.down:{}, styles.arrowImage]} source={this.props.isProcessing?require('../statics/images/arrow_animation_up.gif'):{}} ></Image>
                    <Image style={styles.pillowImage} source={require('../statics/images/main_pillow_slide.png')}></Image>
                </View>
            )
        } else {
            return (
                <View style={styles.pillow} >
                    <Image style={[this.props.isDown?BasicStyle.down:{}, styles.arrowImage]} source={false?require('../statics/images/arrow_animation_up.gif'):{}} ></Image>
                    <Image style={styles.pillowImage} source={require('../statics/images/main_pillow_flat.png')}></Image>
                </View>
            )
        }
    }

    renderBottomView = () => {
        if (this.props.isProcessing) {
            return (
                <View style={styles.bottomView} >
                    <Image style={styles.bottomViewLeft} source={require('../statics/images/main_processing.gif')} ></Image>
                    <Text style={styles.bottomViewText}>{this.props.processingStr || '---'}</Text>
                    <Image style={styles.bottomViewRight} source={require('../statics/images/main_processing.gif')} ></Image>
                </View>
            )
        } else {
            return (
                <View style={styles.bottomView} >
                    <Image style={styles.bottomViewLeft} source={require('../statics/images/main_processed.png')} ></Image>
                    <Text style={styles.bottomViewText}>{this.props.processingStr || '---'}</Text>
                    <Image style={styles.bottomViewRight} source={require('../statics/images/main_processed.png')} ></Image>
                </View>
            )
        }
    }

    actionDisconnect() {
        console.log(this.props)
        if (this.props.onDisconnect) {
            this.props.onDisconnect()
        }
    }

    constructor(props) {
        super(props);
    }

    render (){
        return (
            <View style={styles.status}>
                {this.renderBattery()}
                {this.renderDisconnect()}
                {this.renderPillow()}
                {this.renderBottomView()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    status: {
        height:'38%',
        width: width,
        borderBottomWidth: 1,
        borderColor: Theme.color.separatorColor,
        alignItems: 'center',
        justifyContent: 'center'
    },
    battery: {
        position: 'absolute',
        right: Theme.constant.topPadding,
        top: Theme.constant.leftRightPadding,
        flexDirection:'row'
    },
    batteryText: {
        width: 50,
        textAlign: 'right',
        ...Theme.font.common
    },
    batteryImage: {
        width: 30,
        height: 17,
        marginLeft: 5
    },
    batteryBlock: {
        position: 'absolute',
        backgroundColor: '#FFFFFF',
        height: 11,
        right:7,
        marginTop: 3
    },
    disconnectTouchContainer: {
        position: 'absolute',
        left: Theme.constant.topPadding,
        top: Theme.constant.leftRightPadding,
        borderWidth:1,
        borderColor: '#FFFFFF',
        padding : 4,
        borderRadius: 6
    },
    disconnect: {
        flexDirection:'row',
    },
    disconnectText: {
        ...Theme.font.common
    },
    disconnectImage: {
        width: 17,
        height: 17
    },
    pillow: {
    },
    pillowImage: {
        width: 180,
        height: 50,
    },
    arrowImage: {
        height: 60,
        width: 60,
        alignSelf: 'center',
        position: 'relative',
        top: 20,
        left: 10
    },
    bottomView: {
        bottom: 10,
        flexDirection:'row',
        justifyContent: 'flex-end',
        marginTop: 50
    },
    bottomViewLeft: {
        height: 19,
        width: 48
    },
    bottomViewRight: {
        height: 19,
        width: 48
    },
    bottomViewText: {
        marginLeft: 10,
        marginRight: 10,
        ...Theme.font.common
    }
});