
import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { createStackNavigator, createAppContainer } from "react-navigation";
import Launch from './App/Screens/Launch'
import SignIn from './App/Screens/SignIn'
import SignUp from './App/Screens/SignUp'
import Dash from './App/Screens/Dash'
import ChatUserList from './App/Screens/ChatUserList'
import Chat from './App/Screens/Chat'
import CommonUserList from './App/Screens/CommonUserList'
import Plan from './App/Screens/Plan'
import Splash from './App/Screens/Splash'
import Profile from './App/Screens/Profile'
import EditProfile from './App/Screens/EditProfile'
import Blog from './App/Screens/Blog'
import BlogDetail from './App/Screens/BlogDetail'
import ForgotPassword from './App/Screens/ForgotPassword'
import Gallery from './App/Screens/Gallery'
import Filter from './App/Screens/Filter'
import FilterResult from './App/Screens/FilterResult'

console.disableYellowBox = true;

const AppNavigator = createStackNavigator({
  Splash: {
    screen: Splash,
    navigationOptions: {
      header: null
    }
  },
  Launch: {
    screen: Launch,
    navigationOptions: {
      header: null
    }
  },
  SignIn: {
    screen: SignIn,
    navigationOptions: {
      header: null
    }
  },
  SignUp: {
    screen: SignUp,
    navigationOptions: {
      header: null
    }
  },
  Dash: {
    screen: Dash,
    navigationOptions: {
      header: null
    }
  },
  ChatUserList: {
    screen: ChatUserList,
    navigationOptions: {
      header: null
    }
  },
  Chat: {
    screen: Chat,
    navigationOptions: {
      header: null
    }
  },
  CommonUserList: {
    screen: CommonUserList,
    navigationOptions: {
      header: null
    }
  },
  Plan: {
    screen: Plan,
    navigationOptions: {
      header: null
    }
  },
  Profile: {
    screen: Profile,
    navigationOptions: {
      header: null
    }
  },
  EditProfile: {
    screen: EditProfile,
    navigationOptions: {
      header: null
    }
  },
  Blog: {
    screen: Blog,
    navigationOptions: {
      header: null
    }
  },
  BlogDetail: {
    screen: BlogDetail,
    navigationOptions: {
      header: null
    }
  },
  ForgotPassword: {
    screen: ForgotPassword,
    navigationOptions: {
      header: null
    }
  },
  Gallery: {
    screen: Gallery,
    navigationOptions: {
      header: null
    }
  },
  Filter: {
    screen: Filter,
    navigationOptions: {
      header: null
    }
  },
  FilterResult: {
    screen: FilterResult,
    navigationOptions: {
      header: null
    }
  },
});

export default createAppContainer(AppNavigator);
