import React from 'react'
import { Text, View } from 'react-native'

export default function HomeScreen({navigation}) {
    return (
        <View>
            <Text> Hello {navigation.getParam("fullName")}</Text>
        </View>
    )
}