// @refresh reset
import React, {useState, useEffect, useCallback, Component} from 'react';
import { SafeAreaView, ScrollView,KeyboardAvoidingView, Keyboard,View, StyleSheet, Text, StatusBar, TextInput, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Header, Avatar, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import {GiftedChat} from 'react-native-gifted-chat';
import {db} from './firebase';
import * as Facebook from 'expo-facebook'
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

const Chat = ({route,navigation}) => {

  const chatRef = db.ref('users/' + route.params.room)
  const user = {_id:route.params.user._id,name:route.params.user.name}
  const [name,setName] = useState('');
  const [messages,setMessages] = useState([]);

  async function LogOut() {
    await Facebook.logOutAsync({
      appId: '1491685357829190',
    });
    navigation.navigate('Login');
  }

  useEffect(() => {
    const unsub = chatRef.on('child_added', (data) =>{
      const new_msg = {
        _id: data.val()._id,
        text: data.val().text,
        createdAt: data.val().new_date,
        user: data.val().user
      }
      onSend([...messages,new_msg])
    })
  }, [])

  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
  }, [])

  async function handleSend(msg) {
    const temp = msg[0]
    const new_date = Date.now()
    const writes = msg.map((m) => chatRef.push().set({...m,new_date}))
    await Promise.all(writes)
  }

  return (
    <SafeAreaProvider style={styles.container}>
      <StatusBar barStyle='light-content'/>
      <Header
        leftComponent={{icon: 'chevron-left', color: '#fff', onPress: () => navigation.navigate('Rooms')}}
        centerComponent={{text: route.params.room, style:{color: '#fff', fontSize:20}}}
        containerStyle={{backgroundColor: '#54a0eb'}}
      />
      <GiftedChat messages={messages} user={user} onSend={message => handleSend(message)}/>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  login: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor : 'white',
  },
  main_chat: {
    marginBottom: 50,
    flexDirection: 'column'
  }
});

export default Chat;
