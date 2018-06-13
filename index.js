import { AppRegistry, YellowBox } from 'react-native';
import Root from './app/root';

YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);

AppRegistry.registerComponent('ZTProductionTools', () => Root);
