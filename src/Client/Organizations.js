import React, { useContext } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Image} from 'react-native';
import OrganizationDetails from '../components/OrganizationDetails';
import {Context as OrganizationContext} from '../context/OrganizationContext';

/*
OrganizationsContext oluşturulup Reservationlar gibi 
databaseden çekilecek, şimdilik manuel koyuyoruz.
FlatList ile gösterilecek OrganizationDetails
*/

const Organizations = ( {navigation} ) => {

    const { state } = useContext(OrganizationContext);

    // const state =  [
    // {id: 0, name: 'AKBANK', imageSource: require('../../assets/images/akbank.png'), address:'1470 Sokak No: 10 Kadam 2 İş Merkezi Kat :2 Daire :3 Karşıyaka - İzmir'},
    // {id: 1, name: 'HALKBANK', imageSource: require('../../assets/images/halkbank.png'), address:'Konak Mahallesi Lefkoşe Caddesi Artı Ofis No:10 Kat:6 Ofis No :35 Nilüfer – İzmir'},
    // {id: 2, name: 'ZIRAAT BANKASI', imageSource: require('../../assets/images/ziraatbankasi.png'), address:'Suadiye Mahallesi Bağdat Caddesi No:399 Alsancak / İzmir'},
    // ];
    const clientId = navigation.getParam('clientId');
    const clientName = navigation.getParam('clientName');

    return (
    <View>
        <FlatList
            data={state}
            keyExtractor={(organization) => organization.id.toString()}
            renderItem={({item}) => {
            return (
                <TouchableOpacity onPress={() => navigation.navigate("CreateReservation", {id: item.id, name: item.name, clientId: clientId, clientName: clientName})}>
                    <View style={styles.row}>
                        <OrganizationDetails
                        imageSource={item.imageSource}
                        name={item.name}
                        address={item.address}
                        />
                    </View>
                </TouchableOpacity>
            );
            }}
    />
    </View>
    );
};

const styles = StyleSheet.create({
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 70,
      paddingHorizontal: 10,
      borderTopWidth: 1,
      borderColor: 'white',
    },
  });

export default Organizations;
