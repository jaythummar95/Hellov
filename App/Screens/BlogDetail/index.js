import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, ScrollView, Image, WebView, TouchableOpacity, ImageBackground, Alert } from 'react-native';
import styles from './styles'
import HEStatusbar from '../../Components/HEStatusbar'
import HETextField from '../../Components/HETextField'
import HEActivityIndicator from '../../Components/HEActivityIndicator'
import { Colors, baseImageUrl, baseImageUrlBlog } from '../../Constants/constants';
import { signin, forgotpassword } from '../../Constants/Modal'
import { storeDataIntoPreferance } from '../../Constants/Preferance'
import { StackActions, NavigationActions } from 'react-navigation'
import HETitlteBackNavigationDrawer from '../../Components/HETitlteBackNavigationDrawer'
import { blogDetail } from '../../Constants/Modal'


export default class BlogDetail extends Component {

    constructor(props) {
        super(props)

        this.state = {
            blogItem: this.props.navigation.getParam('blogItem')
        }
    }


    componentDidMount() {
        // this.apicallBlogDetail()
    }

    apicallBlogDetail = () => {
        blogDetail(this.state.userItem.id, (err, result) => {
            if (!err && result) {
                result = result.success;
            }
            else {
                // Alert.alert('', JSON.stringify(err))
            }
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <HEStatusbar />
                <HETitlteBackNavigationDrawer
                    onmenuClick={() => { this.props.navigation.goBack() }}
                    title={this.state.blogItem.title} />


                <View style={{ flex: 1.0 }}>

                    <Image
                        source={{
                            uri: this.state.blogItem.image ?
                                baseImageUrlBlog(this.state.blogItem.image) : 'logo'
                        }}
                        style={{
                            elevation:7,
                            height: 250,
                            width: '100%'
                        }} />

                    <WebView
                        source={{ html: this.state.blogItem.description }}
                        style={{ marginTop: 20 }}
                    />


                </View>
            </View>
        )
    };

}