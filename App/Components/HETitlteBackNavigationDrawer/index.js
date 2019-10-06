import React, { Component } from 'react';
import { Platform, StyleSheet, Button, Text, SafeAreaView, View, Image, TouchableOpacity, ImageBackground } from 'react-native';
import HEStatusbar from '../HEStatusbar'
import styles from './styles'


export default class HETitleBackNavigationDrawer extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <View style={styles.container}>
                <HEStatusbar />
                <SafeAreaView />
                <View style={{ flexDirection: 'row' }}>
                    {this.renderIcons(1, 'back')}
                    <View style={styles.titleContainer}>
                        <Text style={styles.titleText}>{this.props.title}</Text>
                    </View>
                </View>


            </View>
        )
    };

    renderIcons(type, iconName) {
        return (
            <TouchableOpacity style={styles.imageContainer}
                onPress={() => {
                    switch (type) {
                        case 1:
                            this.props.onmenuClick();
                            break
                        case 2:
                            this.props.onUserProfileClick();
                            break
                        case 3:
                            this.props.onChatClik();
                            break
                    }
                }}>
                <Image style={styles.image1} source={{ uri: iconName }} resizeMode='center' />
            </TouchableOpacity >
        )
    }
}


