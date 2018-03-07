export const SWITCH_MAIN_TAB = 'SWITCH_MAIN_TAB';

/****************搜索连接相关****************/
//HOME ACTION TYPES
export const START_SEARCH_DEVICE = 'START_SEARCH_DEVICE';
export const STOP_SEARCH_DEVICE = 'STOP_SEARCH_DEVICE';
export const UPDATE_DEVICE_LIST = 'UPDATE_DEVICE_LIST';
export const START_DEVICE_CONNECT = 'START_DEVICE_CONNECT';
export const SUCCESS_DEVICE_CONNECT = 'SUCCESS_DEVICE_CONNECT';
export const FAIL_DEVICE_CONNECT = 'FAIL_DEVICE_CONNECT';

//DEVICE ACTION TYPE
export const DEVICE_DISCONNECT = 'DEVICE_DISCONNECT';
export const SUCCESS_DEVICE_DISCONNECT = 'SUCCESS_DEVICE_DISCONNECT';
export const FAIL_DEVICE_DISCONNECT = 'FAIL_DEVICE_DISCONNECT';

/****************读取电压****************/
export const START_READ_VOLTAGE = 'START_READ_VOLTAGE';
export const READ_VOLTAGE = 'READ_VOLTAGE';

/****************板级功能测试****************/
export const START_READ_FAT = 'START_READ_FAT';
export const SUCCESS_READ_FAT = 'SUCCESS_READ_FAT';

/****************气压校准，读取电流ADC****************/
export const START_READ_FCP = 'START_READ_FCP';
export const READ_FCP = 'READ_FCP';

/****************充放气测试****************/
//进入手控模式
export const START_MANUAL = 'START_MANUAL';
export const SUCCESS_START_MANUAL = 'SUCCESS_START_MANUAL';
//充气
export const START_INFLATE = 'START_INFLATE';
export const COMPLETE_INFLATE = 'COMPLETE_INFLATE';
//放气
export const START_FLATE = 'START_FLATE';
export const COMPLETE_FLATE = 'COMPLETE_FLATE';
//退出手控模式
export const STOP_MANUAL = 'STOP_MANUAL';
export const SUCCESS_STOP_MANUAL = 'SUCCESS_STOP_MANUAL';

/****************传感器校准****************/
//开始校准,进入退出透传模式
export const START_ADJUST_SUB = 'START_ADJUST_SUB';
export const SUCCESS_START_ADJUST_SUB = 'SUCCESS_START_ADJUST_SUB';

export const STOP_ADJUST_SUB = 'STOP_ADJUST_SUB';
export const SUCCESS_STOP_ADJUST_SUB = 'SUCCESS_STOP_ADJUST_SUB';

//开始校准,进入退出校准模式
export const START_ADJUST = 'START_ADJUST';
export const SUCCESS_START_ADJUST = 'SUCCESS_START_ADJUST';

export const STOP_ADJUST = 'STOP_ADJUST';
export const SUCCESS_STOP_ADJUST = 'SUCCESS_STOP_ADJUST';

//传感器校准，1~16个传感器的校准
export const SENSOR_ADJUST = 'SENSOR_ADJUST';
export const SUCCESS_SENSOR_ADJUST = 'SUCCESS_SENSOR_ADJUST';
