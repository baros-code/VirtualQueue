import React, {useState} from 'react';
import ScrollPicker from '../ScrollPicker';
import {View, Text, StyleSheet} from 'react-native';

export default function  SimpleExample ()  {

    const [pickedValue, setPickedValue] = useState(7);


     const MOCK_DATA = [
            {
              value: 1,
              label: 'Number 1',
            },
            {
              value: 2,
              label: 'Number 2',
            },
            {
              value: 3,
              label: 'Number 3',
            },
            {
              value: 4,
              label: 'Number 4',
            },
            {
              value: 5,
              label: 'Number 5',
            },
            {
              value: 6,
              label: 'Number 6',
            },
            {
              value: 7,
              label: 'Number 7',
            },
            {
              value: 8,
              label: 'Number 8',
            },
            {
              value: 9,
              label: 'Number 9',
            },
            {
              value: 10,
              label: 'Number 10',
            },
            {
              value: 11,
              label: 'Number 11',
            },
            {
              value: 12,
              label: 'Number 12',
            },
            {
              value: 13,
              label: 'Number 13',
            },
            {
              value: 14,
              label: 'Number 14',
            },
            {
              value: 15,
              label: 'Number 15',
            },
            {
              value: 16,
              label: 'Number 16',
            },
        
      ];
    
   

        return (
          <View style={styles.Container}>
            <Text style={styles.Title}>Basic Example</Text>
            <Text>Current Value Picked: {pickedValue}</Text>
      
            <View style={styles.PickerContainer}>
              <ScrollPicker
                currentValue={pickedValue}
                extraData={pickedValue}
                list={MOCK_DATA}
                onItemPress={setPickedValue}
                labelColor="blue"
                separatorColor="purple"
                selectedColor="white"
              />
            </View>
            <Text style={{fontSize: 22, textAlign: 'center'}}>
              We can customize the look by setting the labelColor, separatorColor and
              selectedColor props
            </Text>
          </View>
        );
    }
        
    const styles = StyleSheet.create({
        Container: {
          height: '100%',
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        },
        Title: {
          fontSize: 28,
          marginBottom: 10,
        },
        PickerContainer: {
          height: 70,
          width: '100%',
          //alignItems: 'center',
          marginTop: 50,
        },
      });
 
 
   
