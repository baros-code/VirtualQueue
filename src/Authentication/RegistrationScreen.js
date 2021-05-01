
import React, { useState } from 'react'
import { Image, RefreshControlBase, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';
import { firebase } from '../firebase/config'

export default function RegistrationScreen({navigation}) {
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
   // const [phoneNumber, setPhoneNumber] = useState('')

    const onFooterLinkPress = () => {
        navigation.navigate('Login')
    }
  
    const isMailExist= async () => {
        let mailFlag=false;
        const usersRef =await firebase.database().ref("users/")
        await usersRef.once("value",function (usersSnapShot) {
            usersSnapShot.forEach(userSnapShot => {
                let user=userSnapShot.val()
                let currentMail=user.email
                if (currentMail == email) {
                    mailFlag=true;
                }
            });
        })
       return mailFlag
    }

    const isSpellValid=(text) => {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return reg.test(text)
    }

    const onRegisterPress = async () => {
        if (!fullName || !email || !password ) {
            alert("Please fill all blanks.")
            return
        }
        if (password.length < 6) {
            alert("password must contain at least 6 character.")
            return
        }

        if (password !== confirmPassword) {
            alert("Passwords don't match.")
            return
        }        
        if (!isSpellValid(email)) {
            alert("Email format is wrong!")
            return
        }
        const mailFlag=await isMailExist()
        if (mailFlag) {
            alert("Mail is alerady used")
            return
        }
        const item={email:email,password:password,fullName:fullName};
        navigation.navigate("PhoneVerification",item)
    }
        
  
                    
    

    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView
                style={{ flex: 1, width: '100%' }}
                keyboardShouldPersistTaps="always">
                <Image
                    style={styles.logo}
                    source={require('../../assets/queue-icon.jpg')}
                />
                <TextInput
                    style={styles.input}
                    placeholder='Full Name'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => setFullName(text)}
                    value={fullName}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder='E-mail'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholderTextColor="#aaaaaa"
                    secureTextEntry
                    placeholder='Password'
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholderTextColor="#aaaaaa"
                    secureTextEntry
                    placeholder='Confirm Password'
                    onChangeText={(text) => setConfirmPassword(text)}
                    value={confirmPassword}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => onRegisterPress()}>
                    <Text style={styles.buttonTitle}>Next</Text>
                </TouchableOpacity>
                <View style={styles.footerView}>
                    <Text style={styles.footerText}>Already got an account? <Text onPress={onFooterLinkPress} style={styles.footerLink}>Log in</Text></Text>
                </View>
            </KeyboardAwareScrollView>
        </View>
    )
}