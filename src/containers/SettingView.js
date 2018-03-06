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
    state = {open: false};
    handleConnectValue (type){
        var title = typeMap[type]
        console.log('handleConnectValue'+ title)
        if (title) {
            this.setState({open: true, title})
        }

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
                <Modal
                    offset={0}
                    open={this.state.open}
                    modalDidOpen={() => console.log('开始修改阈值')}
                    modalDidClose={() => this.setState({open: false})}
                    style={{alignItems: 'center'}}>
                    <View>
                        <Text style={{fontSize: 20, marginBottom: 10}}>请设置{this.state.title || "[ERROR]"}！</Text>
                        <TouchableOpacity
                            style={{margin: 5}}
                            onPress={() => this.setState({open: false})}>
                            <Text>好的</Text>
                        </TouchableOpacity>
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

