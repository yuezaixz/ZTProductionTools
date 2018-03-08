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
import Button from '../components/common/Button'

class DeviceView extends Component {
    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params || {};

        return {
            title:"枕头固件测试",
            headerLeft: (
                <Button onPress={params.backAction} style={{width:60}} textStyle={{fontSize:14,textAlign:'center'}} title="返回" />
            ),
        };
    };

    _backAction(){
        this.props.actions.deviceDisconnect(this.props.device_data.uuid)
        setTimeout(()=>{this.props.navigation.pop()},100)
    }

    constructor(props){
        super(props);
    }
    componentWillMount(){
        this.props.navigation.setParams({ backAction: this._backAction.bind(this) });
        // 不需要这样传递数据，直接调用this.props.device_data就可以了。因为mapStateToProps已经先执行过了
        // const { params } = this.props.navigation.state;
        // if (params && params.uuid) {
        //     var uuid = params ? params.uuid : null;
        //     var name = params ? params.name : null;
        //     var serviceUUID = params ? params.serviceUUID : null;
        //     var noitfyUUID = params ? params.noitfyUUID : null;
        //     var writeUUID = params ? params.writeUUID : null;
        //     this.setState({
        //         uuid, name, serviceUUID, noitfyUUID, writeUUID
        //     });
        // }
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

