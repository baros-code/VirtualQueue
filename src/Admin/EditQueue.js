
import { StyleSheet } from 'react-native';
import QueueForm from './QueueForm';

const EditQueue = ( {navigation} ) => {
    
    const id = navigation.getParam('id');
    const queueId=navigation.getParam("queueId")
    const queue=findQueue(id)

    const findQueue = (id) => {
            const queueRef=firebase.database().ref("queue/" + queueId)
           return  queueRef.get().val()
    }    

    return (
        <QueueForm
        initialValues={{employee: queue.employee, transactionType: queue.transactionType, content: queue.content, latency: queue.latency,interval: queue.interval,
        startTime: queue.startTime,finishTime:queue.finishTime}}
        />
        )

};


const styles = StyleSheet.create({});



export default EditQueue;





