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
} from '../components/device-view';
import Actions from '../actions';

class DeviceView extends Component {
    constructor(props){
        super(props);
    }
    componentWillMount(){
        const { params } = this.props.navigation.state;
        if (params && params.uuid) {
            var uuid = params ? params.uuid : null;
            var name = params ? params.name : null;
            var serviceUUID = params ? params.serviceUUID : null;
            var noitfyUUID = params ? params.noitfyUUID : null;
            var writeUUID = params ? params.writeUUID : null;
            this.setState({
                uuid, name, serviceUUID, noitfyUUID, writeUUID
            });
        }
        //先检查电量
        this.props.actions.startCheckVoltage(uuid, serviceUUID, writeUUID);
    }
    componentDidMount(){
        console.log('进入设备页面')
        console.log(this.props)
    }
    render() {
        return (
            <View style={styles.container}>
                <Header {...this.props}/>
                <Main {...this.props}/>
                <Footer {...this.props}/>
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
)(DeviceView);

