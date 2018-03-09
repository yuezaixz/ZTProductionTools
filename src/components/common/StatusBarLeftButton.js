import React,{Component} from 'react';
import Button from './Button'

export default class StatusBarLeftButton extends Component{

    constructor(props) {
        super(props);

    }

    render (){
        return (
            <Button onPress={this.props.onPress} style={[{width:60},this.props.style]} textStyle={{fontSize:14,textAlign:'center'}} title={this.props.title || "返回"} />
        );
    }
}