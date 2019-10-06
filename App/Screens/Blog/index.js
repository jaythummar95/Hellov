import React, { Component } from 'react';
import { Platform, StyleSheet, Button, Text, View, Image, FlatList, TouchableOpacity, ImageBackground } from 'react-native';
import HEStatusbar from '../../Components/HEStatusbar'
import HETitlteBackNavigationDrawer from '../../Components/HETitlteBackNavigationDrawer'
import { Colors } from '../../Constants/constants';
import LinearGradient from 'react-native-linear-gradient';
import Swiper from 'react-native-deck-swiper'
import DrawerLayout from 'react-native-drawer-layout';
import styles from './styles';
import { baseImageUrl, baseImageUrlBlog } from '../../Constants/constants'
import { blogList } from '../../Constants/Modal'
import HEActivityIndicator from '../../Components/HEActivityIndicator'


export default class Blog extends Component {

    constructor(props) {
        super(props)

        this.state = {
            showIndicator: false,
            blogList: []
        }
    }

    componentDidMount() {
        this.apiCallGetBlogList()
    }


    apiCallGetBlogList() {
        this.setState({ showIndicator: true })
        blogList((err, result) => {
            this.setState({ showIndicator: false })
            if (!err && result) {
                result = result.success;
                this.setState({
                    blogList: result,
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
                    onmenuClick={() => { this.props.navigation.goBack() }} title={'Blog'} />
                <FlatList
                    style={{ width: '100%' }}
                    data={this.state.blogList}
                    renderItem={({ item }) => this.renderItem(item)} />

                <HEActivityIndicator showIndicator={this.state.showIndicator} />
            </View>
        )
    };


    renderItem(item) {
        return (
            <TouchableOpacity
                onPress={() => {
                    this.props.navigation.navigate('BlogDetail',{
                        blogItem: item
                    })
                }}
                style={{
                    width: '100%',
                    alignItems: 'center',
                    flexDirection: 'row',
                    borderBottomColor: 'rgba(0,0,0,0.1)',
                    borderBottomWidth: 1
                }}>

                <Image
                    resizeMode='cover'
                    source={{ uri: item.image ? baseImageUrlBlog(item.image) : 'logo' }}
                    style={{
                        height: 90,
                        width: 90,
                        margin: 8
                    }} />

                <View style={{
                    flexDirection: 'column',
                    marginHorizontal: 8,
                    flex: 1.0
                }}>

                    <Text style={{
                        fontFamily: 'GothamBook',
                        fontSize: 20,
                        color: 'black'
                    }}>
                        {item.title}
                    </Text>

                </View>
                <Image style={{
                    margin: 4,
                    height: 15,
                    width: 15,
                    alignSelf: 'center',
                    tintColor: Colors.colorAccent, transform: [{ rotate: '180deg' }]
                }} resizeMode='center' source={{ uri: 'back' }} />

            </TouchableOpacity>
        )
    }
}