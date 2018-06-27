import * as types from '../constants/ActionTypes';

let lastTimer = null

function cancelTimer() {
    if (lastTimer) {
        clearTimeout(lastTimer)
        lastTimer = null
    }
}

export function showModal(title, content, keys) {
    cancelTimer()
    return {type: types.SHOW_MODAL, title, content, keys}
}

export function hiddenModal() {
    cancelTimer()
    return {type: types.HIDDEN_MODAL}
}

export function showToast(content, duration) {
    cancelTimer()
    return async (dispatch, getState) =>{
        dispatch({type: types.SHOW_TOAST, content})
        if (duration > 0) {
            lastTimer = setTimeout(() => {
                dispatch({type: types.HIDDEN_TOAST})
            }, duration);
        }
    }
}

export function hiddenToast() {
    cancelTimer()
    console.log('隐藏')
    return {type: types.HIDDEN_TOAST}
}

export function showLoading(content, duration) {
    cancelTimer()
    return async (dispatch, getState) =>{
        dispatch({type: types.SHOW_LOADING, content})
        if (duration > 0) {
            lastTimer = setTimeout(() => {
                dispatch({type: types.HIDDEN_LOADING})
            }, duration);
        }
    }
}

export function hiddenLoading() {
    cancelTimer()
    console.log('隐藏')
    return {type: types.HIDDEN_LOADING}
}