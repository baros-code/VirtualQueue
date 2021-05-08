import React, {useState,useRef, useEffect} from 'react';
import ScrollPicker from './ScrollPicker';
import RBSheet from './RBSheet';
import {View, Text, StyleSheet,TouchableOpacity} from 'react-native';
import symbolicateStackTrace from 'react-native/Libraries/Core/Devtools/symbolicateStackTrace';



function ScrollPickerComponent({editable,selectedValue,style,callback,data}) {

  
  const findLabel= (value) => {
        let label=undefined
        let isFound=false
           MOCK_DATA.forEach( (current) => {
            if (current.value === value) {
                isFound=true
                label=current.label
            }
        })
        if (isFound) {
          return label
        }
        else {
          return selectedValue
        }
  }


  const MOCK_DATA = data// data must contain value and label pair.

  const [pickedValue, setPickedValue] = useState(selectedValue);
  const refRBSheet = useRef();



  return (
    <View >
      <TouchableOpacity
        onPress={() => refRBSheet.current.open()}>
        <Text style={style}>{findLabel(selectedValue)}</Text>
    </TouchableOpacity>
      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={true}
        height={300}
        customStyles={{
          draggableIcon: {
            backgroundColor: '#000',
          },
          container: {
            borderRadius: 12,
          },
        }}>
        {/* Start of Scroll Picker */}
        {/*
        */}
        <View style={styles.SheetView}>
          <ScrollPicker
            // We need to tell the picker the current picked value
            currentValue={pickedValue}
            // The picker is a pure component so we need to tell it
            // what data it needs to subscribe to, otherwise it won't
            // re-render
            extraData={pickedValue}
            // The array of objects which makes up the list
            list={MOCK_DATA}
            // Callback function to update the picked value
            labelColor="#0e66d4"
            selectedColor="#41c3ea"
            onItemPress={editable ? (value) => { setPickedValue(value); selectedValue=value; refRBSheet.current.close(); callback(value) } : (value) => alert("Select operation not allowed") }
          />
        </View>
        {/* End of Scroll Picker */}
      </RBSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  Container: {
    height: '100%',
    width: '100%',
    paddingTop: 30,
    alignItems: 'center',
  },
  Title: {
    fontSize: 30,
    marginBottom: 60,
  },
  Subtitle: {
    fontSize: 22,
    color: 'red',
    marginBottom: 32,
  },
  Description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 100,
  },
  SheetView: {
    width: '100%',
    height: '100%',
    paddingBottom: 32,
    alignItems: 'center',
  },
});

export default ScrollPickerComponent;



