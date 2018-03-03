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
                <Text style={[styles.text, styles.title]}>
                    {this.props.device_data.name}:{this.props.device_data.uuid}
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        paddingTop:20,
        height: 100
    },
    text: {
        color: '#E85613'
    },
    title: {
        width: width,
        textAlign: 'center',
        fontSize: 20
    }
});

export default Header;
