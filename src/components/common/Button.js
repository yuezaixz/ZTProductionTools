import React,{Component} from 'react';
import {
    View,
    Text,
    Image,
    TouchableHighlight,
    StyleSheet
} from 'react-native';

import {Theme} from "../../styles";

export default class Button extends Component{

    constructor(props) {
        super(props);

    }

    render (){
        return (
            <TouchableHighlight
                style={this.props.style}
                activeOpacity={Theme.active.opacity}
                underlayColor='transparent'
                onPress={this.props.onPress}>
                <Text style={this.props.textStyle}>{this.props.title}</Text>
            </TouchableHighlight>
        );
    }
}