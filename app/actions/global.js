import * as types from '../constants/ActionTypes';

export function showModal(title, content, keys) {
    return {type: types.SHOW_MODAL, title, content, keys}
}

export function hiddenModal() {
    return {type: types.HIDDEN_MODAL}
}