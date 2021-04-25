import React from 'react'
import { Text, View } from 'react-native'
import styles from "./styles"

export default function HomeScreen({navigation}) {

    return (
        <View style={styles.container}>
            <Text> Hello {navigation.getParam("fullName")}</Text>
        </View>
    )
    }