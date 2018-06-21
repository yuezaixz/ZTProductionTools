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

class AdjustView extends Component {
    logList = []
    state = {
        isSlidePrompt:false, 
        isAdjusting:false, 
        hadChange:false,
        hiddenBattery: true
    }
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
        this.props.actions.readSleepStatus(data.status)
    }

    componentDidMount() {
        PillowManager.ShareInstance().clearLog()
    }
    componentWillUnmount(){
        PillowManager.ShareInstance().stopManual()
        NotificationCenter.removeListener(this.sleepStatusListener)
    }

    saveAction() {
        if (!this.state.hadChange) {
            return
        }

        PillowManager.ShareInstance().startSaveHeight().then(_ => {
            this._backAction()
        })
    }

    closePromptAction() {
        if (this.props.device_data.pillowStatus == 2) {
            PillowManager.ShareInstance().startManual().then(_ => {this.setState({isSlidePrompt:true})})
        }
    }

    risingAction() {
        if (this.props.device_data.pillowStatus != 2) {
            this.props.actions.showToast('请侧卧', 2000)
        } else {
            this.setState({isAdjusting: true, isProcessing: true , processingStr:'充气中', hadChange: true})
            PillowManager.ShareInstance().startRising()
        }
    }

    fallingAction() {
        if (this.props.device_data.pillowStatus != 2) {
            this.props.actions.showToast('请侧卧', 2000)
          } else {
            this.setState({isAdjusting: true, isProcessing: true, processingStr:'放气中', hadChange: true})
            PillowManager.ShareInstance().startFalling()
          }
    }

    pauseAction() {
        this.setState({isAdjusting: false, isProcessing: false, processingStr:'请点击'})
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
                        <Text style={styles.adjustButtonText}>上升</Text>
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
                        <Text style={styles.adjustButtonText}>下降</Text>
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
                        <Text style={styles.adjustButtonText}>暂停</Text>
                    </ImageBackground>
                </TouchableHighlight>
            </View>)
        }
    }

    renderBody() {
        return (
            <ImageBackground source={require('../statics/images/bg.jpg')} style={styles.container}>
                <StatusView {...this.state} pillowStatus={this.props.device_data.pillowStatus} ></StatusView>
                <View style={styles.body} >
                    {this.renderAdjustButton()}
                    <Text style={styles.adjustPromptText} >点击暂停调整</Text>
                    <TouchableHighlight 
                        activeOpacity={Theme.active.opacity}
                        underlayColor='transparent'
                        onPress={this.saveAction.bind(this)}
                        style={styles.saveButton}>
                        <Text style={styles.saveButtonText}>调整侧卧高度</Text>
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
                        this.props.device_data.pillowStatus > 2 ? '请等待枕头调整到指定高度':(
                            this.props.device_data.pillowStatus == 2 ?'请点击确定开始调整':'请调整睡姿到侧卧'
                        )
                    }
                </Text>
                <TouchableHighlight 
                    activeOpacity={Theme.active.opacity}
                    underlayColor='transparent'
                    onPress={this.closePromptAction.bind(this)}
                    style={styles.saveButton}>
                    <Text style={this.props.device_data.pillowStatus ==2 ?styles.saveButtonText:styles.saveButtonTextDisable}>{this.props.device_data.pillowStatus >= 2 ? '确定' : '请侧卧'}</Text>
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

