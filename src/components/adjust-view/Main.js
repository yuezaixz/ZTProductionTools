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
                <View style={[styles.row]}>
                    <TouchableHighlight
                        activeOpacity={Theme.active.opacity}
                        underlayColor='transparent'
                        style={[styles.row_start, styles.row_button]}
                        onPress={this.handleNext}>
                        <Text style={[styles.row_button_text]}>
                            1
                        </Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                        activeOpacity={Theme.active.opacity}
                        underlayColor='transparent'
                        style={[styles.row_start, styles.row_button]}
                        onPress={this.handleNext}>
                        <Text style={[styles.row_button_text]}>
                            9
                        </Text>
                    </TouchableHighlight>
                </View>
                <View style={[styles.row]}>
                    <TouchableHighlight
                        activeOpacity={Theme.active.opacity}
                        underlayColor='transparent'
                        style={[styles.row_start, styles.row_button]}
                        onPress={this.handleNext}>
                        <Text style={[styles.row_button_text]}>
                            2
                        </Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                        activeOpacity={Theme.active.opacity}
                        underlayColor='transparent'
                        style={[styles.row_start, styles.row_button]}
                        onPress={this.handleNext}>
                        <Text style={[styles.row_button_text]}>
                            10
                        </Text>
                    </TouchableHighlight>
                </View>
                <View style={[styles.row]}>
                    <TouchableHighlight
                        activeOpacity={Theme.active.opacity}
                        underlayColor='transparent'
                        style={[styles.row_start, styles.row_button]}
                        onPress={this.handleNext}>
                        <Text style={[styles.row_button_text]}>
                            3
                        </Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                        activeOpacity={Theme.active.opacity}
                        underlayColor='transparent'
                        style={[styles.row_start, styles.row_button]}
                        onPress={this.handleNext}>
                        <Text style={[styles.row_button_text]}>
                            11
                        </Text>
                    </TouchableHighlight>
                </View>
                <View style={[styles.row]}>
                    <TouchableHighlight
                        activeOpacity={Theme.active.opacity}
                        underlayColor='transparent'
                        style={[styles.row_start, styles.row_button]}
                        onPress={this.handleNext}>
                        <Text style={[styles.row_button_text]}>
                            4
                        </Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                        activeOpacity={Theme.active.opacity}
                        underlayColor='transparent'
                        style={[styles.row_start, styles.row_button]}
                        onPress={this.handleNext}>
                        <Text style={[styles.row_button_text]}>
                            12
                        </Text>
                    </TouchableHighlight>
                </View>
                <View style={[styles.row]}>
                    <TouchableHighlight
                        activeOpacity={Theme.active.opacity}
                        underlayColor='transparent'
                        style={[styles.row_start, styles.row_button]}
                        onPress={this.handleNext}>
                        <Text style={[styles.row_button_text]}>
                            5
                        </Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                        activeOpacity={Theme.active.opacity}
                        underlayColor='transparent'
                        style={[styles.row_start, styles.row_button]}
                        onPress={this.handleNext}>
                        <Text style={[styles.row_button_text]}>
                            13
                        </Text>
                    </TouchableHighlight>
                </View>
                <View style={[styles.row]}>
                    <TouchableHighlight
                        activeOpacity={Theme.active.opacity}
                        underlayColor='transparent'
                        style={[styles.row_start, styles.row_button]}
                        onPress={this.handleNext}>
                        <Text style={[styles.row_button_text]}>
                            6
                        </Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                        activeOpacity={Theme.active.opacity}
                        underlayColor='transparent'
                        style={[styles.row_start, styles.row_button]}
                        onPress={this.handleNext}>
                        <Text style={[styles.row_button_text]}>
                            14
                        </Text>
                    </TouchableHighlight>
                </View>
                <View style={[styles.row]}>
                    <TouchableHighlight
                        activeOpacity={Theme.active.opacity}
                        underlayColor='transparent'
                        style={[styles.row_start, styles.row_button]}
                        onPress={this.handleNext}>
                        <Text style={[styles.row_button_text]}>
                            7
                        </Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                        activeOpacity={Theme.active.opacity}
                        underlayColor='transparent'
                        style={[styles.row_start, styles.row_button]}
                        onPress={this.handleNext}>
                        <Text style={[styles.row_button_text]}>
                            15
                        </Text>
                    </TouchableHighlight>
                </View>
                <View style={[styles.row]}>
                    <TouchableHighlight
                        activeOpacity={Theme.active.opacity}
                        underlayColor='transparent'
                        style={[styles.row_start, styles.row_button]}
                        onPress={this.handleNext}>
                        <Text style={[styles.row_button_text]}>
                            8
                        </Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                        activeOpacity={Theme.active.opacity}
                        underlayColor='transparent'
                        style={[styles.row_start, styles.row_button]}
                        onPress={this.handleNext}>
                        <Text style={[styles.row_button_text]}>
                            16
                        </Text>
                    </TouchableHighlight>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 8,
        paddingBottom:20
    },
    row: {
        flex:1,
        flexDirection:'row',
    },
    row_start: {
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    row_end: {
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    row_button_text: {
        textAlign:'center'
    },
    row_button: {
        backgroundColor:'#D8D8D8',
        borderColor:'#979797',
        borderWidth:1,
        borderRadius:4,
        marginLeft:25,
        marginRight:25,
        marginTop:5,
        marginBottom:10
    }
});

export default Main;
