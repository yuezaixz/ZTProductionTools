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
            // headerStyle: {
            //     backgroundColor: '#f4511e',
            // },
            headerTintColor: '#000',
            headerTitleStyle: {
                fontWeight: 'bold',
                fontSize:17
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