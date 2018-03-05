import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
    StyleSheet,
    View,
    Text,
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

class SettingView extends Component {
    state = {open: false};
    handleConnectValue (){
        console.log('handleConnectValue')
        this.setState({open: true})
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
                <Header {...this.props}/>
                <Main openModal={this.handleConnectValue.bind(this)} {...this.props}/>
                <Footer {...this.props}/>

                <Modal
                    offset={0}
                    open={this.state.open}
                    modalDidOpen={() => console.log('蓝牙提示框开启')}
                    modalDidClose={() => this.setState({open: false})}
                    style={{alignItems: 'center'}}>
                    <View>
                        <Text style={{fontSize: 20, marginBottom: 10}}>请设置TODO的阈值！</Text>
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

