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
    }
  });

export default Organizations;
