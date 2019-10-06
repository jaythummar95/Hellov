import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Image, Picker, ToastAndroid, Alert, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import styles from './styles'
import HEStatusbar from '../../Components/HEStatusbar'
import HETextField from '../../Components/HETextField'
import HEActivityIndicator from '../../Components/HEActivityIndicator'
import { Colors } from '../../Constants/constants';
import { updateProfile } from '../../Constants/Modal'
import ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import DateTimePicker from "react-native-modal-datetime-picker";
import moment from 'moment'
import { storeDataIntoPreferance, clearPreferance } from '../../Constants/Preferance'
import { LoginManager, GraphRequest, GraphRequestManager, AccessToken } from 'react-native-fbsdk';
import { StackActions, NavigationActions } from 'react-navigation'
import HETitlteBackNavigationDrawer from '../../Components/HETitlteBackNavigationDrawer'
import { baseImageUrl } from '../../Constants/constants'
import { userdetail, apiDelete } from '../../Constants/Modal'



const options = {
    title: '',
    storageOptions: {
        skipBackup: true,
        path: 'images',
    },
};


export default class EditProfile extends Component {

    constructor(props) {
        super(props)

        this.state = {
            firstname: '',
            lastname: '',
            phoneNumber: '',
            email: '',
            gender: 'male',
            birth_date: '',
            phone: '',
            description: '',
            city: '',
            country: '',
            marital_status: '',
            profession: '',
            religion: '',
            size: '',
            weight: '',
            user_profile: null,
            showIndicator: false,
            isDateTimePickerVisible: false,
            isTakePicClicked: false,
        }
    }

    componentDidMount() {
        this.apiCallGetuserDetail();
    }

    apiCallGetuserDetail = () => {
        this.setState({ showIndicator: true })
        userdetail((err, result) => {
            this.setState({ showIndicator: false })
            if (!err && result) {
                result = result.success;
                this.setState({
                    firstname: result.first_name,
                    lastname: result.last_name,
                    email: result.email,
                    gender: result.gender,
                    birth_date: result.birth_date,
                    description: result.description != null ? result.description : '',
                    phone: result.phone != null ? result.phone : '',
                    user_profile: baseImageUrl(result.user_profile),
                    city: result.city != null && result.city != "null" ? result.city : "",
                    country: result.country != null && result.country != "null" ? result.country : "",
                    marital_status: result.marital_status != null && result.marital_status != "null" ? result.marital_status : "Single",
                    profession: result.profession != null && result.profession != "null" ? result.profession : "",
                    religion: result.religion != null && result.religion != "null" ? result.religion : "",
                    size: result.size != null && result.size != "null" ? result.size : "",
                    weight: result.weight != null && result.weight != "null" ? result.weight : "",
                })
            }
        
            else {
                // Alert.alert('', JSON.stringify(err))
            }
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
                    this.setState({ user_profile: resizeSource.uri, isTakePicClicked: true })

                }).catch((err) => {
                    // Oops, something went wrong. Check that the filename is correct and
                    // inspect err to get more details.
                });

                // You can also display the image using data:
                // const source = { uri: 'data:image/jpeg;base64,' + response.data };

            }
        });
    }

    apiCallUpdateProfile() {

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



        this.setState({ showIndicator: true })
        if (!this.state.isSocial) {
            updateProfile(
                this.state.firstname,
                this.state.lastname,
                this.state.gender,
                this.state.birth_date,
                this.state.phone,
                this.state.description,
                this.state.isTakePicClicked ? this.state.user_profile : null,
                this.state.city,
                this.state.country,
                this.state.marital_status,
                this.state.profession,
                this.state.religion,
                this.state.size,
                this.state.weight,
                (err, result) => {
                    this.setState({ showIndicator: false })
                    if (!err && result) {
                        result = result.success;

                        if (Platform.OS == 'android') {
                            ToastAndroid.show('Profile updated successfully', ToastAndroid.SHORT);
                        }
                        else {
                            Alert.alert('', 'Profile updated successfully')
                        }
                        const resetAction = StackActions.reset({
                            index: 0,
                            actions: [NavigationActions.navigate({ routeName: 'Dash' })],
                        });
                        this.props.navigation.dispatch(resetAction);
                    }
                    else {
                        Alert.alert('', err.message)
                        this.setState({ showIndicator: false })
                    }
                }
            )
        }
    }

    apiCallDeleteAcount() {
        Alert.alert(
            '',
            'Are you sure you want to delete your account ?',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {
                    text: 'OK', onPress: () => {
                        this.setState({ showIndicator: true })
                        apiDelete((err, result) => {
                            this.setState({ showIndicator: false })
                            if (!err && result) {
                                result = result.success;

                                clearPreferance(() => {
                                    LoginManager.logOut();
                                    const resetAction = StackActions.reset({
                                        index: 0,
                                        actions: [NavigationActions.navigate({ routeName: 'Launch' })],
                                    });
                                    this.props.navigation.dispatch(resetAction);
                                })
                            }
                            else {
                                // Alert.alert('', JSON.stringify(err))
                            }
                        })
                    }
                },
            ],
            { cancelable: false },
        );
    }

    render() {
        return (
            <View style={styles.container}>
                <HEStatusbar />
                <HETitlteBackNavigationDrawer
                    onmenuClick={() => { this.props.navigation.goBack() }} title={"My profile"} />
                <View style={{ flex: 1.0 }}>
                    <ScrollView>
                        <View style={{ flex: 1.0, width: '100%' }}>

                            <TouchableOpacity
                                onPress={() => {
                                    this.showImagePicker()
                                }}
                                style={{
                                    height: 100, width: 100,
                                    borderRadius: 15,
                                    alignItems: 'center',
                                    backgroundColor: 'white',
                                    borderWidth: 1,
                                    justifyContent: 'center',
                                    alignSelf: 'center',
                                    marginTop: 24
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
                                    keyboardType='default'
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
                                    keyboardType='default'
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
                                    myeditable={false}
                                />
                            </View>

                            <View style={styles.buttonSignInWithSocial}>
                                <HETextField
                                    leftImage=''
                                    rightImage=''
                                    keyboardType='number-pad'
                                    placeholder="Contact"
                                    onChangeText={(text) => {
                                        this.setState({
                                            phone: text
                                        })
                                    }}
                                    value={this.state.phone}
                                />
                            </View>

                            <View style={styles.buttonSignInWithSocial}>
                                <HETextField
                                    leftImage=''
                                    rightImage=''
                                    keyboardType='default'
                                    placeholder="City"
                                    onChangeText={(text) => {
                                        this.setState({
                                            city: text.replace(/[^a-z,A-Z]/g, '')
                                        })
                                    }}
                                    value={this.state.city}
                                />
                            </View>

                            <View style={styles.buttonSignInWithSocial}>
                                <HETextField
                                    leftImage=''
                                    rightImage=''
                                    keyboardType='default'
                                    placeholder="Country"
                                    onChangeText={(text) => {
                                        this.setState({
                                            country: text.replace(/[^a-z,A-Z]/g, '')
                                        })
                                    }}
                                    value={this.state.country}
                                />
                            </View>

                            <View style={styles.buttonSignInWithSocial}>
                                <Picker
                                    selectedValue={this.state.marital_status}
                                    style={{ height: 40, width: '100%', }}
                                    onValueChange={(itemValue, itemIndex) =>
                                        this.setState({ marital_status: itemValue })
                                    }>
                                    <Picker.Item label="Single" value="Single" />
                                    <Picker.Item label="Divorced" value="Divorced" />
                                    <Picker.Item label="Married" value="Married" />
                                </Picker>
                            </View>

                            <View style={styles.buttonSignInWithSocial}>
                                <HETextField
                                    leftImage=''
                                    rightImage=''
                                    keyboardType='default'
                                    placeholder="Profession"
                                    onChangeText={(text) => {
                                        this.setState({
                                            profession: text
                                        })
                                    }}
                                    value={this.state.profession}
                                />
                            </View>


                            <View style={styles.buttonSignInWithSocial}>
                                <HETextField
                                    leftImage=''
                                    rightImage=''
                                    keyboardType='default'
                                    placeholder="Religion"
                                    onChangeText={(text) => {
                                        this.setState({
                                            religion: text.replace(/[^a-z,A-Z]/g, '')
                                        })
                                    }}
                                    value={this.state.religion}
                                />
                            </View>

                            <View style={styles.buttonSignInWithSocial}>
                                <HETextField
                                    leftImage=''
                                    rightImage=''
                                    keyboardType='number-pad'
                                    placeholder="Height"
                                    onChangeText={(text) => {
                                        this.setState({
                                            size: text.replace(/[^0-9.]/g, '')
                                        })
                                    }}
                                    value={this.state.size}
                                />
                            </View>

                            <View style={styles.buttonSignInWithSocial}>
                                <HETextField
                                    leftImage=''
                                    rightImage=''
                                    keyboardType='number-pad'
                                    placeholder="Weight"
                                    onChangeText={(text) => {
                                        this.setState({
                                            weight: text.replace(/[^0-9.]/g, '')
                                        })
                                    }}
                                    value={this.state.weight}
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


                            <View style={[styles.buttonSignInWithSocial, { minHeight: 70 }]}>
                                <HETextField
                                    leftImage=''
                                    rightImage=''
                                    keyboardType='default'
                                    placeholder="About you"
                                    onChangeText={(text) => {
                                        this.setState({
                                            description: text
                                        })
                                    }}
                                    value={this.state.description}
                                    multiline={true}
                                />
                            </View>
                            <TouchableOpacity style={styles.buttonLogin}
                                onPress={() => {
                                    this.apiCallUpdateProfile()
                                }}>
                                <Text style={styles.textsocialSignInStyle}>Update profile</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.buttonLogin}
                                onPress={() => {
                                    this.apiCallDeleteAcount()
                                }}>
                                <Text style={styles.textsocialSignInStyle}>Delete Account</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>

                    <DateTimePicker
                        isVisible={this.state.isDateTimePickerVisible}
                        onConfirm={this.handleDatePicked}
                        onCancel={this.hideDateTimePicker}
                    />
                </View>
                <HEActivityIndicator showIndicator={this.state.showIndicator} />
            </View>
        )
    };


}