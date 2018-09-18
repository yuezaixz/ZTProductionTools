import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import {
    StyleSheet,
    View
} from 'react-native';
import {
    Header,
    Main,
    Footer,
} from '../components/exper-view';
import Actions from '../actions';
import StatusBarLeftButton from '../components/common/StatusBarLeftButton'
import Loading from '../components/common/WLoading'

class ExperView extends Component {
    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params || {};

        return {
            title:"枕头老化/保压测试",
            headerLeft: (
                <StatusBarLeftButton onPress={params.backAction} title="返回" ></StatusBarLeftButton>
            ),
        };
    };

    getLoading() {
        return this.refs['loading'];
    }

    _backAction(){
        console.log('backAction')
        this.props.actions.deviceDisconnect(this.props.device_data.uuid)
        this.props.actions.clearDeviceData()
        setTimeout(()=>{this.props.navigation.pop()},100)
    }

    constructor(props){
        super(props);
    }
    componentWillMount(){
        this.props.navigation.setParams({ backAction: this._backAction.bind(this) });
        //连上后需要发指令就在这把
    }
    componentDidMount(){
        console.log('进入设备页面')
        console.log(this.props)
    }
    render() {
        return (
            <View style={styles.container}>
                <Header {...this.props}/>
                <Main {...this.props} getLoading={this.getLoading.bind(this)} />
                <Footer {...this.props} getLoading={this.getLoading.bind(this)} />
                <Loading ref={'loading'} text={'测试中...'} />
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF'
    }
});

function mapStateToProps(state) {
    return {
        device_data: {...state.device,
            uuid:state.home.uuid,
            name:state.home.name,
            serviceUUID:state.home.serviceUUID,
            noitfyUUID:state.home.noitfyUUID,
            writeUUID:state.home.writeUUID
        }
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
)(ExperView);

