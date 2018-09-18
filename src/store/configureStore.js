import { AsyncStorage } from 'react-native';
import { applyMiddleware, createStore, compose } from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger'
import reducers from '../reducers';

var isDebuggingInChrome = __DEV__ && !!window.navigator.userAgent;
var logger = createLogger({
    predicate: (getState, action) => isDebuggingInChrome,
    collapsed: true,
    duration: true,
});

//a dirty way to clear persisted old state
//Todo: if you've ran the old TodoRN version, uncomment this before get started.
//(async () => await AsyncStorage.clear())();
var middlewares = compose(applyMiddleware(thunk, logger));

export default function configureStore() {
    console.log(111,reducers)
    const store = createStore(reducers, undefined, middlewares);
    console.log(22)
    if (isDebuggingInChrome) {
        window.store = store;
    }
    return store;
}