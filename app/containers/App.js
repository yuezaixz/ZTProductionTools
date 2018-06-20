import React, {Component} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {StackNavigator} from 'react-navigation'
import HomeView from './HomeView';
import LogView from './LogView';
import AdjustView from './AdjustView';
import {Theme} from '../styles';
import Actions from '../actions';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Modal from 'react-native-simple-modal';

const RootStack = StackNavigator(
    {
        Home: {
            screen: HomeView,
        },
        Adjust: {
            screen: AdjustView,
        },
        Log: {
            screen: LogView,
        },
    },
    {
        initialRouteName: 'Home',
        /* The header config from HomeScreen is now here */
        navigationOptions: {
            headerStyle: {
                backgroundColor: Theme.color.bgColor,
            },
            headerTintColor: Theme.color.bgColor,
            headerTitleStyle: {
                fontWeight: 'normal',
                fontSize:17,
                color:'white'
            },
        },
    }
);

class App extends Component {
    renderModalKeys() {
        let keys = []
        if (this.props.global_data.modalKeys) {
            let index = 0
            this.props.global_data.modalKeys.forEach(element => {
                keys.push(
                    <TouchableOpacity
                        key={'modalKey'+index}
                        style={{flex:1}}
                        onPress={() => element.callBack()}>
                        <Text>{element.keyTitle}</Text>
                    </TouchableOpacity>
                )
                index++
            });
        }
        return keys
    }

    render() {
        return (<View style={styles.container} >
            <RootStack />
            {/* <View style={{position:'absolute', width:'100%', height:'100%'}} ></View> */}
            <Modal
                offset={0}
                open={this.props.global_data.openModal}
                modalDidOpen={() => console.log('蓝牙提示框开启')}
                modalDidClose={() => console.log('关闭')}
                style={styles.modal}>
                <View>
                    <Text style={{fontSize: 20, marginBottom: 10}}>{this.props.global_data.modalTitle}</Text>
                    {/* <TouchableOpacity
                        style={{margin: 5}}
                        onPress={() => this.props.actions.hiddenModal()}>
                        <Text>好的</Text>
                    </TouchableOpacity> */}
                    <View style={{flexDirection:'row', margin: 5, height: 20}} >
                        {this.renderModalKeys()}
                    </View>
                </View>
            </Modal>
        </View>);
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    modal: {
        alignItems: 'center'
    }
});

function mapStateToProps(state) {
    return {
        global_data: state.global
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
)(App);