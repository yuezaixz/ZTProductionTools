import * as types from '../constants/ActionTypes';

const initialState = {
    openModal: false,
    openToast: false,
    openLoading: false
}

export default function(state = initialState, action) {
    switch(action.type) {
        case types.SHOW_MODAL:
            var temp = {...state, 
                ...initialState, 
                openModal: true, 
                modalTitle: action.title, 
                modalContent: action.content,
                modalKeys: action.keys
            };
            return temp;
        case types.HIDDEN_MODAL:
            var temp = {...state, ...initialState, openModal: false};
            return temp;
        case types.SHOW_TOAST:
            var temp = {...state, 
                ...initialState, 
                openToast: true,  
                toastContent: action.content
            };
            return temp;
        case types.HIDDEN_TOAST:
            var temp = {...state, ...initialState, openToast: false};
            return temp;
        case types.SHOW_LOADING:
            var temp = {...state, 
                ...initialState, 
                openLoading: true,  
                loadingContent: action.content
            };
            return temp;
        case types.HIDDEN_LOADING:
            var temp = {...state, ...initialState, openLoading: false};
            return temp;

    }

    return state;
}