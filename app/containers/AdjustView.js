import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
    StyleSheet,
    Text,
    ImageBackground,
    ScrollView
} from 'react-native';
import StatusBarLeftButton from '../../src/components/common/StatusBarLeftButton'
import {Theme} from '../styles';

import NotificationCenter from "../../src/public/Com/NotificationCenter/NotificationCenter";
import PillowManager from '../../src/manager/PillowManager';
import Actions from '../actions';

class AdjustView extends Component {
    logList = []

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

    render() {
        return (
            <ImageBackground source={require('../statics/images/bg.jpg')} style={styles.container}>
                
            </ImageBackground>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF'
    },
    body: {
        flex: 1
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

