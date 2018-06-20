import * as types from '../constants/ActionTypes';

const initialState = {
    openModal: false,
}

export default function(state = initialState, action) {
    switch(action.type) {
        case types.SHOW_MODAL:
            var temp = {...state, 
                openModal: true, 
                modalTitle: action.title, 
                modalContent: action.content,
                modalKeys: action.keys
            };
            return temp;
        case types.HIDDEN_MODAL:
            var temp = {...state, openModal: false};
            return temp;

    }

    return state;
}