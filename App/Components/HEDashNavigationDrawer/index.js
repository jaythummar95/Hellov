import React, { Component } from 'react';
import { Platform, StyleSheet, Button, Text, SafeAreaView, View, Image, TouchableOpacity, ImageBackground } from 'react-native';
import HEStatusbar from '../HEStatusbar'
import styles from './styles'


export default class HEDashNavigationDrawer extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <View style={styles.container}>
                <HEStatusbar />
                <SafeAreaView />
                <View style={{ flexDirection: 'row' }}>
                    {this.renderIcons(1, "menu")}
                    <View style={styles.titleContainer}>
                        <Text style={styles.titleText}>Hellov</Text>
                    </View>
                    {this.renderIcons(2, "ic_filter_new")}
                    {this.renderIcons(3, "comment")}
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
                            this.props.onFilterClick();
                            break
                        case 3:
                            this.props.onChatClik();
                            break
                    }
                }}>
                <Image style={type===2? styles.image2 : styles.image1} source={{ uri: iconName }} resizeMode='center' />
            </TouchableOpacity >
        )
    }
}


