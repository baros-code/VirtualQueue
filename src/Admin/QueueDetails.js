import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button } from 'react-native';
import { Feather } from '@expo/vector-icons'; 


const QueueDetails = ({ navigation }) => {
   // const { state } = useContext(QueueContext);

    const id = navigation.getParam('id');

    // state === [] of queues
    const queue = state.find((queue) => queue.id === id);
    const capacity=((queue.finishTime - queue.startTime)*60) / queue.interval

    return (
    <View>
        <Text style={styles.label}>Employee --- {queue.employee}</Text>
        <Text style={styles.label}>Queue Type --- {queue.transactionType}</Text>
        <Text style={styles.label}>Latency --- {queue.latency} minutes</Text>
        <Text style={styles.label}>Slot Interval --- {queue.interval} minutes</Text>
        <Text style={styles.label}>Working Hours --- {queue.startTime}.00-{queue.finishTime}.00</Text>
        <Text style={styles.label}>Capacity ---{capacity} people</Text>
        <Text style={styles.label}> {(queue.clients == null || queue.clients[0] == null) ? `Current client: none` : `Current client:  ${queue.clients[0].name} / ${queue.clients[0].reservationId}` }  </Text>
        
        <View style={styles.button}>
          <Button style={styles.button} title="Display Queue" onPress={() => navigation.navigate("ListClients", {id: queue.id}) } /> 
        </View>
    </View>
    );
};  

QueueDetails.navigationOptions = ( {navigation} ) => {
  return {
    headerRight: () => (
      <TouchableOpacity onPress={() => navigation.navigate('EditQueue',{id: navigation.getParam('id')})}>
        <Feather style={styles.icon} name="edit-2" size={30} />
      </TouchableOpacity>
    ),
  };
};

const styles = StyleSheet.create({
  icon: {
    fontSize: 24,
    color:"white",
  },
  label: {
    fontSize: 18,
    borderWidth: 1,
    borderColor: 'black',
    marginBottom: 15,
    padding: 5,
    margin: 5,
    color: 'white'
  },
  button: {
    alignSelf: 'flex-end',
    marginRight: 10,
    paddingTop: 70
}
});


export default QueueDetails;