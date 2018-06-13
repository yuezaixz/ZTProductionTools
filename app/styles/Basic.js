import { StyleSheet, Dimensions } from 'react-native';
let winSize = Dimensions.get('window');
const Basic = StyleSheet.create({
    text: {
        fontSize: 32/winSize.scale
    },
    down: {
        transform: [{rotateX:'180deg'}]
    }
});
export default Basic;

