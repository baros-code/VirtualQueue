import React, { Component } from 'react'
import {
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  View,
  Text,
  Image,
  TextInput
} from 'react-native'
import {firebase} from '../firebase/config'
import {useState} from "react"
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {useRef} from 'react';

export default function phoneAuthentication ({navigation}) {

    const [phone, setPhone] = useState('');
    const [confirmResult, setResult] = useState(null);
    const [verificationCode, setVerification] = useState("");
    const [userId,setUserId]=useState("");
    const recaptchaVerifier = useRef(null);

  const validatePhoneNumber = () => {
    let regexp = /^\+[0-9]?()[0-9](\s|\S)(\d[0-9]{8,16})$/
    console.log(phone);
    return regexp.test(phone)
  }

  const isPhoneExist= async () => {
      let isExist=false;
      const usersRef =await firebase.database().ref("users/")
      await usersRef.once("value",function (usersSnapShot) {
          usersSnapShot.forEach(userSnapShot => {
              let currentPhone=userSnapShot.val().phone
              console.log(currentPhone + " =="  + phone)
              if (currentPhone === phone) {
                  isExist=true
              }
          });
      })
      return isExist
   
  }

  const handleSendCode = async () => {
    // Request to send OTP
    if (validatePhoneNumber())  {
        const phoneExist=await isPhoneExist()
    if (!(phoneExist)) {      
      firebase
        .auth()
        .signInWithPhoneNumber(phone,recaptchaVerifier.current)
        .then(confirmResult => {
         setResult(confirmResult)
        })
        .catch(error => {
          alert(error.message)
          console.log(error)
        })
    } else {
      alert('Phone is already used')
      return
    }
    } else {
      alert('Invalid phone number')
      return
    }
  }

  const changePhoneNumber = () => {
      setResult(null);
      setVerification("")
  }

  const handleVerifyCode = () => {
    // Request for OTP verification
    if (verificationCode.length == 6) {
        const email=navigation.getParam("email");
        const password=navigation.getParam("password");
        const fullName=navigation.getParam("fullName");
        console.log(email,password,fullName)
      confirmResult
        .confirm(verificationCode)
        .then(() => {
        firebase
          .auth()
          .createUserWithEmailAndPassword(email,password)
          .then((response) => {
              const role=0
              const uid = response.user.uid
              const data = {
                  email,
                  fullName,
                  phone,
                  role,
              };
              const usersRef = firebase.database().ref("users/" + uid)
              usersRef
                  .set(data)
                  .then(() => {
                      if  (data.role === 0) 
                        navigation.navigate('ClientDashboard', data)
                     else if(data.role === 1)
                        navigation.navigate('EmployeeDashboard', data);
                      else if(data.role === 2) 
                        navigation.navigate('AdminDashboard', data);      
                     else
                        alert("Undefined role!");
                  })
                  .catch((error) => {
                      alert(error)
                  });
          })
          .catch((error) => {
              alert(error)
          });
        })
        .catch(error => {
          alert(error.message)
          console.log(error)
        })
    } else {
      alert('Please enter a 6 digit OTP code.')
    }
  }

  const renderConfirmationCodeView = () => {
    return (
      <View style={styles.verificationView}>
        <TextInput
          style={styles.textInput}
          placeholder='Verification code'
          placeholderTextColor='#eee'
          value={verificationCode}
          keyboardType='numeric'
          onChangeText={verificationCode => {
            setVerification(verificationCode)
          }}
          maxLength={6}
        />
        <TouchableOpacity
          style={[styles.themeButton, { marginTop: 20 }]}
          onPress={handleVerifyCode}>
          <Text style={styles.themeButtonTitle}>Verify Code</Text>
        </TouchableOpacity>
      </View>
    )
  }

  
    return (
        
      <SafeAreaView style={styles.container}>
          <KeyboardAwareScrollView
           style={{ flex: 1, width: '100%' }}
                keyboardShouldPersistTaps="always">
            <Image
                style={styles.logo}
                source={require('../../assets/queue-icon.jpg')}
            />
        <View style={styles.page}>
          <TextInput
            style={styles.textInput}
            placeholder='Phone Number with country code'
            placeholderTextColor='#aaaaaa'
            keyboardType='phone-pad'
            value={phone}
            onChangeText={phone => {
             setPhone(phone)
            }}
            maxLength={15}
            editable={confirmResult ? false : true}
          />

          <TouchableOpacity
            style={[styles.themeButton, { marginTop: 20 }]}
            onPress={
              confirmResult
                ? changePhoneNumber
                : handleSendCode
            }>
            <Text style={styles.themeButtonTitle}>
              {confirmResult ? 'Change Phone Number' : 'Send Code'}
            </Text>
          </TouchableOpacity>
          <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={firebase.app().options}
    />

          {confirmResult ? renderConfirmationCodeView() : null}
        </View>
        </KeyboardAwareScrollView>
        </SafeAreaView>
      
    )
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0e66d4'
  },
  page: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  textInput: {
    marginTop: 20,
    width: '90%',
    height: 48,
   // borderColor: '#555',
    //borderWidth: 2,
    borderRadius: 5,
    paddingLeft: 10,
    fontSize: 16,
    backgroundColor:"white"
  },
  themeButton: {
    width: '90%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#41c3ea',
    //borderColor: '#555',
    //borderWidth: 2,
    borderRadius: 5
  },
  themeButtonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff'
  },
  verificationView: {
    width: '100%',
    alignItems: 'center',
    marginTop: 50
  },
  logo: {
    flex: 1,
    height: 120,
    width: 90,
    alignSelf: "center",
    margin: 30,
    borderRadius:30
},
})

