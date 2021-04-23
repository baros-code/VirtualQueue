import createDataContext from './createDataContext'

//ID LERI RANDOM ATTIRABILIRIZ

const UserReducer = (state, action) => {
    switch(action.type) {
        case 'add_User':
            const User_ID = Math.floor((Math.random() * 100000) + 1);
            return [...state, { id: User_ID , clientId: action.payload.clientId, transactionType: action.payload.transactionType, date: action.payload.date, organizationName: action.payload.organizationName} ];
        case 'delete_User':
            return state.filter(User => User.id !== action.payload);
        default:
            return state;
    }
};


const addUser = dispatch => {
    return (clientId, transactionType,date,organizationName,callback) => {
        dispatch( {type: 'add_User', payload: {clientId: clientId, transactionType: transactionType, date: date, organizationName: organizationName}});
        if(callback) {
            callback();
        }
        
    };
};

const deleteUser = dispatch => {
    return (id, callback) => {
        dispatch( {type: 'delete_User', payload: id} );
        if(callback) {
            callback();
        }
    };
};


export const { Context, Provider } = createDataContext(
    UserReducer,
    { addUser, deleteUser},
    [{id: 155, name: "Baran Ateş", email: "baranates229@gmail.com",reservation: {id: 2057, clientId: 0, transactionType: 'TEST TYPE', date: 'Mon,29 Mar 2021 06:00:00', organizationName: 'AKBANK'} },
    {id: 135, name: "Kemal Selçuk Kaplan", email: "kemalkaplan63@gmail.com",reservation: {id: 4098, clientId: 0, transactionType: 'TEST TYPE', date: 'Mon,29 Mar 2021 06:00:00', organizationName: 'AKBANK'} },
]
);





