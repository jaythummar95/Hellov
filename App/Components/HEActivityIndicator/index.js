import React, { Component } from 'react';
import {
    View,
    Text,
    StatusBar,
    SafeAreaView,
    ActivityIndicator
} from 'react-native'
import { Colors } from '../../Constants/constants'

export default class HEActivityIndicator extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            this.props.showIndicator === true ?
                <View style={{
                    position: 'absolute',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(255,255,255,0.7)',
                    height: '100%',
                    width: '100%'
                }}>

                    <ActivityIndicator size="large" color={Colors.colorPrimaryDark} />

                </View> : null
        )
    };
}