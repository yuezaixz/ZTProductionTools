import React, { Component } from 'react';

import {
    StyleSheet,
    Dimensions,
    Text,
    View
} from 'react-native';

import CircleProgress from './CircleProgress'

let {height, width} = Dimensions.get('window');

class Loading extends Component {

    static LOADING_WIDTH = 100;
    static LOADING_HEIGHT = 80;

    isShown = false
    state = {
        loading: (<View />),
    }
    offsetX = 0
    offsetY = -150
    timeout = 0
    onLoadingTimeout = 0
    timeoutEvent = undefined

        static defaultProps = {
        pointerEvents: false,
        timeout: 0,
    };

    constructor(props) {
        super(props);
        this.timeout = props.timeout;
        this.onLoadingTimeout = props.onLoadingTimeout;
    }

    render() {
        return this.state.loading;
    }

    show(text, pointerEvents) {
        if (!this.isShown) {
            if (typeof(text) == 'boolean') {
                pointerEvents = text;
                text = '';
            }
            text = text ? text : this.props.text;
            this.setState({
                loading: this._getLoading({
                    ...this.props,
                    text: text,
                    pointerEvents: pointerEvents
                })
            });
            if (this.timeout > 0) {
                this.timeoutEvent = setTimeout(() => {
                    if (this.isShown) {
                        this.dismiss();
                        this.onLoadingTimeout && this.onLoadingTimeout();
                    }
                }, this.timeout);
            }
            this.isShown = true;
        }
    }

    dismiss() {
        if (this.isShown) {
            this.setState({
                loading: (<View />)
            });
            this.isShown = false;
            this.timeoutEvent && clearInterval(this.timeoutEvent);
        }
    }

    setLoadingOffset(x, y) {
        this.offsetX = x;
        this.offsetY = y;
        return this;
    }

    setLoadingTimeout(timeout, onLoadingTimeout) {
        this.timeout = timeout;
        this.onLoadingTimeout = onLoadingTimeout;
        return this;
    }

    clearLoadingTimeout() {
        this.timeout = 0;
        this.onLoadingTimeout = undefined;
    }

    isShown() {
        return this.isShown;
    }

    _getLoading(props) {
        let offsetStyle = {};
        if (this.offsetY != 0 || this.offsetX != 0) {
            offsetStyle.top = height / 2 + this.offsetY / 2 - Loading.LOADING_HEIGHT / 2;
            offsetStyle.left = width / 2 + this.offsetX / 2 - Loading.LOADING_WIDTH / 2;
        }
        return (
            <View pointerEvents={!!props && props.pointerEvents ? 'none' : 'auto'} style={styles.container}>
                <View pointerEvents={'none'} style={[styles.loadingBg]} />
                <View style={[styles.loadingBody, offsetStyle]}>
                    <CircleProgress />
                    <Text style={[styles.loadingText, props.textStyle]}>
                        {!!props && props.text ? props.text : 'Loading...'}
                    </Text>
                </View>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'transparent',
        position: 'absolute',
        top: 0,
        width: width,
        height: height
    },
    loadingBg: {
        position: 'absolute',
        top: 0,
        width: width,
        height: height,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    loadingBody: {
        width: 100,
        height: 80,
        position: 'absolute',
        top: height / 2 - Loading.LOADING_HEIGHT / 2,
        left: width / 2 - Loading.LOADING_WIDTH / 2,
        borderRadius: 5,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        alignItems: 'center',
        justifyContent: 'center'
    },
    loadingText: {
        color: 'white',
        backgroundColor: 'transparent'
    }
});

export default Loading;