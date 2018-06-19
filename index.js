import { AppRegistry, YellowBox, StatusBar } from 'react-native';
import Root from './app/root';

YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);
YellowBox.ignoreWarnings(['Class RCTCxxModule']);
StatusBar.setBarStyle('light-content', true);

AppRegistry.registerComponent('ZTProductionTools', () => Root);
