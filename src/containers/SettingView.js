import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Dimensions,
    AsyncStorage
} from 'react-native';
import {
    Header,
    Main,
    Footer,
} from '../components/setting-view';
import Actions from '../actions';
import Modal from 'react-native-simple-modal';
import * as StorageKeys from '../constants/StorageKeys'

let {height, width} = Dimensions.get('window');

const typeMap = {
    'connect_threshold':'自动连接阈值',
    'std_voltage':'标准电压',
    'air_pressure_threshold':'气压校准差值'
}

class SettingView extends Component {

    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params || {};

        return {
            title:"测试项阈值设置",
            headerLeft: (
                <View />
            ),
        };
    };
    settingValue = {connect_threshold:'0',std_voltage:'0',air_pressure_threshold:'0'};
    state = {open: false,text:0};
    handleConnectValue (type){
        var title = typeMap[type]
        var text = this.settingValue[type]
        console.log('handleConnectValue'+ title)
        if (title) {
            this.setState({open: true, title, text, type})
            this.refs.HiddenInput.focus()
        }
    }
    handleOk(){
        if (this.state.type && this.state.text) {
            this.settingValue[this.state.type] = this.state.text
            AsyncStorage.setItem(this.state.type, this.state.text)
        }
        this.setState({open: false})
        this.refs.HiddenInput.clear()
        this.refs.HiddenInput.blur()
    }
    handleClose() {
        this.setState({open: false})
        this.refs.HiddenInput.clear()
        this.refs.HiddenInput.blur()
    }
    inputChange(text) {
        console.log(text)
        this.setState({text})
    }
    constructor(props){
        super(props);
        this.state = {isVisible: true}
    }
    componentDidMount() {
    }
    componentWillMount(){
        const { params } = this.props.navigation.state;
        this.settingValue = params.settingValue
        console.log("设置页面收到的数据:"+JSON.stringify(this.settingValue))
    }
    render() {
        return (
            <View style={styles.container}>
                {/*<Header {...this.props}/>*/}
                <Main openModal={this.handleConnectValue.bind(this)} settingValue={this.settingValue} {...this.props}/>
                <Footer {...this.props}/>
                <TextInput ref='HiddenInput'
                           keyboardType='numeric'
                           // editable = {false}
                           onChangeText={this.inputChange.bind(this)}
                           value={ ""+this.state.text}
                           style={{position:'absolute',width:0,height:0}} ></TextInput>
                <Modal
                    offset={-80}
                    open={this.state.open}
                    modalDidOpen={() => console.log('开始修改阈值')}
                    modalDidClose={() => this.handleClose()}
                    style={{alignItems: 'center'}}>
                    <View>
                        <Text style={{fontSize: 20,fontWeight:'bold', marginTop: 10,textAlign:'center'}}>请设置{this.state.title || "[ERROR]"}！</Text>
                        <Text style={{fontSize: 40,fontWeight:'bold', marginTop: 15, marginBottom: 5,textAlign:'center'}}>
                            {this.state.type&&this.state.type===StorageKeys.CONNECT_THRESHOLD?"-":""}{this.state.text || '0'}
                        </Text>
                        <View style={{flexDirection:'row',height:40}}>

                            <TouchableOpacity
                                style={{flex:1,alignItems:'center',justifyContent:'center'}}
                                onPress={() => this.handleOk()}>
                                <Text style={{fontSize: 16,textAlign:'center'}} >确定</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{flex:1,alignItems:'center',justifyContent:'center'}}
                                onPress={() => this.handleClose()}>
                                <Text style={{fontSize: 16,textAlign:'center'}} >取消</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
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
)(SettingView);

