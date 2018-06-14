import { AppRegistry, YellowBox } from 'react-native';
import Root from './app/root';

YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);
YellowBox.ignoreWarnings(['Class RCTCxxModule']);

AppRegistry.registerComponent('ZTProductionTools', () => Root);
