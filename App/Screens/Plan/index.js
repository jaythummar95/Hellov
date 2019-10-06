import React, { Component } from 'react';
import { Platform, StyleSheet, Button, Text, View, Image, ToastAndroid, FlatList, TouchableOpacity, ImageBackground } from 'react-native';
import HEStatusbar from '../../Components/HEStatusbar'
import HETitlteBackNavigationDrawer from '../../Components/HETitlteBackNavigationDrawer'
import { Colors } from '../../Constants/constants';
import LinearGradient from 'react-native-linear-gradient';
import Swiper from 'react-native-deck-swiper'
import DrawerLayout from 'react-native-drawer-layout';
import styles from './styles';
import UserListItem from '../../Views/UserListItem'
import HEActivityIndicator from '../../Components/HEActivityIndicator'
import { planRequest, userdetail } from '../../Constants/Modal'
import { storeDataIntoPreferance } from '../../Constants/Preferance'
import { NavigationActions, StackActions } from 'react-navigation';


export default class Plan extends Component {

    constructor(props) {
        super(props)

        this.state = {
            showIndicator: false
        }
    }

    apiCallSubscribePlan = (plan_id) => {
        this.setState({ showIndicator: true })
        planRequest(plan_id, (err, result) => {
            if (!err && result) {
                result = result.success;

                this.apiCallGetuserDetail();



            }
            else {
                this.setState({ showIndicator: false })
                // Alert.alert('', JSON.stringify(err))
            }
        })
    }

    apiCallGetuserDetail = () => {
        userdetail((err, result) => {
            this.setState({ showIndicator: false })
            if (!err && result) {
                result = result.success;


                storeDataIntoPreferance('plan', result.plan)
                storeDataIntoPreferance('plan_request', result.plan_request)

                ToastAndroid.show('Plan subscribed sucessfully', ToastAndroid.SHORT);
                const resetAction = StackActions.reset({
                    index: 0,
                    actions: [NavigationActions.navigate({ routeName: 'Dash' })],
                });
                this.props.navigation.dispatch(resetAction);
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
                    onmenuClick={() => { this.props.navigation.goBack() }} title={'Subscribe plan'} />
                {this.renderPlan(1, 'Silver', '1000 CFA for the month')}
                {this.renderPlan(3, 'Gold', '2000 CFA for 3 months')}
                {this.renderPlan(3, 'Platinum', '3000 CFA for 6 months')}
                <HEActivityIndicator showIndicator={this.state.showIndicator} />
            </View>
        )
    };


    renderPlan(type, title, price, message) {
        return (
            <TouchableOpacity
                style={{ borderRadius: 2, elevation: 2, marginHorizontal: -2, marginBottom: 4, }}
                onPress={() => {
                    this.apiCallSubscribePlan(type)
                }}>
                <View style={{ width: '100%', paddingHorizontal: 16, paddingVertical: 8, flexDirection: 'row' }}>
                    <Image style={{ height: 100, width: 100, borderRadius: 5, tintColor: Colors.colorPrimary }}
                        source={{ uri: 'coins' }} />
                    <View style={{ flex: 1.0 }}>
                        <Text style={{ marginTop: 8, marginHorizontal: 16, fontSize: 24, fontFamily: 'GothamBold', color: 'black' }}>
                            {title}
                        </Text>
                        <Text style={{ marginTop: 8, marginHorizontal: 16, fontSize: 18, fontFamily: 'GothamMidum', color: 'black' }}>
                            {price}
                        </Text>
                        <Text style={{ marginHorizontal: 16, fontSize: 13, fontFamily: 'GothaMedium', color: 'black' }}>
                            {message}
                        </Text>
                    </View>
                </View>
                <View style={{ backgroundColor: 'rgba(0,0,0,0.1)', width: '100%', height: 1 }} />
            </TouchableOpacity>
        )
    }
}