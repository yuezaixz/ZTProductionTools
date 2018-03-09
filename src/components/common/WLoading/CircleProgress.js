import React, { Component } from 'react';
import {
    StyleSheet,
    ActivityIndicator,
} from 'react-native';

class CircleProgress extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <ActivityIndicator
                animating={true}
                color='white'
                style={styles.centering}
                size='small'
            />
        );
    }
}

const styles = StyleSheet.create({
    container: {

    },
    centering: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
        width: 40
    }

});

export default CircleProgress;