import React, { Component } from 'react';
import { Platform, StyleSheet, Button, Text, View, Image, PermissionsAndroid, TouchableOpacity, ToastAndroid, Alert, ImageBackground } from 'react-native';
import HEStatusbar from '../../Components/HEStatusbar'
import HEDashNavigationDrawer from '../../Components/HEDashNavigationDrawer'
import { Colors } from '../../Constants/constants';
import LinearGradient from 'react-native-linear-gradient';
import Swiper from 'react-native-deck-swiper'
import DrawerLayout from 'react-native-drawer-layout';
import styles from './styles';
import { ScrollView } from 'react-native-gesture-handler';
import { NavigationActions, StackActions } from 'react-navigation';
import { getDataFromPreferance, clearPreferance, storeDataIntoPreferance } from '../../Constants/Preferance'
import { userdetail, userList, userListFilter, likeDislikeFavourite, updateDeviceToken, logout, updateLocation } from '../../Constants/Modal'
import HEActivityIndicator from '../../Components/HEActivityIndicator'
import { baseImageUrl } from '../../Constants/constants'
import firebase, { Notification } from 'react-native-firebase';
import EventBus from 'react-native-event-bus'
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import { LoginManager, GraphRequest, GraphRequestManager, AccessToken } from 'react-native-fbsdk';

// demo purposes only
function* range(start, end) {
    for (let i = start; i <= end; i++) {
        yield i
    }
}

export default class Dash extends Component {


    constructor(props) {
        super(props)
        this.state = {
            swipedAllCards: false,
            swipeDirection: '',
            cardIndex: 0,
            name: '',
            email: '',
            user_profile: '',
            showIndicator: false,
            userList: [],
            updatedCardIndex: 0,
            disableAllSwipe: false
        }
    }

    componentWillMount() {
        this.fcmProsses()
        this.registerFcmListener()
        this.setNotification();
        this.requestLocationPermission();
        EventBus.getInstance().removeListener(this.listener);
    }

    requestLocationPermission = async () => {
        try {

            PermissionsAndroid.requestMultiple(
                [PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION]
            ).then((result) => {
                if (result['android.permission.ACCESS_COARSE_LOCATION']
                    && result['android.permission.ACCESS_FINE_LOCATION'] === 'granted') {

                    this.turnonLocationAndUpdateLatlng()

                }
            });
        } catch (err) {

        }
    }

    componentDidMount() {
        this.apiCallGetuserDetail(false)
        this.apiCallGetuserList()

        EventBus.getInstance().addListener("UPDATELIST", this.listener = data => {
            // handle the event
            this.apiCallGetuserList()
        })
    }

    turnonLocationAndUpdateLatlng() {
        RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({ interval: 10000, fastInterval: 5000 })
            .then(data => {

                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        let latitude = position.coords.latitude
                        let longitude = position.coords.longitude

                        updateLocation(
                            latitude,
                            longitude,
                            (err, result) => {
                                if (!err && result) {
                                    result = result.success;
                                }
                                else {

                                }
                            }
                        )

                    },
                    (error) => { alert(JSON.stringify(error)) },
                    { enableHighAccuracy: false, timeout: 120000, maximumAge: 1000 },
                );
                // The user has accepted to enable the location services
                // data can be :
                //  - "already-enabled" if the location services has been already enabled
                //  - "enabled" if user has clicked on OK button in the popup
            }).catch(err => {
                this.turnonLocationAndUpdateLatlng();
                // The user has not accepted to enable the location services or something went wrong during the process
                // "err" : { "code" : "ERR00|ERR01|ERR02", "message" : "message"}
                // codes : 
                //  - ERR00 : The user has clicked on Cancel button in the popup
                //  - ERR01 : If the Settings change are unavailable
                //  - ERR02 : If the popup has failed to open
            })
    }

    componentWillUnmount() {
        try {
            this.messageListener();
            this.notificationDisplayedListener();
            this.notificationListener();
            EventBus.getInstance().removeListener(this.listener);
        } catch (e) { }

    }


    async fcmProsses() {
        //Initialize FCM
        console.log('==============fcmProsses================')
        if (!firebase.apps.length) {
            // Initialize Firebase
            var config = {
                apiKey: "AIzaSyCyigJhhRvw6yxH9RUPnOTTEck5lfAaSXU",
                authDomain: "hellov.firebaseapp.com",
                databaseURL: "https://hellov.firebaseio.com",
                projectId: "hellov",
                storageBucket: "hellov.appspot.com",
                messagingSenderId: "994787317423",
                appId: "1:994787317423:web:090405b56c2c3d46",
                content_available: true
            };
            firebase.initializeApp(config);
        }


        firebase.messaging().hasPermission()
            .then(enabled => {
                if (enabled) {
                    // user has permissions
                    this.updateDeviceToken();
                } else {
                    firebase.messaging().requestPermission()
                        .then(() => {
                            // User has authorised  
                            this.updateDeviceToken();
                        })
                        .catch(error => {
                            // User has rejected permissions  
                        });
                }
            });
    }


    registerFcmListener() {
        this.messageListener = firebase.messaging().onMessage((message) => {
            // handle your message
            console.log('Message', message)
            try {
                timeStamp = new Date().getUTCMilliseconds();

                if (Platform.OS == 'ios') {
                    PushNotification.localNotification({
                        id: timeStamp + "",
                        title: message.data.title,
                        message: message.data.message,
                        content_available: true
                    });
                }
                // else {
                //     PushNotification.localNotification({
                //         id: timeStamp + "",
                //         title: message.data.title,
                //         message: message.data.message,
                //         smallIcon: 'app_icon',
                //         largeIcon: 'app_icon',
                //         color: Global.COLOR.color_primary,
                //     });
                // }


            } catch (error) {
                console.log(error);
            }
        });
    }

    setNotification = async () => {

        this.onNotificationOpen = firebase.notifications().onNotificationOpened((notification) => {
            const resetAction = StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: 'Dash' })],
            });
            this.props.navigation.dispatch(resetAction);
        });

        this.notificationDisplayedListener = firebase.notifications().onNotificationDisplayed((notification) => {
            console.log(notification)

        });

        this.notificationListener = firebase.notifications().onNotification((notification) => {
            // Process your notification as required
            console.log(notification)
            if (notification.data.type === 'chat' && global.inChat === true) {
                EventBus.getInstance().fireEvent("MESSAGE", {
                    DATA: notification
                })
                return
            }

            _localNotification = null;
            if (Platform.OS === 'ios') {
                this._localNotification = new firebase.notifications.Notification()
                    .setNotificationId(notification.notificationId)
                    .setTitle(JSON.parse(notification.data.message).title)
                    .setSubtitle("")
                    .setBody(JSON.parse(notification.data.message).body)
                    .setData(notification.data)
                    .ios.setBadge(notification.ios.badge);
            } 
            else {  
                console.log("Here")

                const channel = new firebase.notifications.Android.Channel('Hellov', 'Test Channel', firebase.notifications.Android.Importance.Max)
                    .setDescription('My apps test channel');

                firebase.notifications().android.createChannel(channel);

                if (notification.data.username) {
                    this._localNotification = new firebase.notifications.Notification({
                        sound: 'default',
                        show_in_foreground: true
                    })

                        .setNotificationId(notification.notificationId)
                        .setTitle(notification.data.username)
                        .setSubtitle("")
                        .setBody(JSON.parse(notification.data.message).title)
                        .android.setBigText(JSON.parse(notification.data.message).title)
                        .setData(notification.data)
                        .android.setAutoCancel(true)
                        .android.setChannelId(channel.channelId) // e.g. the id you chose above
                        // create this icon in Android Studio
                        .android.setSmallIcon('ic_stat_faviconlogo')
                        .android.setColor(Colors.colorPrimary) // you can set a color here
                        .android.setPriority(firebase.notifications.Android.Priority.High);
                } else {
                    console.log("fjfj")
                    this._localNotification = new firebase.notifications.Notification({
                        sound: 'default',
                        show_in_foreground: true
                    })

                        .setNotificationId(notification.notificationId)
                        .setTitle(JSON.parse(notification.data.message).title)
                        .setSubtitle("")
                        .setBody(JSON.parse(notification.data.message).body)
                        .android.setBigText(JSON.parse(notification.data.message).body)
                        .setData(notification.data)
                        .android.setAutoCancel(true)
                        .android.setChannelId(channel.channelId) // e.g. the id you chose above
                        // create this icon in Android Studio
                        .android.setSmallIcon('ic_stat_faviconlogo')
                        .android.setColor(Colors.colorPrimary) // you can set a color here
                        .android.setPriority(firebase.notifications.Android.Priority.High);
                }


            }

            firebase.notifications().displayNotification(this._localNotification).catch(err => console.error(err));

            if (notification.data.type === 'Account Blocked') {
                clearPreferance(() => {
                    const resetAction = StackActions.reset({
                        index: 0,
                        actions: [NavigationActions.navigate({ routeName: 'Launch' })],
                    });
                    this.props.navigation.dispatch(resetAction);
                })
                return
            }

        });
    }


    async updateDeviceToken() {

        const fcm_token = await firebase.messaging().getToken();
        console.log('fcm_token:', fcm_token, " Platform.OS: ", Platform.OS)
        //Store FCM token to preferance
        storeDataIntoPreferance('fcm_token', fcm_token + "")

        if (fcm_token != null) {
            getDataFromPreferance('token', (value) => {

                updateDeviceToken(
                    fcm_token + "",
                    value,
                    (err, result) => {
                        if (!err && result) {
                        }
                        else {
                            // Alert.alert('', err.error)
                        }
                    })
            })

        }
    }




    apiCallGetuserDetail = (isForMessageCheck) => {
        userdetail((err, result) => {
            if (!err && result) {
                result = result.success;

                if (result.deleted_at != null) {
                    Alert.alert('', 'You have blocked by Admin')
                    clearPreferance(() => {
                        const resetAction = StackActions.reset({
                            index: 0,
                            actions: [NavigationActions.navigate({ routeName: 'Launch' })],
                        });
                        this.props.navigation.dispatch(resetAction);
                    })
                    return

                }


                storeDataIntoPreferance('id', result.id + "");
                storeDataIntoPreferance('plan', result.plan);
                storeDataIntoPreferance('plan_request', result.plan_request);

                this.setState({
                    name: result.first_name + " " + result.last_name,
                    email: result.email,
                    user_profile: result.user_profile
                })


                if (isForMessageCheck) {
                    if (result.plan === '0') {
                        Alert.alert(
                            'Subscription',
                            'you haven\'t subscribed any plan yet. Subscrie any plan to access this feature',
                            [
                                {
                                    text: 'Cancel',
                                    onPress: () => console.log('Cancel Pressed'),
                                    style: 'cancel',
                                },
                                { text: 'Subscribe', onPress: () => this.props.navigation.navigate('Plan') },
                            ],
                            { cancelable: false },
                        );
                    } 
                    if (result.plan != '0' && result.plan_request === 'pending') {
                        ToastAndroid.show('Plan subscribed but confirmation is pending', ToastAndroid.LONG);
                    }
                }
            }
            else {
                // Alert.alert('', JSON.stringify(err))
            }
        })
    }

    apiCallGetuserList = () => {
        getDataFromPreferance('filter', (value) => {
            let jsonFilter;
            let gender = "";
            let age = "";
            let endage = "";
            let location = "";
            let latitude = "";
            let longitude = "";

            if (value) {
                jsonFilter = JSON.parse(value)
                gender = jsonFilter.gender
                age = jsonFilter.age
                endage = jsonFilter.endege
                location = jsonFilter.location
                latitude = jsonFilter.latitude
                longitude = jsonFilter.longitude
            }

            this.setState({ showIndicator: true, userList: [] })
            userListFilter(
                gender,
                age,
                endage,
                latitude,
                longitude,
                (err, result) => {
                    this.setState({ showIndicator: false })
                    if (!err && result) {
                        result = result.success;

                        let tempList = [];
                        tempList = result;
                        tempList.push("Empty View")

                        this.setState({
                            userList: tempList,
                            disableAllSwipe: tempList.length === 1
                        })

                    }
                    else {
                        // Alert.alert('', JSON.stringify(err))
                    }
                })
        })

    }

    apiCallLogout = () => {
        this.setState({ showIndicator: true })
        logout((err, result) => {
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


    apiCalLikeFavouriteDislike(flag, id) {
        likeDislikeFavourite(flag, id, (err, result) => {
            if (!err && result) {

            }
            else {
                // Alert.alert('', JSON.stringify(err))
            }
        })
    }

    renderCard = (card, index) => {
        return (
            <TouchableOpacity style={styles.card}
                onPress={() => {
                    this.props.navigation.navigate('Profile', {
                        userItem: this.state.userList[index]
                    })
                }}
            >
                {(index) === (this.state.userList.length - 1) ?
                    <View style={{ height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ alignContent: 'center', justifyContent: 'center', fontFamily: 'GothamBold', color: Colors.colorPrimary, fontSize: 19 }}>
                            No more Profile
                            </Text>
                    </View> :
                    <View style={{ width: '100%', height: '100%' }}>
                        <Image style={{ height: '100%', width: '100%' }}
                            source={{ uri: this.state.userList[index].user_profile ? baseImageUrl(this.state.userList[index].user_profile) : 'main_user_ph' }} />

                        <View style={{ position: 'absolute', bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', width: '100%' }}>
                            <Text style={{ color: 'white', fontFamily: 'GothamBook', fontSize: 24, marginBottom: 8, marginTop: 8, marginHorizontal: 16 }}>
                                {this.state.userList[index].first_name} </Text>
                            <Text style={{ color: 'white', fontFamily: 'GothamBook', fontSize: 20, marginBottom: 8, marginHorizontal: 16 }}>
                                {"Age:" + this.getAge(this.state.userList[index].birth_date)} </Text>
                        </View>

                    </View>}

            </TouchableOpacity>
        )
    };

    getAge(dateString) {
        var today = new Date();
        var birthDate = new Date(dateString);
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }

    onSwiped = (index, type) => {
        this.setState({
            updatedCardIndex: index + 1
        })
        let id = type != 'general' ? this.state.userList[index].id : 0

        if ((index + 1) === (this.state.userList.length - 1)) {
            // this.setState({ userList: [] })
            this.setState({ disableAllSwipe: true })
        }

        switch (type) {
            case 'left':
                this.apiCalLikeFavouriteDislike('dislike', id)
                break
            case 'right':
                this.apiCalLikeFavouriteDislike('like', id)
                break
            case 'top':
                this.apiCalLikeFavouriteDislike('fav', id)
                break
            case 'bottom':
                this.apiCalLikeFavouriteDislike('block', id)
                break

        }
        console.log(`on swiped ,${type}`)

    }

    onSwipedAllCards = () => {
        this.setState({
            swipedAllCards: true,
        })
    };

    swipeLeft = () => {
        this.swiper.swipeLeft()
    };

    render() {
        return (
            <DrawerLayout
                onDrawerSlide={e => { }}
                onDrawerStateChanged={e => { }}
                drawerBackgroundColor={Colors.white}
                drawerWidth={300}
                drawerLockMode={'unlocked'}
                ref={drawer => {
                    return (this.drawer = drawer);
                }}
                keyboardDismissMode="on-drag"
                statusBarBackgroundColor={Colors.colorPrimaryDark}
                renderNavigationView={() => this.renderNavigationView()}>

                <ImageBackground style={{ height: '100%', width: '100%' }} source={{ uri: 'bg' }}>
                    <View style={styles.container}>
                        {this.renderEmptyView()}
                        <View style={styles.container}>
                            {this.state.userList.length > 0 ? this.renderSwipper() : null}
                            <HEDashNavigationDrawer
                                onmenuClick={() => { this.openDrawer() }}
                                onFilterClick={() => { this.props.navigation.navigate('Filter') }}
                                onChatClik={() => { this.showAlertForPlanSubscription() }}
                            />
                            {this.renderBottomDashMenu()}
                        </View>

                    </View>
                </ImageBackground>

                <HEActivityIndicator showIndicator={this.state.showIndicator} />
            </DrawerLayout>
        )
    };

    showAlertForPlanSubscription() {
        _this = this;
        getDataFromPreferance('plan', function (value_plan) {
            getDataFromPreferance('plan_request', function (value_p_request) {
                if (value_plan != '0' && value_p_request === 'confirm') {
                    _this.props.navigation.navigate('ChatUserList')
                } else {
                    _this.apiCallGetuserDetail(true)
                }
            })
        })


    }

    renderEmptyView() {
        return (
            this.state.userList.length <= 0 && !this.state.showIndicator ?
                <View style={{
                    height: '100%',
                    width: '100%',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(255,255,255,0.5)',
                    position: 'absolute'
                }}>
                    <View style={{ height: '60%', width: '60%', alignSelf: 'center' }}>
                        <View style={styles.card}>
                            <TouchableOpacity
                                onPress={() => {
                                    this.apiCallGetuserList()
                                }}
                                style={{ flex: 1.0, backgroundColor: Colors.white, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ alignSelf: 'center', fontFamily: 'GothamBold', color: Colors.colorPrimary, fontSize: 19, textAlign: 'center' }}>
                                    No more Profile
                            </Text>
                            </TouchableOpacity>

                        </View>
                    </View>


                </View> : null
        )
    }

    renderNavigationView() {
        return (
            <View>
                <ScrollView>
                    <View>
                        <ImageBackground style={{ width: '100%', height: 110, elevation: 4 }} source={{ uri: 'bg' }}>
                            <View style={{ flex: 1.0, backgroundColor: 'rgba(0,0,0,0.7)', alignItems: 'center', flexDirection: 'row', paddingHorizontal: 16 }}>
                                <Image
                                    style={{ height: 55, width: 55, borderRadius: 28, borderColor: 'white', borderWidth: 2, backgroundColor: Colors.white }}
                                    source={{ uri: this.state.user_profile ? baseImageUrl(this.state.user_profile) : 'user_placeholder' }} />
                                <View style={{ flex: 1.0 }}>
                                    <Text
                                        numberOfLines={2}
                                        style={{ color: 'white', fontSize: 18, fontFamily: 'GothamBold', marginHorizontal: 8, }}>
                                        {this.state.name}</Text>
                                    {/* <Text style={{ color: 'white', fontSize: 10, fontFamily: 'GothamBook', marginStart: 8 }}>
                                        {this.state.email}</Text> */}
                                </View>
                            </View>
                        </ImageBackground>

                        {this.renderDrawerMenu('my_profile', 'menu_user', 'Profile')}
                        {this.renderDrawerMenu('message', 'comment', 'Message')}
                        {this.renderDrawerMenu('match', 'menu_match', 'My match')}
                        {this.renderDrawerMenu('fav', 'menu_favorite', 'Favourite users')}
                        {this.renderDrawerMenu('like', 'menu_like', 'Who liked me')}
                        {this.renderDrawerMenu('visit', 'menu_visits', 'Who visited me')}
                        {this.renderDrawerMenu('gallery', 'menu_gallery', 'Gallery')}
                        {/* {this.renderDrawerMenu('block', 'menu_block', 'Blocked users')} */}
                        {/* {this.renderDrawerMenu('settings', 'menu_gear', 'Settings')} */}
                        {this.renderDrawerMenu('blog', 'menu_blog', 'Blog')}
                        {this.renderDrawerMenu('logout', 'menu_logout', 'Logout')}
                    </View>
                </ScrollView>
            </View>
        )
    }

    logout = () => {

        Alert.alert(
            'Logout ?',
            'Are you sure you want to logout ?',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {
                    text: 'Logout', onPress: () => this.apiCallLogout()
                },
            ],
            { cancelable: false },
        );

    }

    renderDrawerMenu(type, iconName, title) {
        return (
            <TouchableOpacity
                onPress={() => {
                    this.closeDrawer()
                    switch (type) {
                        case 'my_profile':
                            this.props.navigation.navigate('EditProfile')
                            break
                        case 'message':
                            this.props.navigation.navigate('ChatUserList')
                            break
                        case 'match':
                            this.props.navigation.navigate('CommonUserList', {
                                flag: 'match',
                                title: 'My match'
                            })
                            break
                        case 'fav':
                            this.props.navigation.navigate('CommonUserList', {
                                flag: 'fav',
                                title: 'Favourite users'
                            })
                            break
                        case 'like':
                            this.props.navigation.navigate('CommonUserList', {
                                flag: 'like',
                                title: 'Who liked me'
                            })
                            break
                        case 'block':
                            this.props.navigation.navigate('CommonUserList', {
                                flag: 'block',
                                title: 'Blocked users'
                            })
                            break
                        case 'visit':
                            this.props.navigation.navigate('CommonUserList', {
                                flag: 'visit',
                                title: 'Who visited me'
                            })
                            break
                        case 'settings':
                            break
                        case 'blog':
                            this.props.navigation.navigate('Blog', {
                                title: 'Blog'
                            })
                            break
                        case 'gallery':
                            this.props.navigation.navigate('Gallery', {
                                title: 'Blog'
                            })
                            break
                        case 'logout':
                            this.logout()
                            break
                    }
                }}
                style={{ width: '100%', flexDirection: 'row', height: 48, padding: 8, alignItems: 'center' }}>
                <Image style={{ height: 28, width: 28, tintColor: Colors.colorPrimary }} source={{ uri: iconName }} resizeMode='center' />
                <Text style={{ fontFamily: 'GothamBold', marginHorizontal: 16, fontSize: 15, justifyContent: 'center', color: 'black' }}>{title}</Text>
            </TouchableOpacity>
        )
    }

    openDrawer = () => {
        this.drawer.openDrawer();
    }

    closeDrawer = () => {
        this.drawer.closeDrawer();
    }


    renderSwipper() {
        return (
            this.state.userList.length > 0 ?
                <Swiper
                    backgroundColor='rgba(255,255,255,0.8)'
                    ref={swiper => {
                        this.swiper = swiper
                    }}
                    onSwiped={(index) => this.onSwiped(index, 'general')}
                    onSwipedLeft={(index) => this.onSwiped(index, 'left')}
                    onSwipedRight={(index) => this.onSwiped(index, 'right')}
                    onSwipedTop={(index) => this.onSwiped(index, 'top')}
                    onSwipedBottom={(index) => this.onSwiped(index, 'bottom')}
                    onTapCard={this.swipeLeft}
                    cards={this.state.userList}
                    cardIndex={0}
                    cardVerticalMargin={80}
                    renderCard={this.renderCard}
                    onSwipedAll={this.onSwipedAllCards}
                    stackSize={3}
                    stackSeparation={15}
                    disableBottomSwipe={this.state.disableAllSwipe}
                    disableLeftSwipe={this.state.disableAllSwipe}
                    disableRightSwipe={this.state.disableAllSwipe}
                    disableTopSwipe={this.state.disableAllSwipe}
                    overlayLabels={{
                        bottom: {
                            title: 'BLEAH',
                            style: {
                                label: {
                                    backgroundColor: 'black',
                                    borderColor: 'black',
                                    color: 'white',
                                    borderWidth: 1
                                },
                                wrapper: {
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }
                            }
                        },
                        left: {
                            title: 'NOPE',
                            style: {
                                label: {
                                    backgroundColor: 'black',
                                    borderColor: 'black',
                                    color: 'white',
                                    borderWidth: 1
                                },
                                wrapper: {
                                    flexDirection: 'column',
                                    alignItems: 'flex-end',
                                    justifyContent: 'flex-start',
                                    marginTop: 30,
                                    marginLeft: -30
                                }
                            }
                        },
                        right: {
                            title: 'LIKE',
                            style: {
                                label: {
                                    backgroundColor: 'black',
                                    borderColor: 'black',
                                    color: 'white',
                                    borderWidth: 1
                                },
                                wrapper: {
                                    flexDirection: 'column',
                                    alignItems: 'flex-start',
                                    justifyContent: 'flex-start',
                                    marginTop: 30,
                                    marginLeft: 30
                                }
                            }
                        },
                        top: {
                            title: 'SUPER LIKE',
                            style: {
                                label: {
                                    backgroundColor: 'black',
                                    borderColor: 'black',
                                    color: 'white',
                                    borderWidth: 1
                                },
                                wrapper: {
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }
                            }
                        }
                    }}
                    animateOverlayLabelsOpacity
                    animateCardOpacity
                    swipeBackCard
                >


                </Swiper> : null
        )
    }

    renderBottomDashMenu() {
        return (
            <View style={styles.bottomMenuContainer}>
                {this.renderButtonsWithIcons(1, 'previous')}
                {this.renderButtonsWithIcons(2, 'cancel')}
                {this.renderButtonsWithIcons(3, 'favourite')}
                {this.renderButtonsWithIcons(4, 'like')}
            </View>
        )
    }

    renderButtonsWithIcons(type, iconName) {
        return (
            <TouchableOpacity style={styles.buttonIconContainer}
                onPress={() => {
                    if (this.swiper === undefined || this.swiper === null) {
                        return
                    }
                    switch (type) {
                        case 1:
                            this.swiper.swipeBack()
                            this.setState({ disableAllSwipe: this.state.userList.length === 1 })
                            break
                        case 2:
                            if (!this.state.disableAllSwipe) {
                                this.swiper.swipeBottom()
                            }
                            break
                        case 3:
                            if (!this.state.disableAllSwipe) {
                                this.swiper.swipeTop()
                            }
                            break
                        case 4:
                            if (!this.state.disableAllSwipe) {
                                this.swiper.swipeRight()
                            }

                            break
                    }
                }}>
                <Image style={styles.iconImge} source={{ uri: iconName }} />
            </TouchableOpacity>
        )
    }

}

