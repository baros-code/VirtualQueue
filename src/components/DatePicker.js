import React, { useState } from 'react';
import { View, Text, StyleSheet} from 'react-native';
import { Feather } from '@expo/vector-icons'; 
import DateTimePicker from '@react-native-community/datetimepicker';
import { TouchableOpacity } from 'react-native-gesture-handler';

const getCurrentDate = () => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = mm + '/' + dd + '/' + yyyy;
    return today;
}

const DatePicker = ( {mode, onSubmit} ) => {
    const [date, setDate] = useState(new Date(getCurrentDate()));
    const [show, setShow] = useState(false);

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;           //if selectedDate == null which means selection cancelled, get date from state
        setShow(Platform.OS === 'ios');
        setDate(currentDate);

        onSubmit(currentDate);  
    };

    const showDatepicker = () => {
        setShow(true);
    };

    const showValue = mode === 'date' ? date.toDateString() : date.toTimeString();  
    const iconName = mode === 'date' ? 'calendar' : 'clock' ;

    //console.log("date is: " + date);

    return (
        <View style={styles.backgroundStyle}>
            <TouchableOpacity onPress={showDatepicker}>
                <Feather style={styles.iconStyle} name={iconName} />
            </TouchableOpacity>
            
            {show && (
            <View> 
                <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode={mode}
                display="default"
                is24Hour={true}
                onChange={onChange}
                minimumDate={new Date(getCurrentDate())}
                maximumDate={new Date(2022, 10, 20)}
                />       
            </View>
            ) }
            <Text style={styles.input}>{showValue}</Text>
        </View>
    );
};



const styles = StyleSheet.create({
    backgroundStyle: {
        marginTop: 10,
        backgroundColor: '#0e66d4',
        height: 50,
        borderRadius: 5,
        marginHorizontal: 15,
        flexDirection: 'column',
        alignItems: 'center'
    },
    inputStyle: {
        fontSize: 18,
        borderWidth: 1,
        borderColor: 'white',
        marginBottom: 15,
        padding: 5,
        margin: 5  
    },
    iconStyle: {
        fontSize: 35,
        margin: 15,
        color: 'white'
    },
    button: {
        alignSelf: 'flex-start',
        marginRight: 10
    }
});




export default DatePicker;
