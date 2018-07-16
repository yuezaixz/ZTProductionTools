import React,{Component} from 'react';
import {
    View,
    Text,
    Animated,
    Easing,
    StyleSheet,
    Dimensions
} from 'react-native';

import {Theme, BasicStyle} from "../styles";
let {height, width} = Dimensions.get('window');
let winSize = Dimensions.get('window');

export default class SearchingView extends Component{

    state = {
        firstScale: new Animated.Value(0),
        secondScale: new Animated.Value(0),
        firstAlpha: new Animated.Value(1),
        secondAlpha: new Animated.Value(1)
    }

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.startAnimation1()
        setTimeout(() => {
            this.startAnimation2()
        }, 2000);
    }

    startAnimation1() {
        this.state.firstScale.setValue(0.3)
        this.state.firstAlpha.setValue(1)
        Animated.parallel([
            Animated.timing(this.state.firstScale,{
                toValue: 1,
                duration: 1300,
                easing: Easing.in(Easing.linear)
            }),
            Animated.timing(this.state.firstAlpha,{
                toValue: 0,
                duration: 1300,
                easing: Easing.in(Easing.linear)
            }),
        ]).start(()=>{
            this.state.firstScale.setValue(0)
            this.startAnimation1()}
        )
    }

    startAnimation2() {
        this.state.secondScale.setValue(0.3)
        this.state.secondAlpha.setValue(1)
        Animated.parallel([
            Animated.timing(this.state.secondScale,{
                toValue: 1,
                duration: 1300,
                easing: Easing.in(Easing.linear)
            }),
            Animated.timing(this.state.secondAlpha,{
                toValue: 0,
                duration: 1300,
                easing: Easing.in(Easing.linear)
            }),
        ]).start(()=>{
            this.state.secondScale.setValue(0)
            this.startAnimation2()}
        )
    }

    render (){
        return (
            <View style={styles.status}>
                <View style={styles.searching_device} >
                    <Animated.View style={[styles.loadings, {
                        transform: [
                            {scale:this.state.firstScale}
                        ],
                        opacity: this.state.firstAlpha
                    }]}>

                    </Animated.View>
                    <Animated.View style={[styles.loadings, {
                        transform: [
                            {scale:this.state.secondScale}
                        ],
                        opacity: this.state.secondAlpha,
                    }]}>

                    </Animated.View>
                    <Text style={styles.loadingText}>搜索中</Text>
                </View>
                <View style={styles.status_bottom_view} >
                    <Text style={styles.process_text} >请靠近Deeper护颈枕</Text>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    status: {
        height:'38%',
        width: width,
        borderBottomWidth: 1,
        borderColor: Theme.color.separatorColor,
        alignItems: 'center',
        justifyContent: 'center',
    },
    searching_device: {
        width: 180,
        height: 180,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadings: {
        width: 180,
        height: 180,
        borderWidth:4,
        borderColor:'white',
        borderRadius: 90,
        position: 'absolute'
    },
    loadingText: {
        ...Theme.font.common
    },
    status_bottom_view: {
        position: 'absolute',
        bottom:5,
        width: '100%',
        height: 20
    },
    process_text: {
        width: '100%',
        lineHeight: 20,
        height: 20,
        textAlign: 'center',
        fontSize: 14,
        color: 'orange'
    },
});