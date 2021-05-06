import React, { useState } from 'react';
import { View, Text,TextInput, StyleSheet, Button} from 'react-native';
import DatePicker from './DatePicker';

/*
DATE BUGÜN SEÇİLİ İSE ŞU ANKİ TIMEDAN ÖNCEKİ
TIME'LAR SEÇİLEMEMELİ.
*/


const ReservationForm = ( { initialValues, onSubmit} ) => {

    const [organizationName, setOrganizationName] = useState(initialValues.organizationName);
    const [transactionType, setTransactionType] = useState(initialValues.transactionType);
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(new Date());

    const dateFormatter = (dateString) => {
        dateString = new Date(dateString).toUTCString();
        dateString = dateString.split(' ').slice(0, 5).join(' ');
        return dateString;
    }

    const dateString = dateFormatter(date.toDateString() + " " + time.toTimeString());

    return (
    <View>
        <Text style={styles.label}>Enter organizationName:</Text>
        <TextInput style={styles.input} value={organizationName} onChangeText={(text) => setOrganizationName(text)} />
        <Text style={styles.label}>Enter transactionType:</Text>
        <TextInput style={styles.input} value={transactionType} onChangeText={(transactionType) => setTransactionType(transactionType)} />
        <View style={styles.datePicker}>
            <DatePicker 
            mode='date'
            onSubmit={(selectedDate) => setDate(selectedDate)}
            />
            <DatePicker 
            mode='time'
            onSubmit={(selectedDate) => setTime(selectedDate)}
            />
        </View>
        <View style={styles.button}>
            <Button  title="Save Reservation" onPress={() => onSubmit(transactionType, dateString, organizationName) } />
        </View>
    </View>
    );
}   


/*PROPS KOYMAZSAN DEFAULT OLARAK ASAGIDAKILER GIDIYOR.*/

ReservationForm.defaultProps = {
    initialValues: {
        organizationName: 'AKBANK',
        transactionType: ''
    }
};


const styles = StyleSheet.create({
    input: {    
        fontSize: 18,
        borderWidth: 1,
        borderColor: 'black',
        marginBottom: 15,
        padding: 5,
        margin: 5
    },
    label: {
        fontSize: 20,
        marginBottom: 5,
        marginLeft: 5
    },
    button: {
        alignSelf: 'flex-end',
        marginRight: 10,
        paddingTop: 70
    },
    datePicker: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    }
});


export default ReservationForm;