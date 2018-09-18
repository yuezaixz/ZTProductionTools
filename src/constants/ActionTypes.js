export const SWITCH_MAIN_TAB = 'SWITCH_MAIN_TAB';
export const SHOW_MODAL = 'SHOW_MODAL';
export const HIDDEN_MODAL = 'HIDDEN_MODAL';
export const SHOW_TOAST = 'SHOW_TOAST';
export const HIDDEN_TOAST = 'HIDDEN_TOAST';
export const SHOW_LOADING = 'SHOW_LOADING';
export const HIDDEN_LOADING = 'HIDDEN_LOADING';
export const REINIT_APP = 'REINIT_APP';

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

export const CLEAR_DEVICE_DATA = 'CLEAR_DEVICE_DATA';

export const ERROR = 'ERROR';

/****************读取电压****************/
export const START_READ_VOLTAGE = 'START_READ_VOLTAGE';
export const READ_VOLTAGE = 'READ_VOLTAGE';
export const READ_VERSION = 'READ_VERSION';
export const READ_SLEEPDATA = 'READ_SLEEPDATA';
export const READ_MACADDRESS = 'READ_MACADDRESS';
export const READ_SLEEPSTATUS = 'READ_SLEEPSTATUS';
export const START_READ_INFLATE_TIME = 'START_READ_INFLATE_TIME';
export const READ_INFLATE_TIME = 'READ_INFLATE_TIME';
export const START_OLD_TEST = 'START_OLD_TEST';
export const STOP_OLD_TEST = 'STOP_OLD_TEST';
export const SWITCH_TO_OLD = 'SWITCH_TO_OLD';
export const SWITCH_TO_OLD_FOR_STOP = 'SWITCH_TO_OLD_FOR_STOP';
export const SUCCESS_STOP_OLD_TEST = 'SUCCESS_STOP_OLD_TEST';
export const SWITCH_TO_INFLATE = 'SWITCH_TO_INFLATE';
export const SEND_OTHER_COMMAND = 'SEND_OTHER_COMMAND';
export const SUCCESS_OTHER_COMMAND = 'SUCCESS_OTHER_COMMAND';

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
