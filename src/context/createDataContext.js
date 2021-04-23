import React, { useReducer } from 'react';


export default (reducer, actions, initialState) => {
    const Context = React.createContext();

    const Provider = ({ children }) => {
        const [state, dispatch] = useReducer(reducer, initialState);

        //actions === { addBlogPost: (dispatch) => { return () => {} } }

        const boundActions = {};
        for (let key in actions) {
            //key === 'addBlogPost'
            boundActions[key] = actions[key](dispatch);
        }


        return (
            <Context.Provider value={ {state: state, ...boundActions} }>
                {children}
            </Context.Provider>
        );
    }

    return { Context, Provider };

}
