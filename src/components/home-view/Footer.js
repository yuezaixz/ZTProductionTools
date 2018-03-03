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
    handleSearch = ()=>{
        if (!this.props.home_data.isReadingVersion) {
            this.props.actions.startReadVersion();
        }
    }
    render() {
        return (
            <TouchableHighlight
                activeOpacity={Theme.active.opacity}
                underlayColor='transparent'
                onPress={this.handleSearch}>
                <View style={styles.container}>
                    <Text style={[styles.text, styles.title]}>
                        {this.props.home_data.isSearching?'停止搜索':'开始搜索'}
                    </Text>
                </View>
            </TouchableHighlight>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: width,
        height: 40,
        borderWidth:1,
        borderRadius:10,
        backgroundColor:'#AAAAAA',
        position:'absolute',
        bottom:20,
        alignItems:'center',
        justifyContent:'center'
    },
    text: {
        color: '#E85613'
    },
    title: {
        textAlign: 'center',
        fontSize: 20,
        position:'relative'
    }
});

export default Footer;
