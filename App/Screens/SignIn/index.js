import React, { Component } from 'react';
import { Platform, StyleSheet, Text, NetInfo, ToastAndroid, View, Image, TouchableOpacity, ImageBackground, Alert } from 'react-native';
import styles from './styles'
import HEStatusbar from '../../Components/HEStatusbar'
import HETextField from '../../Components/HETextField'
import HEActivityIndicator from '../../Components/HEActivityIndicator'
import { Colors } from '../../Constants/constants';
import { signin, forgotpassword } from '../../Constants/Modal'
import { storeDataIntoPreferance } from '../../Constants/Preferance'
import { StackActions, NavigationActions } from 'react-navigation'

export default class SignIn extends Component {

    constructor(props) {
        super(props)

        this.state = {
            email: '',
            password: '',
            showIndicator: false
        }
    }


    apiCallSigIn = () => {

        if (!this.state.email) {
            Alert.alert('', 'Please enter email')
            return
        }
        if (!this.state.password) {
            Alert.alert('', 'Please enter password')
            return
        }

        NetInfo.isConnected.fetch().then(isConnected => {
            if (isConnected) {
                this.setState({ showIndicator: true })
                signin(this.state.email, this.state.password, (err, result) => {
                    this.setState({ showIndicator: false })
                    if (!err && result) {
                        result = result.success;
                        console.log(JSON.stringify(result))
                        if (result.block == "0") {
                            storeDataIntoPreferance('token', "Bearer " + result.token);
                            const resetAction = StackActions.reset({
                                index: 0,
                                actions: [NavigationActions.navigate({ routeName: 'Dash' })],
                            });
                            this.props.navigation.dispatch(resetAction);
                        } else {
                            Alert.alert("", result.Message);
                        }

                    }
                    else {
                        Alert.alert('', err.message)
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

    apicallForgotPass = () => {

        if (!this.state.email) {
            Alert.alert('', 'Please enter email')
            return
        }


        this.setState({ showIndicator: true })
        forgotpassword(this.state.email, (err, result) => {
            this.setState({ showIndicator: false })
            if (!err && result) {
                result = result.success;
                Alert.alert('', result)
            }
            else {
                Alert.alert('', err.message)
                this.setState({ showIndicator: false })
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
                <View style={styles.logoBg}>
                    <Image
                        resizeMode='center'
                        style={styles.logo}
                        source={{ uri: 'logo' }} />
                </View>


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
                        value={this.state.email}
                    />
                </View>

                <View style={styles.buttonSignInWithSocial}>
                    <HETextField
                        leftImage=''
                        rightImage=''
                        keyboardType='default'
                        placeholder='Password'
                        secure={true}
                        onChangeText={(text) => {
                            this.setState({
                                password: text
                            })
                        }}
                        value={this.state.password}
                    />
                </View>

                <TouchableOpacity style={styles.buttonLogin} onPress={() => {
                    this.apiCallSigIn()
                }}>
                    <Text style={styles.textsocialSignInStyle}>SIGN IN</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.forgotPasswordBUtton}
                    onPress={() => {
                        this.props.navigation.navigate('ForgotPassword')
                    }}>
                    <Text style={styles.textForgotPassword}>Forgot password ?</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[
                    styles.buttonLogin, { backgroundColor: Colors.colorAccent }
                ]}
                    onPress={() => {
                        this.setState({ email: '', password: '' })
                        this.props.navigation.navigate('SignUp')
                    }}>
                    <Text style={styles.textsocialSignInStyle}>REGISTER</Text>
                </TouchableOpacity>
            </View >
        )
    }

}