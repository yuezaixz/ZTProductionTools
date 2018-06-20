import * as types from '../constants/ActionTypes';

export function showModal(title, content, keys) {
    return {type: types.SHOW_MODAL, title, content, keys}
}

export function hiddenModal() {
    return {type: types.HIDDEN_MODAL}
}

export function showToast(content, duration) {
    return async (dispatch, getState) =>{
        dispatch({type: types.SHOW_TOAST, content})
        if (duration > 0) {
            setTimeout(() => {
                dispatch({type: types.HIDDEN_TOAST})
            }, duration);
        }
    }
}

export function hiddenToast() {
    console.log('隐藏')
    return {type: types.HIDDEN_TOAST}
}

export function showLoading(content, duration) {
    return async (dispatch, getState) =>{
        dispatch({type: types.SHOW_LOADING, content})
        if (duration > 0) {
            setTimeout(() => {
                dispatch({type: types.HIDDEN_LOADING})
            }, duration);
        }
    }
}

export function hiddenLoading() {
    console.log('隐藏')
    return {type: types.HIDDEN_LOADING}
}