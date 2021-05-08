import createDataContext from './createDataContext'



const organizationReducer = (state, action) => {
    switch(action.type) {
        default:
            return state;
    }
};


export const { Context, Provider } = createDataContext(
    organizationReducer,
    {},
    [
    {id: 0, name: 'AKBANK', imageSource: '../../assets/images/akbank.png', address:'1470 Sokak No: 10 Kadam 2 İş Merkezi Kat :2 Daire :3 Karşıyaka - İzmir'},
    {id: 1, name: 'HALKBANK', imageSource: '../../assets/images/halkbank.png', address:'Konak Mahallesi Lefkoşe Caddesi Artı Ofis No:10 Kat:6 Ofis No :35 Nilüfer – İzmir'},
    {id: 2, name: 'ZIRAAT BANKASI', imageSource: '../../assets/images/ziraatbankasi.png', address:'Suadiye Mahallesi Bağdat Caddesi No:399 Alsancak / İzmir'},
    ]
);





