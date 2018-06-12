import React, {Component} from 'react';

import {
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    Image,
    Dimensions,
    ScrollView
} from 'react-native';
import {Theme} from "../../styles";

class Main extends Component {
    componentDidUpdate () {

    }
    render() {
        return (
            <View style={styles.container}>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 8,
        paddingBottom:20
    }
});

export default Main;
