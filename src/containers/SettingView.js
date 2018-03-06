import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Dimensions
} from 'react-native';
import {
    Header,
    Main,
    Footer,
} from '../components/setting-view';
import Actions from '../actions';
import Modal from 'react-native-simple-modal';

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
    state = {open: false,text:0};
    handleConnectValue (type){
        var title = typeMap[type]
        console.log('handleConnectValue'+ title)
        if (title) {
            this.setState({open: true, title})
        }
        this.refs.HiddenInput.focus()

    }
    handleClose() {
        this.setState({open: false})
        this.refs.HiddenInput.clear()
        this.refs.HiddenInput.blur()
    }
    inputChange(text) {
        console.log(text)
        text = text || 0
        this.setState({text})
    }
    constructor(props){
        super(props);
        this.state = {isVisible: true}
    }
    componentDidMount() {

    }
    componentWillUnmount(){

    }
    render() {
        return (
            <View style={styles.container}>
                {/*<Header {...this.props}/>*/}
                <Main openModal={this.handleConnectValue.bind(this)} {...this.props}/>
                <Footer {...this.props}/>
                <TextInput ref='HiddenInput' keyboardType='numeric' onChangeText={this.inputChange.bind(this)} style={{position:'absolute',width:0,height:0}} ></TextInput>
                <Modal
                    offset={-80}
                    open={this.state.open}
                    modalDidOpen={() => console.log('开始修改阈值')}
                    modalDidClose={() => this.handleClose()}
                    style={{alignItems: 'center'}}>
                    <View>
                        <Text style={{fontSize: 20,fontWeight:'bold', marginTop: 10,textAlign:'center'}}>请设置{this.state.title || "[ERROR]"}！</Text>
                        <Text style={{fontSize: 40,fontWeight:'bold', marginTop: 15, marginBottom: 5,textAlign:'center'}}>
                            {this.state.text}
                        </Text>
                        <View style={{flexDirection:'row',height:40}}>

                            <TouchableOpacity
                                style={{flex:1,alignItems:'center',justifyContent:'center'}}
                                onPress={() => this.handleClose()}>
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

