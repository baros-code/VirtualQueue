import React, {useState} from 'react';
import {Text, View , TextInput, TouchableOpacity} from 'react-native';
import styles from './styles';
import {useRef} from 'react';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import {firebase} from '../firebase/config';

export default function PhoneVerification  ({navigation})  {
  
  const [phoneNumber, setPhoneNumber] = useState('');
  const [code, setCode] = useState('');
  const [verificationId, setVerificationId] = useState(null);
  const recaptchaVerifier = useRef(null);


  const sendVerification = () => { 
    const phoneProvider = new firebase.auth.PhoneAuthProvider();
    phoneProvider
      .verifyPhoneNumber(phoneNumber, recaptchaVerifier.current)
      .then(setVerificationId);

   };

   const confirmCode = () => { 
    const credential = firebase.auth.PhoneAuthProvider.credential(
        verificationId,
        code
      );
      firebase
        .auth()
        .signInWithCredential(credential)
        .then((result) => {
          console.log(result);
        });

    };
  

  return (
    <View style={styles.container}>
    <TextInput
        style={styles.input}
        placeholder="Phone Number"
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
        autoCompleteType="tel"
    />
    <TouchableOpacity  style={styles.button}
     onPress={sendVerification}>
      <Text>Send Verification</Text>
    </TouchableOpacity>
    <TextInput
      style={styles.input}
      placeholder="Confirmation Code"
      onChangeText={setCode}
      keyboardType="number-pad"
    />
    <TouchableOpacity  style={styles.button}
     onPress={confirmCode}>
      <Text>Send Verification</Text>
    </TouchableOpacity>
    <FirebaseRecaptchaVerifierModal
    ref={recaptchaVerifier}
    firebaseConfig={firebase.app().options}
    />
    </View>
    


  )
}