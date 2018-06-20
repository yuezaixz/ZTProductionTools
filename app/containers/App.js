import React, {Component} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {StackNavigator} from 'react-navigation'
import HomeView from './HomeView';
import LogView from './LogView';
import AdjustView from './AdjustView';
import {Theme} from '../styles';
import Actions from '../actions';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
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
                        style={styles.modalKey}
                        onPress={() => element.callBack()}>
                        <Text style={styles.modalKeyText} >{element.keyTitle}</Text>
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
                modalDidOpen={() => console.log('Modal开启')}
                modalDidClose={() => console.log('Modal关闭')}
                style={styles.modal}>
                <View>
                    <Text style={styles.modalText}>{this.props.global_data.modalContent}</Text>
                    <View style={styles.modalKeyContainer} >
                        {this.renderModalKeys()}
                    </View>
                </View>
            </Modal>

            <Modal
                offset={0}
                open={this.props.global_data.openToast}
                modalDidOpen={() => console.log('Toast开启')}
                modalDidClose={() => console.log('Toast关闭')}
                closeOnTouchOutside={false}
                style={styles.modal}>
                <View>
                    <Text style={styles.toastText}>{this.props.global_data.toastContent}</Text>
                </View>
            </Modal>

            <Modal
                offset={0}
                open={this.props.global_data.openLoading}
                modalDidOpen={() => console.log('Loading开启')}
                modalDidClose={() => console.log('Loading关闭')}
                closeOnTouchOutside={false}
                overlayBackground='rgba(0, 0, 0, 0.25)'
                modalStyle={styles.loading}
                style={styles.modal}>
                <Image style={styles.loadingImage} source={require('../statics/images/loading9.gif')} ></Image>
                <Text style={styles.loadingText}>{this.props.global_data.loadingContent}</Text>
            </Modal>
        </View>);
    }

    // 全局Modal的用法
    // this.props.actions.showModal('','我是测试内容', [
    //     {keyTitle:'好的', callBack:()=>this.props.actions.hiddenModal()},
    //     {keyTitle:'不好', callBack:()=>{
                    // 全局Toast的用法
    //             this.props.actions.showToast('我是测试内容', 3000);
    //         }
    //     }
    // ])

    // 全局Loading的用法
    // this.props.actions.showLoading('连接中', 30000);
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    modal: {
        alignItems: 'center'
    },
    modalText: {
        textAlign: 'center',
        fontSize: 20, 
        marginBottom: 10
    },
    modalKeyContainer: {
        flexDirection:'row', 
        margin: 5, 
        height: 20
    },
    modalKey: {
        flex:1
    },
    modalKeyText: {
        textAlign: 'center'
    },
    toastText: {
        textAlign: 'center',
        fontSize: 20, 
        margin: 10
    },
    loading: {
        backgroundColor: '#FFFFFF',
        alignSelf: 'center',
        alignItems: 'center'
    },
    loadingImage: {
        width: 30,
        height: 30,
        resizeMode: 'stretch',
    },
    loadingText: {
        textAlign: 'center',
        fontSize: 16, 
        margin: 5
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