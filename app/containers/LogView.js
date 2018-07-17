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

class LogView extends Component {
    logList = []

    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params || {};

        return {
            title:"Log",
            headerLeft: (
                <StatusBarLeftButton textStyle={Theme.font.common} onPress={params.backAction} title="Back" ></StatusBarLeftButton>
            ),
        };
    };

    _backAction(){
        console.log('backAction')
        PillowManager.ShareInstance().clearLog()
        setTimeout(()=>{this.props.navigation.pop()},100)
    }

    constructor(props){
        super(props)
    }
    componentWillMount() {
        this.props.navigation.setParams({ backAction: this._backAction.bind(this) });
        PillowManager.ShareInstance().enableLog()

        this.handleLogListener = NotificationCenter
                                .createListener(
                                    NotificationCenter.name.deviceData.log_list, 
                                    this.handleLog.bind(this), 
                                    ''
                                );
    }

    handleLog(data) {
        if (data && data.log_list && data.log_list.length ) {
            this.props.actions.readLog(data.log_list)
        }
    }

    componentDidMount() {
        PillowManager.ShareInstance().clearLog()
    }
    componentWillUnmount(){
        PillowManager.ShareInstance().disableLog()
        console.log('日志已清除')
        this.props.actions.clearLog()
        NotificationCenter.removeListener(this.handleLogListener)
    }

    renderList  = () =>{
        const { device_data } = this.props;
        if(!device_data || !device_data.logList){ return null}

        return device_data.logList.map((item, idx) => {
            return <Text style={styles.logText} key={'logText'+idx}>{item}</Text>
        });
    }

    render() {
        return (
            <ImageBackground source={require('../statics/images/bg.jpg')} style={styles.container}>
                <ScrollView style={styles.body}>
                    {this.renderList()}
                </ScrollView>
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
    },
    logText: {
        textAlign: 'left',
        ...Theme.font.common,
        paddingLeft: Theme.constant.leftRightPadding,
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
)(LogView);

