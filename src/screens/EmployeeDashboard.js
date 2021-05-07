import React, { useContext } from 'react';
import { View, Text, StyleSheet, FlatList, Button, TouchableOpacity } from 'react-native';
//import { Context as ImageContext } .....
import { Feather } from '@expo/vector-icons'; 


const AdminDashboard = ( {navigation} ) => {

  //console.log(navigation)

  const { state, resetQueue } = useContext(QueueContext);

    
  return (
  <View style={styles.background}>
    <FlatList
      data={state}
      keyExtractor={(queue) => queue.transactionType}
      renderItem={({item}) => {
        return (
        <TouchableOpacity onPress={() => navigation.navigate("QueueDetails", {id: item.id})}>
          <View style={styles.row}>     
            <View style={styles.content}>
                <Text style={styles.title}>{item.transactionType} -  {item.clients[0] == null ? `Current client: none` : `Current client: ${item.clients[0].reservationId}` }  </Text> 
            </View>
            
          </View>
        </TouchableOpacity>
        );
      }}
    />
  </View>
  );
};

AdminDashboard.navigationOptions = ( {navigation} ) => {
  return {
    headerRight: () => (
      <TouchableOpacity onPress={() => navigation.navigate('CreateQueue')}>
        <Feather style={styles.icon} name="plus" size={30} />
      </TouchableOpacity>
    ),
  };
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
  content: {
      
  },
  title: {
    fontSize: 18,
    color:"white"
  },
  icon: {
    fontSize: 24,
    color:"white"
  },
  link: {
    color: 'red',
    margin: 10
  },
});


export default AdminDashboard;
