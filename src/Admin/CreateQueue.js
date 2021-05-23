import { StyleSheet,View } from 'react-native';
import QueueForm from './QueueForm';

const CreateQueue = ({ navigation}) => {
    
    //const queueData
    const deneme = () => {
        //console.log(navigation)
        return true
    }

    return (
    <View>
        {deneme ? (
        <QueueForm 
       // onSubmit={(transactionType, employee,latency,interval,startTime,finishTime) => { addQueue(transactionType, employee, latency,interval,startTime,finishTime, [], () => navigation.navigate('AdminDashboard'))}}
       />
        ) : (<View></View>) }
    </View>
    )
};


const styles = StyleSheet.create({
});


export default CreateQueue;