import React, { Component } from 'react';
import {
    View,
    Text,
    StatusBar,
    SafeAreaView
} from 'react-native'
import { Colors } from '../../Constants/constants'

export default class HEStatusBar extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <View>
                <SafeAreaView />
                <StatusBar
                    backgroundColor={Colors.colorPrimaryDark}
                    barStyle="light-content" />
            </View>
        )
    };
}