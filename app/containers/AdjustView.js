import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
    StyleSheet,
    Text,
    ImageBackground,
    TouchableHighlight,
    View
} from 'react-native';
import StatusBarLeftButton from '../../src/components/common/StatusBarLeftButton'
import {Theme} from '../styles';

import NotificationCenter from "../../src/public/Com/NotificationCenter/NotificationCenter";
import PillowManager from '../../src/manager/PillowManager';
import Actions from '../actions';
import StatusView from '../common/StatusView';

class AdjustView extends Component {
    logList = []
    state = {isSlidePrompt:true, adjusting:false}
    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params || {};

        return {
            title:"调整高度",
            headerLeft: (
                <StatusBarLeftButton textStyle={Theme.font.common} onPress={params.backAction} title="返回" ></StatusBarLeftButton>
            ),
        };
    };

    _backAction(){
        console.log('backAction')
        setTimeout(()=>{this.props.navigation.pop()},100)
    }

    constructor(props){
        super(props)
    }
    componentWillMount() {
        this.props.navigation.setParams({ backAction: this._backAction.bind(this) });

        this.sleepStatusListener = NotificationCenter
                                .createListener(
                                    NotificationCenter.name.deviceData.sleepStatus, 
                                    this.sleepStatus.bind(this), 
                                    ''
                                );
    }

    sleepStatus(data) {
        
    }

    componentDidMount() {
        PillowManager.ShareInstance().clearLog()
    }
    componentWillUnmount(){
        PillowManager.ShareInstance().stopManual()
        NotificationCenter.removeListener(this.sleepStatusListener)
    }

    renderAdjustButton() {
        if (this.state.adjusting) {
            return (<View style={styles.adjustButtonContainer} >
                <TouchableHighlight 
                    activeOpacity={Theme.active.opacity}
                    underlayColor='transparent'
                    onPress={this.props.risingAction}
                    style={[styles.adjustButton, styles.risingAdjustButton]}>
                    <ImageBackground 
                        source={require('../statics/images/circle_button_border.png')} 
                        style={styles.adjustContainer}>
                        <Text style={styles.adjustButtonText}>上升</Text>
                    </ImageBackground>
                </TouchableHighlight>
                <TouchableHighlight 
                    activeOpacity={Theme.active.opacity}
                    underlayColor='transparent'
                    onPress={this.props.fallingAction}
                    style={[styles.adjustButton, styles.fallingAdjustButton]}>
                    <ImageBackground 
                        source={require('../statics/images/circle_button_border.png')} 
                        style={styles.adjustContainer}>
                        <Text style={styles.adjustButtonText}>下降</Text>
                    </ImageBackground>
                </TouchableHighlight>
            </View>)
        } else {
            return (<View style={styles.adjustButtonContainer} >
                <TouchableHighlight 
                    activeOpacity={Theme.active.opacity}
                    underlayColor='transparent'
                    onPress={this.props.pauseAction}
                    style={[styles.adjustButton, styles.pauseAdjustButton]}>
                    <ImageBackground 
                        source={require('../statics/images/circle_button_border.png')} 
                        style={styles.adjustContainer}>
                        <Text style={styles.adjustButtonText}>暂停</Text>
                    </ImageBackground>
                </TouchableHighlight>
            </View>)
        }
    }

    renderBody() {
        return (
            <ImageBackground source={require('../statics/images/bg.jpg')} style={styles.container}>
                <StatusView {...this.props}></StatusView>
                <View style={styles.body} >
                    {this.renderAdjustButton()}
                    <Text style={styles.adjustPromptText} >点击暂停调整</Text>
                    <TouchableHighlight 
                        activeOpacity={Theme.active.opacity}
                        underlayColor='transparent'
                        onPress={this.props.saveAction}
                        style={styles.saveButton}>
                        <Text style={styles.saveButtonText}>调整侧卧高度</Text>
                    </TouchableHighlight>
                </View>
                {/* <view class="body">
                    <view style='position:relative;height:100%;width:100%;' >
                        <view  bindtap="actionRising" class="circle_button rising_button {{isAdjusting?'hidden':''}}" >
                        <image class="circle_img" src='/images/circle_button_border.png' />
                        <text class="circle_text" >上升</text>
                        </view>
                        <view bindtap="actionFalling" class="circle_button falling_button {{isAdjusting?'hidden':''}}" >
                        <image class="circle_img" src='/images/circle_button_border.png' />
                        <text class="circle_text" >下降</text>
                        </view>

                        <view bindtap="actionPause" class="circle_button pause_button {{!isAdjusting?'hidden':''}}" >
                        <image class="circle_img" src='/images/circle_button_border.png' />
                        <text class="circle_text" >暂停</text>
                        </view>

                        <view bindtap="actionSave" class="save_button {{!hadChange?'disable_button':''}}" >
                        <image class="circle_img" src="{{!hadChange?'/images/radius_border_disable.png':'/images/radius_border.png'}}" />
                        <text class="save_text" style="color:{{!hadChange?'#bbbbbb':'#fff'}}" >保存设置</text>
                        </view>
                    
                    </view>

                </view> */}
            </ImageBackground>
        );
    }

    renderPrompt() {
        return null
    }

    render() {
        if (this.state.isSlidePrompt) {
            return this.renderBody()
        } else {
            return this.renderPrompt()
        }
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignSelf: 'stretch',
        backgroundColor: Theme.color.bgColor
    },
    body: {
        flex: 1
    },
    adjustButtonContainer: {
        paddingTop: 50,
        paddingBottom: 50,
        height: 230,
        width: '100%',
        flexDirection:'row',
        justifyContent: 'space-around'
    },
    adjustPromptText: {
        width: '100%',
        textAlign: 'center',
        ...Theme.font.common,
        fontSize: 18
    },
    saveButton: {
        marginTop: 'auto',
        marginBottom: 30,
        width: 263,
        height: 47,
        alignSelf: 'center',
        borderColor: '#979797',
        borderWidth: 1,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    saveButtonText: {
        width: '100%',
        textAlign: 'center',
        ...Theme.font.common,
        fontSize: 18,
    },
    adjustContainer:{
        flex: 1,
        alignSelf: 'stretch',
        justifyContent: 'center'
    },
    adjustButton:{
        width: 130,
        height: 130,
        alignItems: 'center',
        justifyContent: 'center'
    },
    risingAdjustButton: {
        
    },
    pauseAdjustButton: {
        
    },
    fallingAdjustButton: {
        
    },
    adjustButtonText: {
        ...Theme.font.common,
        textAlign: 'center',
        fontSize: 30,
        color: '#417505'
    },
});

function mapStateToProps(state) {
    return {
        device_data: state.device
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Actions, dispatch)
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AdjustView);

