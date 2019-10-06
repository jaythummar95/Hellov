import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Image, TouchableOpacity, Alert, ImageBackground } from 'react-native';
import styles from './styles'
import HEStatusbar from '../../Components/HEStatusbar'
import { Colors } from '../../Constants/constants';
import LinearGradient from 'react-native-linear-gradient';
import { getDataFromPreferance, storeDataIntoPreferance } from '../../Constants/Preferance'
import { NavigationActions, StackActions } from 'react-navigation';
import { LoginManager, GraphRequest, GraphRequestManager, AccessToken } from 'react-native-fbsdk';
import { GoogleSignin, statusCodes } from 'react-native-google-signin';
import { socialCheck } from '../../Constants/Modal'
import HEActivityIndicator from '../../Components/HEActivityIndicator'
import { NetInfo, ToastAndroid } from 'react-native';

export default class Launch extends Component {

    constructor(props) {
        super(props)

        this.state = {
            showIndicator: false
        }

        GoogleSignin.configure();


    }

    componentDidMount = () => {


    }

    siginInWithFacebook = async () => {
        _this = this;
        NetInfo.isConnected.fetch().then(isConnected => {
            if (isConnected) {
                LoginManager.logOut();
                LoginManager.logInWithReadPermissions(['public_profile', 'email']).then(
                    function (result) {
                        if (result.isCancelled) {
                            alert(Localize.LoginCancelled);
                        } else {
                            AccessToken.getCurrentAccessToken().then(
                                (data) => {
                                    let accessToken = data.accessToken

                                    const responseInfoCallback = (error, result) => {
                                        if (error) {
                                            console.log(error)
                                            alert(error.message);
                                        } else {
                                            console.log(result)
                                            _this.checkSocilaId(
                                                result.first_name,
                                                result.last_name,
                                                result.email,
                                                result.id,
                                                'facebook'
                                            )
                                        }
                                    }

                                    const infoRequest = new GraphRequest(
                                        '/me',
                                        {
                                            accessToken: accessToken,
                                            parameters: {
                                                fields: {
                                                    string: 'email,name,first_name,middle_name,last_name'
                                                }
                                            }
                                        },
                                        responseInfoCallback.bind(this),
                                    );

                                    new GraphRequestManager().addRequest(infoRequest).start();
                                })

                        }
                    },
                    function (error) {
                        alert(error.message);
                    }
                );
            } else {
                if (Platform.OS === "android") {
                    ToastAndroid.show('Check network connection', ToastAndroid.SHORT);
                } else {
                    Alert.alert('', 'Check network connection');
                }
            }
        })


    }

    signInWithGoogle = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            console.log('Google Details:-', userInfo)

            let user = Object()
            user.first_name = userInfo.user.givenName
            user.last_name = userInfo.user.familyName
            user.email = userInfo.user.email
            user.id = userInfo.user.id
            // this.checkSocialSignin(user, 'google')

            this.checkSocilaId(
                user.first_name,
                user.last_name,
                user.email,
                user.id,
                'google'
            )

        } catch (error) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // user cancelled the login flow
            } else if (error.code === statusCodes.IN_PROGRESS) {
                // operation (f.e. sign in) is in progress already
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                // play services not available or outdated
            } else {
                alert(error.message)
            }
        }
    };


    checkSocilaId(
        first_name,
        last_name,
        email,
        media_id,
        media_type
    ) {


        this.setState({ showIndicator: true })
        socialCheck(media_id, media_type, email, (err, result) => {
            this.setState({ showIndicator: false })
            if (!err && result) {
                result = result.success;
                if (result.block == "0") {
                    console.log(JSON.stringify(result))
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
                this.setState({ showIndicator: false })

                this.props.navigation.navigate('SignUp', {
                    first_name: first_name,
                    last_name: last_name,
                    email: email,
                    media_id: media_id,
                    media_type: media_type
                })
            }
        })

    }

    signOut = async () => {
        try {
            await GoogleSignin.revokeAccess();
            await GoogleSignin.signOut();
            this.signInWithGoogle()
        } catch (error) {
            console.error(error);
        }
    };

    isSignedIn = async () => {
        const isSignedIn = await GoogleSignin.isSignedIn();
        if (isSignedIn) {
            this.signOut();
        } else {
            this.signInWithGoogle();
        }
    };


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


    componentDidMount = () => {
        getDataFromPreferance('token', (value) => {
            if (value) {
                const resetAction = StackActions.reset({
                    index: 0,
                    actions: [NavigationActions.navigate({ routeName: 'Dash' })],
                });
                this.props.navigation.dispatch(resetAction);
            }
        })
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

                {this.renderSocialSignInButton('facebook', 'CONTINUE WITH FACEBOOK')}
                {this.renderSocialSignInButton('gmail', 'CONTINUE WITH GOOGLE')}
                {this.renderSocialSignInButton('email', 'CONTINUE WITH EMAIL')}
            </View>
        )
    }

    renderSocialSignInButton(type, text) {
        return (
            <TouchableOpacity style={[styles.buttonSignInWithSocial, {
                backgroundColor: type === 'facebook' ? '#4267B2' :
                    type === "gmail" ? "#DB4F42" : Colors.loginButton
            }]}
                onPress={() => {
                    switch (type) {
                        case 'facebook':
                            this.siginInWithFacebook()
                            break
                        case 'gmail':
                            this.isSignedIn()
                            break
                        case 'email':
                            this.props.navigation.navigate('SignIn')
                            break
                    }
                }}>
                <Text
                    style={styles.textsocialSignInStyle}>{text}</Text>
            </TouchableOpacity>
        )
    }
}