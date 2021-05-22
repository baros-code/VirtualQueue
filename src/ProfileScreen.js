import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, Image, Button, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons'; 
import { firebase } from './firebase/config'
import { images } from './images'
import { AuthContext } from './Authentication/AuthContext';


const ProfileScreen = ( {navigation} ) => {

    const { userToken, signOut } = useContext(AuthContext);

  // state = userData[]
  const [state, setState] = useState({});


  const deleteAccount = () => {                                 // Eğer rezervasyonu varsa silemesin?
      var auth = firebase.auth();
      signOut();
      auth.currentUser.delete().then(function() {                       // Delete from firebase-auth
          const ref = firebase.database().ref("users/"+ userToken.uid);
          ref.remove();                                                 // Delete from realtime database too.
          console.log("Account succesfully deleted.");
      }).catch(function(error) {
          console.log("Error while deleting: " + error);
      });

    
  }



  const changePassword = (email) => {
      var auth = firebase.auth();

      auth.sendPasswordResetEmail(email).then(function() {
        console.log("EMAIL SENT!");
      }).catch(function(error) {
        console.log("ERROR HAPPENED: " + error);
      });
      signOut();     //signout and navigate to login page
  }

    
  useEffect(()  => {
    const fetchUserData = async  () => {
      try {
          //console.log("HEYYYYYYYYYYYYYYYYYYY USEEFFECT CAGRILDI..........................")
          const ref = await firebase.database().ref("users/"+ userToken.uid);
          var response;
          await ref.get().then(user => {
              response = user.val();
              response.profilePhoto = images.find(image => image.name === "profilePhoto").image;
              if(response.organizationId) {
                var ref_organization = firebase.database().ref("services/bank/"+ response.organizationId);
                ref_organization.get().then(organization => {
                    if(organization.val()) {
                        response.organization = organization.val();
                        response.organizationLogo = images.find(image => image.name === response.organization.name).image; 
                        setState(response);
                    }
                });
                ref_organization = firebase.database().ref("services/hospital/"+ response.organizationId);
                ref_organization.get().then(organization => {
                    if(organization.val()) {
                        response.organization = organization.val();
                        response.organizationLogo = images.find(image => image.name === response.organization.name).image; 
                        setState(response);
                    }
                });
              }else {
                  setState(response);
              }
              
          }); 
            

      }catch (e) {
          console.log(e);
          setState(state);
      }
    };
    fetchUserData();
  }, [state]);


    return (
        <View style={styles.background}>
            <View style={{alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between'}}>
                { <Image style={styles.logo} source={state.profilePhoto} /> }
                { state.organizationLogo !== undefined ? <Image style={styles.logo} source={state.organizationLogo} /> : null }
            </View>
            <Text style={styles.label}>{state.fullName}</Text>
            { state.organization !== undefined ? <Text style={styles.label}>{state.organization.branch}</Text> : null }
            <Text style={styles.label}>{state.email}</Text>
            <Text style={styles.label}>{state.phone}</Text>
            <View style={styles.button}>
                <View style={{paddingRight: 110}}>
                    <Button title="Change password" onPress={() => changePasswordAlert(changePassword(state.email) ) }/>
                </View>
                <Button color="red" title="Delete Account" onPress={() => deleteAccountAlert(deleteAccount, navigation) }/>
            </View>
        </View>
    );

};

const changePasswordAlert = ( action ) =>
Alert.alert(
"Signing Out",
"A verification mail sent to your email address",
[
    { text: "OK", onPress: () => action }
]
);


const deleteAccountAlert = ( action, navigation ) =>
Alert.alert(
"Confirmation",
"Are you sure you want to delete your account?",
[
    { text: "Cancel", onPress: () => navigation.navigate('Profile') },
    { text: "OK", onPress: () => action() }
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
        flexDirection: 'row',
        alignSelf: "flex-end",
        margin: 10
    },
    button2: {
        marginRight: 200
    },
    logo: {
        width: 100,
        height: 100,
        margin: 10,
        borderRadius: 10
    },
    background: {
        backgroundColor: '#0e66d4'
    }
});


export default ProfileScreen;

