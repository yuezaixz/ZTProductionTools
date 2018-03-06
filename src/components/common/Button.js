import React,{Component} from 'react';
import {
    View,
    Text,
    Image,
    TouchableHighlight,
    StyleSheet
} from 'react-native';

export default class Button extends Component{

    constructor(props) {
        super(props);

    }

    render (){
        return (
            <TouchableHighlight style={this.props.style} onPress={this.props.onPress}>
                <Text style={this.props.textStyle}>{this.props.title}</Text>
            </TouchableHighlight>
        );
    }
}