import React, { useEffect, useState } from 'react';

import { View, Text, StyleSheet, Image, Button } from 'react-native';
import { Feather } from '@expo/vector-icons'; 
import { firebase } from '../firebase/config'




const ProfileScreen = ( {navigation} ) => {

  const USER_ID = navigation.getParam("uid");

  // state = userData[]
  const [state, setState] = useState([]);



    
  useEffect(()  => {
    const fetchUserData = async  () => {
      try {
          const ref = await firebase.database().ref("users/"+ USER_ID);
          var response;
          await ref.get().then(user => {
              response = user.val();
          }); 
      setState(response);   

      }catch (e) {
          console.log(e);
          setState(state);
      }
    };
    fetchUserData();
  }, [state]);

 
    return (
        <View>
        <Image style={imageStyle} source={imageSource} />
        <Image style={imageStyle} source={imageSource} />
        <Text style={styles.label}>Organization: {state.organizationName}</Text>
        <Text style={styles.label}>Date and Time: {state.date}</Text>
        <Text style={styles.label}>Reservation Number: {id}</Text>
        <Text style={styles.label}>Transaction Type: {state.transactionType}</Text>
        <View style={styles.button}>
            <Button  color='red' title="Cancel" onPress={() => createTwoButtonAlert(deleteReservation, navigation) }/>
        </View>
    </View>
      );

};


const createTwoButtonAlert = ( action, navigation ) =>
    Alert.alert(
    "Confirmation",
    "Are you sure you want to cancel the reservation?",
    [
        { text: "Cancel", onPress: () => navigation.navigate('Details',{id: navigation.getParam('id')}) },
        { text: "OK", onPress: () => action(navigation.getParam('id'), () => navigation.navigate('ClientDashboard'))}
    ]
    );

/*Whenever React renders ProfileScreen, react-navigation automatically
calls the navigationOptions function.
 */

// ProfileScreen.navigationOptions = ( {navigation} ) => {
//   return {
//     title: "Hello, " + navigation.getParam("fullName"),
//   };
// };

const styles = StyleSheet.create({
    icon: {
        fontSize: 24
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
        marginRight: 10
    }
});


export default ProfileScreen;

