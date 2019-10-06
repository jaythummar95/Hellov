import React, { Component } from 'react';
import { Platform, StyleSheet, Button, Text, View, Image, FlatList, TouchableOpacity, ImageBackground } from 'react-native';
import HEStatusbar from '../../Components/HEStatusbar'
import HETextField from '../../Components/HETextField'
import HETitlteBackNavigationDrawer from '../../Components/HETitlteBackNavigationDrawer'
import { Colors } from '../../Constants/constants';
import LinearGradient from 'react-native-linear-gradient';
import Swiper from 'react-native-deck-swiper'
import DrawerLayout from 'react-native-drawer-layout';
import styles from './styles';
import ChatListItem from '../../Views/ChatListItem'
import { getDataFromPreferance, clearPreferance, storeDataIntoPreferance } from '../../Constants/Preferance'
import HEActivityIndicator from '../../Components/HEActivityIndicator'
import { messageList, messageSend } from '../../Constants/Modal'
import EventBus from 'react-native-event-bus'
import firebase, { Notification } from 'react-native-firebase';
import { NavigationActions, StackActions } from 'react-navigation';



export default class Chat extends Component {

    constructor(props) {
        super(props)

        this.state = {
            messages: [],
            myUserId: '',
            otherUserItem: this.props.navigation.getParam('OtherUserItem'),
            otheUserId: this.props.navigation.getParam('OtherUserItem').id,
            showIndicator: false,
            message: ''
        }


    }

    componentDidMount() {
        global.inChat = true;
        getDataFromPreferance('id', (value) => {
            if (value) {
                this.setState({ myUserId: value })
                this.apiCallGetuserList();
            }
        })

        EventBus.getInstance().addListener("MESSAGE", this.listener = data => {
            // handle the event
            console.log("DATA==>" + data.DATA.data.message)

            var payload = data.DATA.data
            var sender_id = payload.sender_id
            var textMessage = JSON.parse(payload.message).title

            if (sender_id + "" === this.state.otheUserId + "") {
                let tempList = [];
                tempList = this.state.messages
                tempList.push({
                    sender_id: sender_id,
                    receiver_id: this.state.receiver_id,
                    message: textMessage
                })
                this.setState({
                    messages: tempList
                })
                this.flatList.scrollToEnd({ animated: true })
            }
             else {
                const channel = new firebase.notifications.Android.Channel('Hellov', 'Test Channel', firebase.notifications.Android.Importance.Max)
                    .setDescription('My apps test channel');

                firebase.notifications().android.createChannel(channel);
                let notification = data.DATA.data


                if (notification.username) {
                    this._localNotification = new firebase.notifications.Notification({
                        sound: 'default',
                        show_in_foreground: true
                    }).setNotificationId((new Date).getTime() + "")
                        .setTitle(notification.username)
                        .setSubtitle("")
                        .setBody(JSON.parse(notification.message).title)
                        .android.setBigText(JSON.parse(notification.message).title)
                        .setData(notification.data)
                        .android.setAutoCancel(true)
                        .android.setChannelId(channel.channelId) // e.g. the id you chose above
                        // create this icon in Android Studio
                        .android.setSmallIcon('ic_stat_faviconlogo')
                        .android.setColor(Colors.colorPrimary) // you can set a color here
                        .android.setPriority(firebase.notifications.Android.Priority.High);
                } else {
                    this._localNotification = new firebase.notifications.Notification({
                        sound: 'default',
                        show_in_foreground: true
                    }).setNotificationId((new Date).getTime() + "")
                        .setTitle(JSON.parse(notification.message).title)
                        .setSubtitle("")
                        .setBody(JSON.parse(notification.message).body)
                        .android.setBigText(JSON.parse(notification.message).body)
                        .setData(notification.data)
                        .android.setAutoCancel(true)
                        .android.setChannelId(channel.channelId) // e.g. the id you chose above
                        // create this icon in Android Studio
                        .android.setSmallIcon('ic_stat_faviconlogo')
                        .android.setColor(Colors.colorPrimary) // you can set a color here
                        .android.setPriority(firebase.notifications.Android.Priority.High);
                }



                firebase.notifications().displayNotification(this._localNotification).catch(err => console.error(err));
            }
        })

    }

    componentWillUnmount() {
        global.inChat = false;
        EventBus.getInstance().removeListener(this.listener);
    }

    apiCallGetuserList = () => {
        this.setState({ showIndicator: true })
        messageList(this.state.otheUserId, (err, result) => {
            this.setState({ showIndicator: false })
            if (!err && result) {
                result = result.success;
                this.setState({
                    messages: result
                })
            }
            else {
                // Alert.alert('', JSON.stringify(err))
            }
        })
    }

    apiCallSendMessage = () => {

        let tempList = [];
        tempList = this.state.messages
        tempList.push({
            sender_id: this.state.myUserId,
            receiver_id: this.state.otheUserId,
            message: this.state.message
        })
        this.setState({
            messages: tempList,
            message: ''
        })

        this.flatList.scrollToEnd({ animated: true })
        messageSend(this.state.otheUserId, this.state.message, (err, result) => {
            this.setState({ showIndicator: false })
            if (!err && result) {
                result = result.success;
                if (result.block == "1") {
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
                console.log("Message Send")

            }
            else {
                // Alert.alert('', JSON.stringify(err))
            }
        })
    }

    render() {
        return (
            <ImageBackground style={{ height: '100%', width: '100%' }} source={{ uri: 'bg' }}>
                <View style={styles.container}>
                    <HETitlteBackNavigationDrawer
                        onmenuClick={() => { this.props.navigation.goBack() }} title={
                            this.state.otherUserItem.first_name + " " + this.state.otherUserItem.last_name
                        } />
                    <View style={{ flex: 1.0, width: '100%' }}>
                        <FlatList
                            ref={flatList => {
                                this.flatList = flatList
                            }}
                            style={{ width: '100%' }}
                            data={this.state.messages}
                            renderItem={({ item, index }) => <ChatListItem
                                isRight={item.sender_id === this.state.myUserId}
                                index={index}
                                message={item.message} />}
                            onContentSizeChange={() => this.flatList.scrollToEnd({ animated: true })}
                            onLayout={() => this.flatList.scrollToEnd({ animated: true })}
                        />
                    </View>
                    <View style={{ width: '105%', flexDirection: 'row', paddingLeft: 16, minHeight: 56, maxHeight: 150, marginHorizontal: -5, alignSelf: 'center', elevation: 2, borderWidth: 1, borderColor: 'transparent' }}>
                        <HETextField
                            leftImage=''
                            rightImage=''
                            keyboardType='default'
                            placeholder="Type..."
                            onChangeText={(text) => {
                                this.setState({
                                    message: text
                                })
                            }}
                            value={this.state.message}
                            multiline={true}
                        />
                        <TouchableOpacity
                            onPress={() => {
                                // let tempList = [];
                                // tempList = this.state.messages
                                // tempList.push(this.state.message)
                                // this.setState({ messgaes: tempList, message: '' })

                                if (this.state.message) {
                                    this.apiCallSendMessage()
                                }
                            }}>
                            <Image style={{
                                height: 56,
                                width: 56,
                                tintColor: Colors.colorPrimary
                            }} resizeMode='center' source={{ uri: 'send' }} />
                        </TouchableOpacity>

                    </View>
                    <HEActivityIndicator showIndicator={this.state.showIndicator} />
                </View>
            </ImageBackground>
        )
    };
}