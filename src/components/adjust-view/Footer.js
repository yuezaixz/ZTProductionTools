import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableHighlight,
    Dimensions
} from 'react-native';
import {Theme} from "../../styles";

let {height, width} = Dimensions.get('window');

class Footer extends Component {
    render() {
        return (
            <View style={styles.container} >

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1
    }
});

export default Footer;
