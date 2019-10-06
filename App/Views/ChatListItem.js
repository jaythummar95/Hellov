import React, { Component } from 'react';
import { Platform, StyleSheet, Button, Text, View, Image, TouchableOpacity, ToastAndroid, ImageBackground } from 'react-native';
import { Colors } from '../Constants/constants';

export default class UserItemList extends Component {

    constructor(props) {
        super(props)

        this.state = {
            isRight: this.props.isRight,//this.props.index % 2 == 0,
            message: this.props.message
        }
    }



    render() {
        return (
            <View onPress={() => {
                this.props.onClickItemView()
            }}>
                <View style={{
                    alignSelf: this.state.isRight ? 'flex-end' : 'flex-start',
                    backgroundColor: this.state.isRight ? Colors.colorAccent : Colors.colorPrimary,
                    paddingVertical: 4,
                    flex: 1.0,
                    marginVertical: 4,
                    borderRadius: 8,
                    marginLeft: this.state.isRight ? 0 : 8,
                    marginRight: this.state.isRight ? 8 : 0,

                    //borderTopLeftRadius: this.state.isRight ? 16: 0,
                    //borderBottomLeftRadius: this.state.isRight ? 16 : 0,

                    //borderTopRightRadius: this.state.isRight ? 0 : 16,
                    //l̥borderBottomRightRadius: this.state.isRight ? 0 : 16,
                    maxWidth: '70%'

                }}>
                    <Text style={{ color: 'white', fontFamily: 'GothamBold', paddingTop: 4, paddingBottom: 4, fontSize: 16, paddingHorizontal: 16, textAlign: this.state.isRight ? 'left' : 'left' }}>{this.state.message}</Text>
                    {/* <Text style={{ color: 'white', fontFamily: 'GothamBook', fontSize: 9, paddingHorizontal: 24 }}></Text> */}
                </View>
            </View>
        )
    };
}