import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Image, TouchableOpacity, ImageBackground } from 'react-native';
import styles from './styles'
import HEStatusbar from '../../Components/HEStatusbar'
import { Colors } from '../../Constants/constants';
import LinearGradient from 'react-native-linear-gradient';
import { getDataFromPreferance } from '../../Constants/Preferance'
import { NavigationActions, StackActions } from 'react-navigation';
import { LoginManager, GraphRequest, GraphRequestManager, AccessToken } from 'react-native-fbsdk';
import { GoogleSignin, statusCodes } from 'react-native-google-signin';



export default class Splash extends Component {

    render() {
        return (
            <View style={styles.container}>

                <HEStatusbar />
                <ImageBackground
                    resizeMode='cover'
                    source={{ uri: 'bg' }} style={{ width: '100%', height: '100%' }}>
                    <View style={{ backgroundColor: 'rgba(0,0,0,0.6)', height: '100%', width: '100%' }}>
                        {this.renderBottomView()}
                    </View>
                </ImageBackground>

            </View>
        )
    };


    componentDidMount = () => {
        setTimeout(() => {
            getDataFromPreferance('token', (value) => {
                if (value) {
                    const resetAction = StackActions.reset({
                        index: 0,
                        actions: [NavigationActions.navigate({ routeName: 'Dash' })],
                    });
                    this.props.navigation.dispatch(resetAction);
                } else {
                    const resetAction = StackActions.reset({
                        index: 0,
                        actions: [NavigationActions.navigate({ routeName: 'Launch' })],
                    });
                    this.props.navigation.dispatch(resetAction);
                }
            })
        }, 2500);

    }

    renderBottomView() {
        return (
            <View style={styles.bottomViewContainer}>
                <View style={styles.logoBg}>
                    <Image
                        resizeMode='center'
                        style={styles.logo}
                        source={{ uri: 'logo' }} />
                </View>
            </View>
        )
    }
}   