import React, { Component } from 'react';
import { Platform, StyleSheet, Button, Text, View, Image, TouchableOpacity,ToastAndroid, ImageBackground } from 'react-native';
import { Colors } from '../Constants/constants';
import { baseImageUrl } from '../Constants/constants'


export default class UserItemList extends Component {

    constructor(props) {
        super(props)

        this.state = {
            listItem: this.props.listItem,
            isButtonVisible: this.props.isButtonVisible ? this.props.isButtonVisible : false,
            buttonTitle: this.props.buttonTitle
        }
    }



    render() {
        return (
            <TouchableOpacity onPress={() => {this.props.onClickItemView(this.state.listItem)}}>
                <View style={{ width: '100%', paddingHorizontal: 16, paddingVertical: 8, flex: 1.0, flexDirection: 'row' }}>
                    <TouchableOpacity
                        onPress={() => this.props.onPropicClick ? this.props.onPropicClick(this.state.listItem) : null}>
                        <Image style={{ height: 56, width: 56, borderRadius: 28, borderColor: 'rgba(0,0,0,0.1)', borderWidth: 1 }}
                            source={{ uri: this.state.listItem.user_profile ? baseImageUrl(this.state.listItem.user_profile) : 'main_user_ph' }} />
                    </TouchableOpacity>

                    <View style={{ flex: 1.0, justifyContent: 'center' }}>
                        <Text style={{ marginHorizontal: 16, fontSize: 16, fontFamily: 'GothamBold', color: 'black' }}>
                            {this.state.listItem.first_name + " " + this.state.listItem.last_name}
                        </Text>
                        {/* <Text style={{ marginHorizontal: 16, fontSize: 13, fontFamily: 'GothaMedium', color: 'black' }}>Last message</Text> */}

                        {this.state.isButtonVisible ?
                            <TouchableOpacity
                                onPress={() => { this.props.onButtonPress(this.state.listItem.id) }}
                                style={{ marginLeft: 16, marginTop: 2, alignItems: 'center', backgroundColor: Colors.colorAccent, borderRadius: 3, marginHorizontal: 2, width: '45%', elevation: 2 }}>
                                <Text style={{ color: 'white', fontFamily: 'GothamBook', paddingVertical: 3 }}>{this.state.buttonTitle}</Text>
                            </TouchableOpacity>
                            : null}

                    </View>
                    <Image style={{ height: 15, width: 15, alignSelf: 'center', tintColor: Colors.colorAccent, transform: [{ rotate: '180deg' }] }} resizeMode='center' source={{ uri: 'back' }} />
                </View>
                <View style={{ backgroundColor: 'rgba(0,0,0,0.1)', width: '100%', height: 1 }} />
            </TouchableOpacity>
        )
    };
}