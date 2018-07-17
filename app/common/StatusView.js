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
let winSize = Dimensions.get('window');

export default class StatusView extends Component{

    renderFlash = () => {
        if (this.props.isCharging) {
            return (<Image style={styles.flashImg} source={require('../statics/images/main_flash.png')} ></Image>)
        }
        return null
    }

    renderBattery = () => {
        if (this.props.uuid && !this.props.hiddenBattery) {
            const voltage = (parseInt(this.props.percent) || 100)
            // const voltage = 50
            const voltageStr = voltage + '%'
            return (
                <View style={styles.battery} >
                    <Text style={styles.batteryText} >{voltageStr}</Text>
                    <Image style={styles.batteryImage} source={require('../statics/images/main_battery_border.png')} ></Image>
                    <View style={[styles.batteryBlock, this.props.isCharging?{backgroundColor:'#46EA75', right:19}:{right:6}, {width:voltage/5}]} ></View>
                    {this.renderFlash()}
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
                        <Text style={styles.disconnectText}>Disconnect</Text>
                    </View>
                </TouchableHighlight>
            )
        }
    }

    renderPillow = () => {
        return (
            <View style={styles.pillow} >
                <Image style={[this.props.flatCode == 2?BasicStyle.down:{}, styles.arrowImage]} source={this.props.flatCode != 0?require('../statics/images/arrow_animation_up.gif'):{}} ></Image>
                <Image style={styles.pillowImage} source={this.props.poseCode == 2?require('../statics/images/main_pillow_slide.png'):require('../statics/images/main_pillow_flat.png')}></Image>
            </View>
        )
    }

    renderBottomView = () => {
        if (!this.props.isSearching && this.props.poseCode == 0 && this.props.flatCode == 0) {
            return null;
        } else {
            return (
                <View style={styles.bottomView} >
                    <Image style={styles.bottomViewLeft} source={this.processingImage(this.props.isProcessing)} ></Image>
                    <Text style={styles.bottomViewText}>{this.props.processingStr || '---'}</Text>
                    <Image style={styles.bottomViewRight} source={this.processingImage(this.props.isProcessing)} ></Image>
                </View>
            )
        }
    }

    processingImage(isProcessing) {
        return isProcessing?require('../statics/images/main_processing.gif'):require('../statics/images/main_processed.png')
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
        fontSize: 30/winSize.scale,
        color: '#FFFFFF',
    },
    batteryImage: {
        width: 29,
        height: 14,
        marginLeft: 5,
        resizeMode: 'stretch',
    },
    batteryBlock: {
        position: 'absolute',
        backgroundColor: '#FFFFFF',
        height: 10,
        marginTop: 2
    },
    flashImg: {
        marginLeft: 5,
        height: 17,
        width: 8,
        resizeMode: 'stretch',
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
        width: 45
    },
    disconnectText: {
        ...Theme.font.common,
        width: '100%',
        textAlign: 'center'
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