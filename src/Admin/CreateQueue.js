import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { Context as QueueContext } from './QueueContext';
import QueueForm from './QueueForm';

const CreateQueue = ({ navigation }) => {
    const { addQueue } = useContext(QueueContext);

    return (
        <QueueForm 
        onSubmit={(transactionType, employee,latency,interval,startTime,finishTime) => { addQueue(transactionType, employee, latency,interval,startTime,finishTime, [], () => navigation.navigate('AdminDashboard'))}}
        
        />
    );
};


const styles = StyleSheet.create({
});


export default CreateQueue;