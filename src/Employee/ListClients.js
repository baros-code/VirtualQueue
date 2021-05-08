import React, { useContext } from 'react';
import { View, Text, StyleSheet, FlatList, Button, TouchableOpacity } from 'react-native';
import { Context as QueueContext } from '../Admin/QueueContext'  //context object
//import { Context as ImageContext } .....
import { Feather, AntDesign } from '@expo/vector-icons'; 


const ListClients = ( {navigation} ) => {

  //console.log(navigation)
  const { state } = useContext(QueueContext);

  const id = navigation.getParam('id');
  const queue = state.find(queue => queue.id === id);
    

  return (
  <View style={styles.background}>
    <FlatList
      data={queue.clients}
      keyExtractor={(item) => item.reservationId.toString()}
      renderItem={({item}) => {
        return (
        <TouchableOpacity onPress={() => navigation.navigate("ClientDetails", {id: item.id})}>
          <View style={styles.row}>     
            <Text style={styles.title}>{item.name} - {item.reservationId}</Text>
            <TouchableOpacity onPress={() => rejectitem(item.id)}>
            <AntDesign style={styles.icon}name="closecircleo" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => acceptitem(item.id)}>
              <Feather style={styles.icon} name="check-circle" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
        );
      }}
    />
  </View>
  );
};


const styles = StyleSheet.create({
  background: {
    backgroundColor: '#047DB9',
    color:"white"
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderColor: 'gray',
    color:"white"
  },
  title: {
    fontSize: 18,
    color:"white"
  },
  icon: {
    fontSize: 24,
    color:"white",
    margin: 10
  },
  link: {
    color:"red",
    margin:10,
  }
});


export default ListClients;

