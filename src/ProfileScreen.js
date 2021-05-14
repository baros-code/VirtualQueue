import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Button, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons'; 
import { firebase } from './firebase/config'
import { images } from './images'



const ProfileScreen = ( {navigation} ) => {

  const USER_ID = navigation.getParam("uid");

  // state = userData[]
  const [state, setState] = useState([]);


  const deleteAccount = (callback) => {
      var auth = firebase.auth();
      auth.signOut().then(function() {
        console.log("Sign Out succesful.");
      }).catch(function(error) {
        console.log("Error while signing out: " + error);
      });

      if(callback)
        callback();
        
      auth.currentUser.delete().then(function() {
          console.log("Account succesfully deleted.");
      }).catch(function(error) {
          console.log("Error while deleting: " + error);
      });

  }



  const changePassword = (email, callback) => {
      var auth = firebase.auth();

      auth.sendPasswordResetEmail(email).then(function() {
        console.log("EMAIL SENT!");
      }).catch(function(error) {
        console.log("ERROR HAPPENED: " + error);
      });
      auth.signOut().then(function() {
          console.log("Sign Out succesful.");
      }).catch(function(error) {
          console.log("Error while signing out: " + error);
      });

      if(callback)
        callback();     //navigate to loginpage
  }

    
  useEffect(()  => {
    const fetchUserData = async  () => {
      try {
          const ref = await firebase.database().ref("users/"+ USER_ID);
          var response;
          await ref.get().then(user => {
              response = user.val();
              response.profilePhoto = images.find(image => image.name === "profilePhoto").image;
              if(response.organizationId) {
                var ref_organization = firebase.database().ref("services/bank/"+ response.organizationId);
                ref_organization.get().then(organization => {
                    if(organization.val()) {
                        response.organizationName = organization.val().name;
                        response.organizationLogo = images.find(image => image.name === response.organizationName).image; 
                        setState(response);
                    }
                });
                ref_organization = firebase.database().ref("services/hospital/"+ response.organizationId);
                ref_organization.get().then(organization => {
                    if(organization.val()) {
                        response.organizationName = organization.val().name;
                        response.organizationLogo = images.find(image => image.name === response.organizationName).image; 
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
        <View>
            { <Image style={styles.logo} source={state.profilePhoto} /> }
            <Text style={styles.label}>{state.fullName}</Text>
            { state.organizationLogo !== undefined ? <Image style={styles.logo} source={state.organizationLogo} /> : null }
            { state.organizationName !== undefined ? <Text style={styles.label}>{state.organizationName}</Text> : null }
            <Text style={styles.label}>{state.email}</Text>
            <Text style={styles.label}>{state.phone}</Text>
            <View style={styles.button}>
                <View style={{paddingRight: 110}}>
                    <Button title="Change password" onPress={() => changePasswordAlert(changePassword(state.email, () => navigation.navigate("Login") ) ) }/>
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
    { text: "Cancel", onPress: () => navigation.navigate('ProfileScreen',{id: navigation.getParam('uid')} ) },
    { text: "OK", onPress: () => action(() => navigation.navigate('Login'))}
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
    }
});


export default ProfileScreen;

