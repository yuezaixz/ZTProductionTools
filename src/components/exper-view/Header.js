import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableHighlight,
    Dimensions
} from 'react-native';

let {height, width} = Dimensions.get('window');

class Header extends Component {
    render() {
        return (
            <View style={styles.container}>
                {/*<Text style={[styles.text, styles.title]}>*/}
                    {/*枕头固件测试*/}
                {/*</Text>*/}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex:0.4,
        justifyContent:'center'
    },
    text: {
        color: '#000000'
    },
    title: {
        alignSelf:'center',
        width: width,
        textAlign: 'center',
        fontSize: 20,
    }
});

export default Header;
