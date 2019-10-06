import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, NetInfo, ToastAndroid, Image, Alert, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import styles from './styles'
import HEStatusbar from '../../Components/HEStatusbar'
import HETextField from '../../Components/HETextField'
import HEActivityIndicator from '../../Components/HEActivityIndicator'
import { Colors } from '../../Constants/constants';
import { signup, signupSocial } from '../../Constants/Modal'
import ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import DateTimePicker from "react-native-modal-datetime-picker";
import moment from 'moment'
import { storeDataIntoPreferance } from '../../Constants/Preferance'
import { LoginManager, GraphRequest, GraphRequestManager, AccessToken } from 'react-native-fbsdk';
import { StackActions, NavigationActions } from 'react-navigation'



const options = {
    title: '',
    storageOptions: {
        skipBackup: true,
        path: 'images',
    },
};


export default class SignUp extends Component {

    constructor(props) {
        super(props)

        this.state = {
            firstname: '',
            lastname: '',
            phoneNumber: '',
            email: '',
            password: '',
            c_password: '',
            gender: 'male',
            birth_date: '',
            user_profile: null,
            showIndicator: false,
            isDateTimePickerVisible: false,
            media_type: '',
            media_id: '',
            isSocial: false
        }
    }

    componentDidMount() {
        let firstname = this.props.navigation.getParam('first_name')
        let lastname = this.props.navigation.getParam('last_name')
        let email = this.props.navigation.getParam('email')
        let mediaType = this.props.navigation.getParam('media_type')
        let mediaid = this.props.navigation.getParam('media_id')

        this.setState({
            firstname: firstname ? firstname : '',
            lastname: lastname ? lastname : '',
            email: email ? email : '',
            media_type: mediaType ? mediaType : '',
            media_id: mediaid ? mediaid : '',
            isSocial: mediaid ? true : false
        })
    }

    showDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: true });
    };

    hideDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: false });
    };

    handleDatePicked = date => {
        this.setState({ birth_date: moment(date).format('YYYY-MM-DD') })
        this.hideDateTimePicker();
    };

    showImagePicker = () => {
        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else {
                ImageResizer.createResizedImage(response.uri, 500, 500, 'JPEG', 100, response.originalRotation).then(({ uri }) => {
                    // response.uri is the URI of the new image that can now be displayed, uploaded...
                    // response.path is the path of the new image
                    // response.name is the name of the new image with the extension
                    // response.size is the size of the new image
                    const resizeSource = { uri: uri }
                    this.setState({ user_profile: resizeSource.uri })

                }).catch((err) => {
                    // Oops, something went wrong. Check that the filename is correct and
                    // inspect err to get more details.
                });

                // You can also display the image using data:
                // const source = { uri: 'data:image/jpeg;base64,' + response.data };

            }
        });
    }

    apiCallSignUp() {

        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;


        if (!this.state.user_profile) {
            Alert.alert('', 'Please upload your profile picture')
            return
        }
        if (!this.state.firstname) {
            Alert.alert('', 'Please enter first name')
            return
        }
        if (!this.state.lastname) {
            Alert.alert('', 'Please enter last name')
            return
        }
        if (!this.state.email) {
            Alert.alert('', 'Please enter email')
            return
        }
        if (reg.test(this.state.email) === false) {
            Alert.alert('', 'Please enter valid email')
            return
        }
        if (!this.state.birth_date) {
            Alert.alert('', 'Please enter date of birth')
            return
        }

        if (!this.state.isSocial) {
            if (this.state.password.length < 6) {
                Alert.alert('', 'Password must be min 6 characters')
                return
            }
            if (this.state.c_password.length < 6) {
                Alert.alert('', 'Password must be min 6 characters')
                return
            }
            if (!(this.state.password === this.state.c_password)) {
                Alert.alert('', "Password doesn't match")
                return
            }
        }

        NetInfo.isConnected.fetch().then(isConnected => {
            if (isConnected) {
                this.setState({ showIndicator: true })
                if (!this.state.isSocial) {
                    signup(
                        this.state.firstname,
                        this.state.lastname,
                        this.state.email,
                        this.state.password,
                        this.state.birth_date,
                        this.state.gender,
                        this.state.user_profile,
                        (err, result) => {
                            this.setState({ showIndicator: false })
                            if (!err && result) {
                                result = result.success;

                                Alert.alert(
                                    '',
                                    'Successfully Registered',
                                    [
                                        { text: 'OK', onPress: () => { this.props.navigation.goBack(null) } },
                                    ],
                                    { cancelable: false },
                                );
                            }
                            else {
                                Alert.alert('', 'Email id is already registered')
                                this.setState({ showIndicator: false })
                            }
                        }
                    )
                } else {
                    signupSocial(
                        this.state.firstname,
                        this.state.lastname,
                        this.state.email,
                        this.state.media_id,
                        this.state.media_type,
                        this.state.birth_date,
                        this.state.gender,
                        this.state.user_profile,
                        (err, result) => {
                            this.setState({ showIndicator: false })
                            if (!err && result) {
                                result = result.success;

                                Alert.alert(
                                    '',
                                    'User has been registered successfully',
                                    [
                                        {
                                            text: 'OK', onPress: () => {
                                                storeDataIntoPreferance('token', "Bearer " + result.token);
                                                const resetAction = StackActions.reset({
                                                    index: 0,
                                                    actions: [NavigationActions.navigate({ routeName: 'Dash' })],
                                                });
                                                this.props.navigation.dispatch(resetAction);
                                            }
                                        },
                                    ],
                                    { cancelable: false },
                                );
                            }
                            else {
                                Alert.alert('', 'Email id is already registered')
                                this.setState({ showIndicator: false })
                            }
                        }
                    )
                }
            } else {
                if (Platform.OS === "android") {
                    ToastAndroid.show('Check network connection', ToastAndroid.SHORT);
                } else {
                    Alert.alert('', 'Check network connection');
                }
            }
        })

    }



    restrict = (event) => {
        let reg = /^[^!-\\/:-@\\[-`{-~]+$/;

        let key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
        alert(event.target.value.toUpperCase())
        if (!reg.test(key)) {
            event.preventDefault();
            return false;

        }

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
            <View style={styles.bottomBottomConainer}>
                <ScrollView style={{ elevation: 2, width: '100%' }}>
                    <View style={{ width: '100%', height: '100%', alignItems: 'center', marginBottom: 10, marginTop: 24 }}>

                        <View style={styles.logoBg}>
                            <Image
                                resizeMode='center'
                                style={styles.logo}
                                source={{ uri: 'logo' }} />
                        </View>


                        <TouchableOpacity
                            onPress={() => {
                                this.showImagePicker()
                            }}
                            style={{
                                height: 100, width: 100, borderRadius: 15, alignItems: 'center', backgroundColor: 'white', borderWidth: 1,
                                justifyContent: 'center'
                            }}>
                            <Image
                                resizeMode='stretch'
                                source={{ uri: this.state.user_profile ? this.state.user_profile : 'user_placeholder' }}
                                style={{
                                    height: 85, width: 85, borderRadius: 15,
                                    borderColor: Colors.colorAccent
                                }} />
                        </TouchableOpacity>

                        <View style={styles.buttonSignInWithSocial}>
                            <HETextField
                                leftImage=''
                                rightImage=''
                                keyboardType={Platform.OS === 'android' ? 'email-address' : 'ascii-capable'}
                                placeholder="First name"
                                onChangeText={(text) => {
                                    this.setState({
                                        firstname: text.replace(/[^a-z,A-Z]/g, '')
                                    })
                                }}
                                value={this.state.firstname}
                            />
                        </View>

                        <View style={styles.buttonSignInWithSocial}>
                            <HETextField
                                leftImage=''
                                rightImage=''
                                keyboardType={Platform.OS === 'android' ? 'email-address' : 'ascii-capable'}
                                placeholder="Last name"
                                onChangeText={(text) => {
                                    this.setState({
                                        lastname: text.replace(/[^a-z,A-Z]/g, '')
                                    })
                                }}
                                value={this.state.lastname}
                            />
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

                        <View style={{ flexDirection: 'row', marginHorizontal: 16 }}>
                            <TouchableOpacity
                                onPress={() => {
                                    this.setState({ gender: 'male' })
                                }}
                                style={[styles.buttonSignInWithSocial, { flex: 0.5, marginEnd: 4, justifyContent: 'center' }]}>
                                <Text style={this.state.gender === "male" ? styles.txtGenderSlected : styles.txtGenderUnSlected}>Male</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    this.setState({ gender: 'female' })
                                }}
                                style={[styles.buttonSignInWithSocial, { flex: 0.5, marginStart: 4, justifyContent: 'center' }]}>
                                <Text style={this.state.gender === "female" ? styles.txtGenderSlected : styles.txtGenderUnSlected}>Female</Text>
                            </TouchableOpacity>

                        </View>

                        <TouchableOpacity style={styles.buttonSignInWithSocial}
                            onPress={() => {
                                this.showDateTimePicker()
                            }}>
                            <Text style={styles.txtBirthDate}>{this.state.birth_date ? this.state.birth_date : "Birth date"}</Text>
                        </TouchableOpacity>



                        {
                            !this.state.isSocial ?
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
                                    />
                                </View> : null
                        }


                        {
                            !this.state.isSocial ?
                                <View style={styles.buttonSignInWithSocial}>
                                    <HETextField
                                        leftImage=''
                                        rightImage=''
                                        keyboardType='default'
                                        placeholder='Confirm password'
                                        secure={true}
                                        onChangeText={(text) => {
                                            this.setState({
                                                c_password: text
                                            })
                                        }}
                                    />
                                </View> : null
                        }


                        <TouchableOpacity style={styles.buttonLogin}
                            onPress={() => {
                                this.apiCallSignUp()
                            }}>
                            <Text style={styles.textsocialSignInStyle}>REGISTER</Text>
                        </TouchableOpacity>


                    </View>
                </ScrollView>

                <DateTimePicker
                    isVisible={this.state.isDateTimePickerVisible}
                    onConfirm={this.handleDatePicked}
                    onCancel={this.hideDateTimePicker}
                />

            </View>)
    }

}