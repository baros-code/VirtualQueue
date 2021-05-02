import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { Context as QueueContext } from './QueueContext';
import QueueForm from './QueueForm';

const EditQueue = ( {navigation} ) => {
    const { state, editQueue } = useContext(QueueContext);

    const id = navigation.getParam('id');
    const queue = state.find(queue => queue.id === id);

    return (
        <QueueForm
        initialValues={{employee: queue.employee, transactionType: queue.transactionType, content: queue.content, latency: queue.latency,interval: queue.interval,
        startTime: queue.startTime,finishTime:queue.finishTime}}
        onSubmit={(transactionType,content,latency,interval,startTime,finishTime) => editQueue(id,transactionType,content, latency,interval,startTime,finishTime, () => {navigation.pop()} ) } //navigation.navigate('Index')
        />
        )

};


const styles = StyleSheet.create({});



export default EditQueue;





