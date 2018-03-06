import React, {Component} from 'react';

import {
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    Image, Dimensions
} from 'react-native';
import {Theme} from "../../styles";

let {height, width} = Dimensions.get('window');

class Main extends Component {
    componentDidUpdate () {

    }
    render() {
        return (
            <View style={styles.container}>
                <View style={[styles.row]} >
                    <Text style={[styles.row_title]} >自动连接阈值</Text>
                    <TouchableHighlight
                        activeOpacity={Theme.active.opacity}
                        underlayColor='transparent'
                        style={[styles.row_right]}
                        onPress={() => this.props.openModal('connect_threshold')}>
                        <View style={[styles.row_edit]}>
                            <Text style={[styles.row_value]} >-40</Text>
                            <Image style={[styles.row_edit_img]} source={require('./img/edit.png')}/>
                        </View>
                    </TouchableHighlight>
                </View>
                <View style={[styles.row]} >
                    <Text style={[styles.row_title]} >标准电压</Text>
                    <TouchableHighlight
                        activeOpacity={Theme.active.opacity}
                        underlayColor='transparent'
                        style={[styles.row_right]}
                        onPress={() => this.props.openModal('std_voltage')}>
                        <View style={[styles.row_edit]}>
                            <Text style={[styles.row_value]} >5.82V</Text>
                            <Image style={[styles.row_edit_img]} source={require('./img/edit.png')}/>
                        </View>
                    </TouchableHighlight>
                </View>
                <View style={[styles.row]} >
                    <Text style={[styles.row_title]} >气压校准差值</Text>
                    <TouchableHighlight
                        activeOpacity={Theme.active.opacity}
                        underlayColor='transparent'
                        style={[styles.row_right]}
                        onPress={() => this.props.openModal('air_pressure_threshold')}>
                        <View style={[styles.row_edit]}>
                            <Text style={[styles.row_value]} >10</Text>
                            <Image style={[styles.row_edit_img]} source={require('./img/edit.png')}/>
                        </View>
                    </TouchableHighlight>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    row:{
        position:'relative',
        height:40,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        marginTop:20
    },
    row_right:{
        position:'absolute',
        right:0,
        alignItems:'center',
        justifyContent:'center'
    },
    row_title:{
        position:'absolute',
        left:0,
        fontSize:18,
        fontWeight:'bold'
    },
    row_value:{
        position:'absolute',
        right:24,
        fontSize:17
    },
    row_edit:{
        position:'absolute',
        right:0,
        height:22,
        alignItems:'center',
        justifyContent:'center'
    },
    row_edit_img:{
        position:'absolute',
        top:0,
        width:20,
        height:20,
        resizeMode:'contain'
    },
    container: {
        flex: 8,
        paddingBottom:20,
        paddingLeft:20,
        paddingRight:20,
        paddingTop:10
    }
});

export default Main;
