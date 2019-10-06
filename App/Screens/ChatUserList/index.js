import React, { Component } from 'react';
import { Platform, StyleSheet, Button, Text, View, Image, FlatList, TouchableOpacity, ToastAndroid, ImageBackground } from 'react-native';
import HEStatusbar from '../../Components/HEStatusbar'
import HETitlteBackNavigationDrawer from '../../Components/HETitlteBackNavigationDrawer'
import { Colors } from '../../Constants/constants';
import LinearGradient from 'react-native-linear-gradient';
import Swiper from 'react-native-deck-swiper'
import DrawerLayout from 'react-native-drawer-layout';
import styles from './styles';
import UserListItem from '../../Views/UserListItem'
import { userListLikeDislikeFavUnFav, likeDislikeFavourite ,userdetail} from '../../Constants/Modal'
import HEActivityIndicator from '../../Components/HEActivityIndicator'
import { getDataFromPreferance, clearPreferance, storeDataIntoPreferance } from '../../Constants/Preferance'


export default class ChatUserList extends Component {

    constructor(props) {
        super(props)

        this.state = {
            userList: [],
            showIndicator: false
        }
    }

    apiCallGetuserDetail = () => {
        userdetail((err, result) => {
            if (!err && result) {
                result = result.success;

                storeDataIntoPreferance('id', result.id + "");
                storeDataIntoPreferance('plan', result.plan);
                storeDataIntoPreferance('plan_request', result.plan_request);


                if (result.plan === '0') {
                    this.props.navigation.navigate('Plan')
                } if (result.plan != '0' && result.plan_request === 'pending') {
                    ToastAndroid.show('Plan subscribed but confirmation is pending', ToastAndroid.LONG);
                }
            }
            else {
                // Alert.alert('', JSON.stringify(err))
            }
        })
    }

    componentDidMount() {
        this.apiCallGetuserList()
    }

    apiCallGetuserList = () => {
        this.setState({ showIndicator: true, userList: [] })
        userListLikeDislikeFavUnFav('chat', (err, result) => {
            this.setState({ showIndicator: false })
            if (!err && result) {
                result = result.success;
                this.setState({
                    userList: result
                })
            }
            else {
                // Alert.alert('', JSON.stringify(err))
            }
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <HETitlteBackNavigationDrawer
                    onmenuClick={() => { this.props.navigation.goBack() }} title={'Messages'} />
                <FlatList
                    style={{ width: '100%' }}
                    data={this.state.userList}
                    renderItem={({ item }) =>
                        <UserListItem
                            listItem={item}
                            isButtonVisible={false}
                            buttonTitle={""}
                            onClickItemView={() => {
                                _this = this
                                getDataFromPreferance('plan', function (value_plan) {
                                    getDataFromPreferance('plan_request', function (value_p_request) {
                                        if (value_plan != '0' && value_p_request === 'confirm') {
                                            _this.props.navigation.navigate('Chat', {
                                                OtherUserItem: item
                                            })
                                        } else {
                                            _this.apiCallGetuserDetail()
                                        }
                                    })
                                })

                            }}
                        />}

                    ListEmptyComponent={
                        !this.state.showIndicator ?
                            <Text style={{
                                flex: 1.0,
                                color: Colors.colorPrimary,
                                fontFamily: 'GothamBold',
                                textAlign: 'center',
                                fontSize: 18,
                                marginTop: 78
                            }}>Oopss..  no content found</Text> : null
                    }
                />
                <HEActivityIndicator showIndicator={this.state.showIndicator} />
            </View>
        )
    };
}