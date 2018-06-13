import React, {Component} from 'react';
import {StackNavigator} from 'react-navigation'
import HomeView from './HomeView';
import LogView from './LogView';
import AdjustView from './AdjustView';

const RootStack = StackNavigator(
    {
        Home: {
            screen: HomeView,
        },
        Adjust: {
            screen: AdjustView,
        },
        Log: {
            screen: LogView,
        },
    },
    {
        initialRouteName: 'Home',
        /* The header config from HomeScreen is now here */
        navigationOptions: {
            headerStyle: {
                backgroundColor: '#368877',
            },
            headerTintColor: '#368877',
            headerTitleStyle: {
                fontWeight: 'normal',
                fontSize:17,
                color:'white'
            },
        },
    }
);

class App extends Component {
    render() {
        return <RootStack />;
    }
}

export default App;