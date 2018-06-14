//colors
import { Dimensions } from 'react-native';
let winSize = Dimensions.get('window');

const color = {
    green: '#00551e',
    brown: '#693504',
    red: '#db2828',
    separatorColor: '#3E9583'
}

const font = {
    common: {
        fontSize: 32/winSize.scale,
        color: '#FFFFFF',
    }
}

const constant = {
    topPadding: 15,
    leftRightPadding: 20
}

//other
const active = {
    opacity: 0.6
}

export default {color, active, font, constant}
