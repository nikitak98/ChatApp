// @refresh reset
import React, {useState, useEffect, useCallback, Component} from 'react';
import { SafeAreaView, ScrollView,KeyboardAvoidingView, Keyboard,View, FlatList, StyleSheet, Text, StatusBar, TextInput, Platform, TouchableOpacity } from 'react-native';
import { Header, Avatar, Button } from 'react-native-elements';
import * as Facebook from 'expo-facebook'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({navigation}) => {

  const storeData = async (value) => {
      try {
        const jsonValue = JSON.stringify(value)
        await AsyncStorage.setItem('@storage_Key', jsonValue)
        console.log(value)
      } catch (e) {
        console.log("Error storing data: " + e)
      }
  }

  async function logIn() {
    try {
      await Facebook.initializeAsync({
        appId: '1491685357829190',
      });
      const {
        type,
        token,
        expirationDate,
        permissions,
        declinedPermissions,
      } = await Facebook.logInWithReadPermissionsAsync({
        permissions: ['public_profile'],
      });
      if (type === 'success') {
        // Get the user's name using Facebook's Graph API
        const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);

        // Pass username and ID to main screen
        var processed = await response.json();
        storeData(processed)
        navigation.replace('Rooms');

      } else {
        // type === 'cancel'
      }
    } catch ({ message }) {
      alert(`Facebook Login Error: ${message}`);
    }
  }

  return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center',}}>
        <StatusBar barStyle='dark-content'/>
        <TouchableOpacity style={styles.button} onPress={() => logIn()}>
          <Text style={{color: '#fff',fontSize:20}}>Login with Facebook</Text>
        </TouchableOpacity>
      </View>
    )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#4267B2',
    padding: 10,
    borderRadius: 10,
  },
})

export default LoginScreen;
