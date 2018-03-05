import React, {Component} from 'react';
import {StackNavigator} from 'react-navigation'
import HomeView from './HomeView';
import DeviceView from './DeviceView';
import AdjustView from './AdjustView';

const RootStack = StackNavigator(
    {
        Home: {
            screen: HomeView,
        },
        Device: {
            screen: DeviceView,
        },
        Adjust: {
            screen: AdjustView,
        },
    },
    {
        initialRouteName: 'Home',
    }
);

class App extends Component {
    render() {
        return <RootStack />;
    }
}

export default App;