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
        setTimeout(() => {
            dispatch({type: types.HIDDEN_TOAST})
        }, duration);
    }
}

export function hiddenToast() {
    console.log('隐藏')
    return {type: types.HIDDEN_TOAST}
}