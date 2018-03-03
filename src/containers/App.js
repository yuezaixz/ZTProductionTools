import React, {Component} from 'react';
import {StackNavigator} from 'react-navigation'
import HomeView from './HomeView';
import DeviceView from './DeviceView';

const RootStack = StackNavigator(
    {
        Home: {
            screen: HomeView,
        },
        Device: {
            screen: DeviceView,
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