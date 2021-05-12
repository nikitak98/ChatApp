import React, {useState} from 'react';
import {View,StyleSheet, Text} from 'react-native';

const Message = ({title}) => {

  const isSelfMessage = () => {
    return title.id === title.id;
  }

  return (
    <View style={styles.message_wrapper}>
      <Text style={[isSelfMessage() ? styles.my_message : styles.other_message]}>{title.text}</Text>
    </View>
  )
};

const styles = StyleSheet.create({
  message_wrapper: {
    borderRadius: 15,
    padding: 5,
  },
  my_message: {
    backgroundColor: '#54a0eb',
    color: 'white',
    marginLeft: 40,
    padding: 10,
    borderRadius: 5,
    overflow: 'hidden',
    alignSelf: 'flex-end',
    fontSize: 20,
  },
  other_message: {
    backgroundColor: '#bfbfbf',
    color: 'white',
    marginRight: 40,
    padding: 10,
    borderRadius: 5,
    overflow: 'hidden',
    alignSelf: 'flex-start',
    fontSize: 20,
  },
})

export default Message;
