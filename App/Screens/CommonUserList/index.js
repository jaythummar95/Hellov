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
import { userListLikeDislikeFavUnFav, likeDislikeFavourite, userdetail } from '../../Constants/Modal'
import HEActivityIndicator from '../../Components/HEActivityIndicator'
import { baseImageUrl } from '../../Constants/constants'
import { getDataFromPreferance, clearPreferance, storeDataIntoPreferance } from '../../Constants/Preferance'
import EventBus from 'react-native-event-bus'

export default class CommonUserList extends Component {

    constructor(props) {
        super(props)

        this.state = {
            flag: this.props.navigation.getParam('flag'),
            title: this.props.navigation.getParam('title'),
            showIndicator: false,
            userList: [],
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
        userListLikeDislikeFavUnFav(this.state.flag, (err, result) => {
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

    apiCalLikeFavouriteDislike(flag, id) {
        likeDislikeFavourite(flag, id, (err, result) => {
            if (!err && result) {
                this.apiCallGetuserList()
                EventBus.getInstance().fireEvent("UPDATELIST", {})
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
                    onmenuClick={() => { this.props.navigation.goBack() }} title={this.state.title} />
                <FlatList
                    style={{ width: '100%' }}
                    data={this.state.userList}
                    renderItem={({ item }) =>
                        <UserListItem
                            listItem={item}
                            isButtonVisible={this.state.flag === 'like' || this.state.flag === 'visit' || this.state.flag === 'match' ? false : true}
                            buttonTitle={this.getButtonTitle()}
                            onButtonPress={(id) => {
                                switch (this.state.flag) {
                                    case 'fav':
                                        this.apiCalLikeFavouriteDislike('unfav', id)
                                        break
                                    case 'like':
                                        this.apiCalLikeFavouriteDislike('dislike', id)
                                        break
                                    case 'block':
                                        this.apiCalLikeFavouriteDislike('unblock', id)
                                        break
                                }
                            }}

                            onClickItemView={(listItem) => {

                                _this = this
                                getDataFromPreferance('plan', function (value_plan) {
                                    getDataFromPreferance('plan_request', function (value_p_request) {


                                        if (value_plan != '0' && value_p_request === 'confirm') {
                                            _this.props.navigation.navigate('Chat', {
                                                OtherUserItem: listItem
                                            })
                                        } else {
                                            _this.apiCallGetuserDetail()
                                        }
                                    })
                                })

                            }}

                            onPropicClick={(listItem) => {
                                this.props.navigation.navigate('Profile', {
                                    userItem: listItem
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

    getButtonTitle() {
        switch (this.state.flag) {
            case 'like':
                return 'Dislike'
            case 'fav':
                return 'Unfavourite'
            case 'block':
                return 'Unblock'
        }
    }



}