import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Dimensions
} from 'react-native';
let {height, width} = Dimensions.get('window');

import {
    Header,
    Main,
    Footer,
} from '../components/setting-view';
import Actions from '../actions';

class SettingView extends Component {
    constructor(props){
        super(props);
        this.state = {isVisible: true}
    }
    componentDidMount() {

    }
    componentWillUnmount(){

    }
    render() {
        return (
            <View style={styles.container}>
                <Header {...this.props}/>
                <Main {...this.props}/>
                <Footer {...this.props}/>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF'
    }
});

function mapStateToProps(state) {
    return {

    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Actions, dispatch)
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SettingView);

