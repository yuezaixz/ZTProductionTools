import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
    StyleSheet,
    Text,
    ImageBackground,
    Image,
    TouchableHighlight,
    View
} from 'react-native';
import StatusBarLeftButton from '../../src/components/common/StatusBarLeftButton'
import {Theme} from '../styles';

import NotificationCenter from "../../src/public/Com/NotificationCenter/NotificationCenter";
import PillowManager from '../../src/manager/PillowManager';
import Actions from '../actions';
import StatusView from '../common/StatusView';
import * as util from '../../src/utils/InsoleUtils';

class AdjustView extends Component {
    logList = []
    state = {
        isSlidePrompt:false, 
        isAdjusting:false, 
        hadChange:false,
        hiddenBattery: true
    }
    isSaving = false//是否是正在保存操作
    isFalling = false//上次调试是否为下降

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
        this.recvACKListener = NotificationCenter
                                .createListener(
                                    NotificationCenter.name.deviceData.recvACK, 
                                    this.handleRecvACK.bind(this), 
                                    ''
                                );
    }

    handleRecvACK(data) {
        if (!data.command) {
            return
        }

        if (util.startWith(data.command, 'HAM0')) {//暂停
            if (!this.isSaving) {
              if (this.isFalling) {
                setTimeout(() => { 
                    this.props.actions.hiddenLoading()
                    this.setState({
                        isAdjusting: false, 
                        isProcessing: true, 
                        processingStr:'请保存', 
                        hadChange: true
                    })
                }, 4000)
              } else {
                this.props.actions.hiddenLoading()
                this.setState({
                    isAdjusting: false, 
                    isProcessing: false, 
                    processingStr:'请保存', 
                    hadChange: true
                })
              }
            }
        } else if (util.startWith(data.command, 'HIM1')) {//上升
            if (this.isSaving) {//说明不是真的用户操作上升，而是保存前为了获得正确的气压，充气一会发暂停
                setTimeout(()=>{
                    PillowManager.ShareInstance().startPausing()
                }, 2000)
            } else {
                this.props.actions.hiddenToast()
                this.setState({
                    isAdjusting: true, 
                    isProcessing: true, 
                    processingStr:'充气中', 
                    hadChange: true
                })
            }
        } else if (util.startWith(data.command, 'HDM1')) {//下降
            this.props.actions.hiddenToast()
            this.setState({
                isAdjusting: true, 
                isProcessing: true, 
                processingStr:'放气中', 
                hadChange: true
            })
        } else if (util.startWith(data.command, 'HCD')) {//保存
            this.props.actions.showLoading('保存成功')
            setTimeout(() => {
                this.isSaving = false
                this.props.actions.hiddenLoading()
                this._backAction()
            }, 2000)
        } else if (data.command === 'ADJUST DONE' && this.isSaving) {
            PillowManager.ShareInstance().startSaveHeight()
        }
    }

    sleepStatus(data) {
        if (this.props.device_data.pillowStatus != data.status) {
            this.props.actions.readSleepStatus(data.status, data.poseCode, data.flatCode)
        }

        if (this.state.isSlidePrompt && (data.poseCode == 1)) {
            PillowManager.ShareInstance().startPausing().then(() => {
                return PillowManager.ShareInstance().stopManual()
            }).then(() =>{
                this.setState({
                    hadChange: false,
                    isSlidePrompt: false,
                    isAdjusting: false, 
                    processingStr: 'Please click'
                })
            })
        }
    }

    componentDidMount() {
        PillowManager.ShareInstance().clearLog()
    }
    componentWillUnmount(){
        PillowManager.ShareInstance().stopManual()
        NotificationCenter.removeListener(this.sleepStatusListener)
        NotificationCenter.removeListener(this.recvACKListener)
    }

    saveAction() {
        if (!this.state.hadChange) {
            return
        }

        this.props.actions.showLoading('Saving')

        if (this.isFalling) {
            this.isSaving = true
            PillowManager.ShareInstance().startInflate()
        } else {
            this.isSaving = true
            PillowManager.ShareInstance().startSaveHeight()
        }
    }

    closePromptAction() {
        if (this.props.device_data.pillowStatus == 2) {
            PillowManager.ShareInstance().startManual().then(_ => {this.setState({isSlidePrompt:true})})
        }
    }

    risingAction() {
        if (this.props.device_data.pillowStatus != 2) {
            this.props.actions.showToast('Please side', 2000)
        } else {
            this.isSaving = false
            this.isFalling = false
            //暂时先发手动模式
            this.props.actions.showToast('Ready to inflating', 2000)
            PillowManager.ShareInstance().startRising()
        }
    }

    fallingAction() {
        if (this.props.device_data.pillowStatus != 2) {
            this.props.actions.showToast('Please side', 2000)
        } else {
            this.isFalling = true
            this.isSaving = false
            this.props.actions.showToast('Ready to deflating', 2000)
            PillowManager.ShareInstance().startFalling()
        }
    }

    pauseAction() {
        this.props.actions.showLoading('Stoping')
        PillowManager.ShareInstance().startPausing()
    }

    renderAdjustButton() {
        if (!this.state.isAdjusting) {
            return (<View style={styles.adjustButtonContainer} >
                <TouchableHighlight 
                    activeOpacity={Theme.active.opacity}
                    underlayColor='transparent'
                    onPress={this.risingAction.bind(this)}
                    style={[styles.adjustButton, styles.risingAdjustButton]}>
                    <ImageBackground 
                        source={require('../statics/images/circle_button_border.png')} 
                        style={styles.adjustContainer}>
                        <Text style={styles.adjustButtonText}>Up</Text>
                    </ImageBackground>
                </TouchableHighlight>
                <TouchableHighlight 
                    activeOpacity={Theme.active.opacity}
                    underlayColor='transparent'
                    onPress={this.fallingAction.bind(this)}
                    style={[styles.adjustButton, styles.fallingAdjustButton]}>
                    <ImageBackground 
                        source={require('../statics/images/circle_button_border.png')} 
                        style={styles.adjustContainer}>
                        <Text style={styles.adjustButtonText}>Down</Text>
                    </ImageBackground>
                </TouchableHighlight>
            </View>)
        } else {
            return (<View style={styles.adjustButtonContainer} >
                <TouchableHighlight 
                    activeOpacity={Theme.active.opacity}
                    underlayColor='transparent'
                    onPress={this.pauseAction.bind(this)}
                    style={[styles.adjustButton, styles.pauseAdjustButton]}>
                    <ImageBackground 
                        source={require('../statics/images/circle_button_border.png')} 
                        style={styles.adjustContainer}>
                        <Text style={styles.adjustButtonText}>Pause</Text>
                    </ImageBackground>
                </TouchableHighlight>
            </View>)
        }
    }

    renderBody() {
        return (
            <ImageBackground source={require('../statics/images/bg.jpg')} style={styles.container}>
                <StatusView {...this.state} 
                    pillowStatus={this.props.device_data.pillowStatus} 
                    flatCode={this.props.device_data.flatCode} 
                    poseCode={this.props.device_data.poseCode}>
                </StatusView>
                <View style={styles.body} >
                    {this.renderAdjustButton()}
                    <Text style={styles.adjustPromptText} >Click to </Text>
                    <TouchableHighlight 
                        activeOpacity={Theme.active.opacity}
                        underlayColor='transparent'
                        onPress={this.saveAction.bind(this)}
                        style={styles.saveButton}>
                        <Text style={styles.saveButtonText}>Adjust height of side sleeping</Text>
                    </TouchableHighlight>
                </View>
            </ImageBackground>
        );
    }

    renderPrompt() {
        return (
            <ImageBackground source={require('../statics/images/bg.jpg')} style={[styles.container,styles.promptContainer]}>
                <Image style={styles.promptImage} source={require('../statics/images/adjust_slide_prompt.png')} ></Image>
                <Text style={styles.promptText}>
                    {
                        this.props.device_data.pillowStatus > 2 ? 'Please wait for the pillow adjust to the last setting':(
                            this.props.device_data.pillowStatus == 2 ?'Please click OK to start Adjusting':'Please switch to side'
                        )
                    }
                </Text>
                <TouchableHighlight 
                    activeOpacity={Theme.active.opacity}
                    underlayColor='transparent'
                    onPress={this.closePromptAction.bind(this)}
                    style={styles.saveButton}>
                    <Text style={this.props.device_data.pillowStatus ==2 ?styles.saveButtonText:styles.saveButtonTextDisable}>{this.props.device_data.pillowStatus >= 2 ? 'OK' : 'Please side'}</Text>
                </TouchableHighlight>
            </ImageBackground>
        )
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
    saveButtonTextDisable: {
        width: '100%',
        textAlign: 'center',
        ...Theme.font.common,
        fontSize: 18,
        color: '#bbbbbb'
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
    adjustButtonText: {
        ...Theme.font.common,
        textAlign: 'center',
        fontSize: 30,
        color: '#417505'
    },
    promptContainer:{
        alignItems: 'center',
        justifyContent: 'center'
    },
    promptImage:{
        width: 300,
        height: 300
    },
    promptText:{
        marginTop: 50,
        textAlign: 'center',
        ...Theme.font.common,
        fontSize: 18
    }
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

