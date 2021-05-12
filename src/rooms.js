// @refresh reset
import React, {useState, useEffect, useCallback, Component} from 'react';
import { SafeAreaView, ScrollView,KeyboardAvoidingView, Keyboard,View, FlatList, StyleSheet, Text, StatusBar, TextInput, Platform, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Header, Avatar, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import {GiftedChat} from 'react-native-gifted-chat';
import { db } from './firebase';
import * as Facebook from 'expo-facebook';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'

const Tab = createMaterialTopTabNavigator();
const roomsRef = db.ref('rooms/')

const Rooms = ({navigation}) => {

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@storage_Key')
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch(e) {
      // error reading value
      console.log("Error reading data: " + e)
    }
  }

  const [user,setUser] = useState({});
  const [room,setRoom] = useState(null);
  const [chatroom,setChatrooms] = useState([]);

  async function LogOut() {
    await Facebook.logOutAsync({
      appId: '1491685357829190',
    });
    navigation.replace('Login');
  }

  const setDetails = async() => {
    const result = await getData()
    const usr = {_id:result.id,name:result.name}
    setUser(usr)
  }

  useEffect(() => {
    setDetails()
    const unsub = roomsRef.on('child_added', (data) =>{
      const new_room = data.key
      onAdd(new_room)
    })
  }, [])

  async function addNew(room) {
    const writes = db.ref('rooms/' + room).set(true);
    await Promise.all(writes);
    setRoom(null)
  }

  async function removeNew(roomRef) {
    const writes = db.ref('rooms/' + roomRef).set(null);
    await Promise.all(writes);
    const writes2 = db.ref('users/' + roomRef).set(null);
    await Promise.all(writes2);
    const new_arr = chatroom.filter((rm) => {
      return rm !== roomRef
    })
    setChatrooms(new_arr)
  }

  const onAdd = useCallback((rooms) => {
    setChatrooms((prevRooms) => [...prevRooms,rooms])
  }, [])

  return (
    <SafeAreaProvider style={styles.container}>
      <StatusBar barStyle='light-content'/>
      <Header
        centerComponent={{text: 'Welcome!', style:{color: '#fff', fontSize:20}}}
        rightComponent={{icon: 'cancel', color: '#fff', size:25, onPress: () => LogOut()}}
        containerStyle={{backgroundColor: '#54a0eb'}}
      />
      <ScrollView style={styles.container}>
      {
          chatroom.map((item,index) => {
            return (
              <TouchableOpacity key={index} style={styles.square} onPress={() => navigation.navigate('Chat',{room:item,user:user})}>
                <Text style={{fontSize: 18, marginLeft: 5}}>{item}</Text>
                <TouchableOpacity style={styles.remove} onPress={() => removeNew(item)}>
                  <Text style={{color:'white',fontSize: 20}}>-</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            )
          }
          )
      }
      </ScrollView>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.newRoomWrapper}
      >
        <TextInput style={styles.textBox} value={room} onChangeText={text => setRoom(text)} placeholder='Aa'/>
        <TouchableOpacity disabled={!room} activeOpacity={room ? 1 : 0.5} style={styles.addNew} onPress={() => addNew(room)}>
          <Text style={{fontSize:30,color:'white'}}>+</Text>
        </TouchableOpacity>
        <View style={{height:80}}/>
      </KeyboardAvoidingView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  square: {
    flexDirection: 'row',
    backgroundColor : 'white',
    padding: 5,
    borderRadius: 0,
    borderBottomWidth: 0.5,
    borderBottomColor: '#bfbfbf',
    marginHorizontal: 0,
    marginVertical: 0,
    height: 75,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  addNew: {
    backgroundColor : '#54a0eb',
    padding: 5,
    borderRadius: 60,
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  newRoomWrapper: {
    position: 'absolute',
    bottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%'
  },
  textBox: {
    width: '75%',
    borderWidth: 0.5,
    borderRadius: 60,
    borderColor: '#bfbfbf',
    padding: 15,
    backgroundColor: 'white'
  },
  remove: {
    backgroundColor : '#ffd6cc',
    borderRadius: 10,
    height: 35,
    width: 35,
    marginRight: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Rooms;
