import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Image, NetInfo, ToastAndroid, TouchableOpacity, ImageBackground, Alert } from 'react-native';
import styles from './styles'
import HEStatusbar from '../../Components/HEStatusbar'
import HETextField from '../../Components/HETextField'
import HEActivityIndicator from '../../Components/HEActivityIndicator'
import { Colors } from '../../Constants/constants';
import { forgotpassword } from '../../Constants/Modal'
import { storeDataIntoPreferance } from '../../Constants/Preferance'
import { StackActions, NavigationActions } from 'react-navigation'
import { ScrollView } from 'react-native-gesture-handler';

export default class ForgotPassword extends Component {

    constructor(props) {
        super(props)

        this.state = {
            email: '',
            showIndicator: false
        }
    }


    apicallForgotPass = () => {

        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        if (!this.state.email) {
            Alert.alert('', 'Please enter email')
            return
        }

        if (reg.test(this.state.email) === false) {
            Alert.alert('', 'Please enter valid email')
            return
        }


        NetInfo.isConnected.fetch().then(isConnected => {
            if (isConnected) {
                this.setState({ showIndicator: true })
                forgotpassword(this.state.email, (err, result) => {
                    this.setState({ showIndicator: false })
                    if (!err && result) {
                        result = result.success;
                        Alert.alert('', result)
                        this.props.navigation.goBack(null)
                    }
                    else {
                        Alert.alert('', 'No such user registered with this email')
                        this.setState({ showIndicator: false })
                    }
                })
            } else {
                if (Platform.OS === "android") {
                    ToastAndroid.show('Check network connection', ToastAndroid.SHORT);
                } else {
                    Alert.alert('', 'Check network connection');
                }
            }
        })

    }



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
                <HEActivityIndicator showIndicator={this.state.showIndicator} />
            </View>
        )
    };


    renderBgView() {
        return (
            <View style={styles.bgContainer}>
                <View style={styles.bgTop} />
                <View style={styles.bgBottom} />
            </View>
        )
    }

    renderBottomView() {
        return (
            <View style={styles.bottomViewContainer}>
                <ScrollView>
                    <View style={{ marginTop: 100, ustifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
                        <View style={styles.logoBg}>
                            <Image
                                resizeMode='center'
                                style={styles.logo}
                                source={{ uri: 'logo' }} />
                        </View>

                        <Text style={{ padding: 8, color: 'white', fontFamily: 'GothamLight', textAlign: 'center' }}>
                            {"Forgot Password ? \nEnter your registered email to get your password"}
                        </Text>

                        <View style={styles.buttonSignInWithSocial}>
                            <HETextField
                                leftImage=''
                                rightImage=''
                                keyboardType='default'
                                placeholder="Email"
                                onChangeText={(text) => {
                                    this.setState({
                                        email: text
                                    })
                                }}
                            />
                        </View>

                        <TouchableOpacity style={styles.buttonLogin} onPress={() => {
                            this.apicallForgotPass()
                        }}>
                            <Text style={styles.textsocialSignInStyle}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>

            </View >
        )
    }

}