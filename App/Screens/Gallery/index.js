import React, { Component } from 'react';
import { Platform, StyleSheet, Text, Dimensions, View, FlatList, Image, ToastAndroid, Alert, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import styles from './styles'
import HEStatusbar from '../../Components/HEStatusbar'
import HETextField from '../../Components/HETextField'
import HEActivityIndicator from '../../Components/HEActivityIndicator'
import { Colors } from '../../Constants/constants';
import { updateProfile } from '../../Constants/Modal'
// import ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import DateTimePicker from "react-native-modal-datetime-picker";
import moment from 'moment'
import { storeDataIntoPreferance } from '../../Constants/Preferance'
import { LoginManager, GraphRequest, GraphRequestManager, AccessToken } from 'react-native-fbsdk';
import { StackActions, NavigationActions } from 'react-navigation'
import HETitlteBackNavigationDrawer from '../../Components/HETitlteBackNavigationDrawer'
import { baseImageUrl, baseImageUrlGallery } from '../../Constants/constants'
import { galleryList, addImageToGallery, galleryDelete } from '../../Constants/Modal'
import ImagePicker from 'react-native-image-crop-picker';



export default class Gallery extends Component {
    constructor(props) {
        super(props)

        this.state = {
            showIndicator: false,
            imageList: []
        }
    }

    componentDidMount() {
        this.apiCallGetGalleryImages()
    }

    setnavigateToImagePicker() {
        ImagePicker.openPicker({
            width: 400,
            height: 300,
            cropping: true
        }).then(image => {
            this.apiCallSaveImageTogallery(image.path)
        });
    }

    apiCallGetGalleryImages() {
        this.setState({ showIndicator: true })
        galleryList((err, result) => {
            this.setState({ showIndicator: false })
            if (!err && result) {
                result = result.success;
                this.setState({
                    imageList: result
                })
            }
            else {
                // Alert.alert('', JSON.stringify(err))
            }
        })
    }

    apiCallGetGalleryDelete(image_id) {
        this.setState({ showIndicator: true })
        galleryDelete(image_id, (err, result) => {
            this.setState({ showIndicator: false })
            if (!err && result) {
                result = result.success;
                this.apiCallGetGalleryImages()
            }
            else {
                // Alert.alert('', JSON.stringify(err))
            }
        })
    }

    apiCallSaveImageTogallery(image) {
        this.setState({ showIndicator: true })
        addImageToGallery(image, (err, result) => {
            this.setState({ showIndicator: false })
            if (!err && result) {
                result = result.success;

                this.apiCallGetGalleryImages()
            }
            else {
                // Alert.alert('', JSON.stringify(err))
            }
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.container}>
                    <HEStatusbar />
                    <HETitlteBackNavigationDrawer
                        onmenuClick={() => { this.props.navigation.goBack() }} title={"Gallery"} />
                    <TouchableOpacity style={styles.buttonLogin}
                        onPress={() => {
                            this.setnavigateToImagePicker()
                        }}>
                        <Text style={styles.textsocialSignInStyle}>Add image to gallery</Text>
                    </TouchableOpacity>

                    <FlatList
                        numColumns={3}
                        data={this.state.imageList}
                        renderItem={({ item, index }) => this.renderGallery(item, index)}
                        ListEmptyComponent={
                            !this.state.showIndicator ?
                                <Text style={{
                                    flex: 1.0,
                                    color: Colors.colorPrimary,
                                    fontFamily: 'GothamBold',
                                    textAlign: 'center',
                                    fontSize: 18,
                                    marginTop: 78
                                }}>{"Oopss..  no content found\n\nTap on above given button to add image"}</Text> : null
                        }
                    />
                </View>

                <HEActivityIndicator showIndicator={this.state.showIndicator} />
            </View>
        )
    };

    renderGallery(item, index) {
        return (
            <View style={{
                // width: Dimensions.get('window').width / 3,
                height: Dimensions.get('window').width / 3,
                width: Dimensions.get('window').width / 3,
                flexDirection: 'column',
                justifyContent:'center',
                alignItems:'center'

            }}>
                <Image source={{ uri: baseImageUrlGallery(item.image) }}
                    style={{ width: '98%', height: '98%', borderWidth: 1,
                    borderColor: 'rgba(0,0,0,0.2)', }} />
                <TouchableOpacity
                    style={{
                        height: 22,
                        width: 22,
                        position: 'absolute',
                        bottom: 6,
                        right: 6,
                        backgroundColor: 'white',
                        borderRadius: 11,
                        justifyContent: 'center',
                        alignItems: 'center',
                        elevation: 2
                    }}
                    onPress={() => {
                        this.apiCallGetGalleryDelete(item.id)
                    }}>
                    <Image
                        source={{ uri: 'ic_delete' }}
                        style={{
                            height: 17,
                            width: 17,
                            tintColor: Colors.colorAccent
                        }} />
                </TouchableOpacity>

            </View>
        )

    }
}