import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, ScrollView, Modal, Dimensions, Image, TouchableOpacity, ImageBackground, Alert } from 'react-native';
import styles from './styles'
import HEStatusbar from '../../Components/HEStatusbar'
import HETextField from '../../Components/HETextField'
import HEActivityIndicator from '../../Components/HEActivityIndicator'
import { Colors, baseImageUrl, baseImageUrlGallery } from '../../Constants/constants';
import { signin, forgotpassword, singleUserDetail } from '../../Constants/Modal'
import { StackActions, NavigationActions } from 'react-navigation'
import HETitlteBackNavigationDrawer from '../../Components/HETitlteBackNavigationDrawer'
import { addToVisit, usergalleryList, userdetail } from '../../Constants/Modal'
import Carousel from 'react-native-snap-carousel';
import ImageZoom from 'react-native-image-pan-zoom';
import { getDataFromPreferance, clearPreferance, storeDataIntoPreferance } from '../../Constants/Preferance'

const width = Dimensions.get('window').width;


export default class Profile extends Component {

    constructor(props) {
        super(props)

        this.state = {
            userItem: this.props.navigation.getParam('userItem'),
            showIndicator: false,
            imageList: [],
            corCurrentIndex: 0,
            zoomModalVisible: false
        }
    }


    componentDidMount() {
        this.apiCallAddToVisist()
        this.apiCallGetGalleryImages()
    }

    apiCallAddToVisist = () => {
        addToVisit(this.state.userItem.id, (err, result) => {
            if (!err && result) {
                result = result.success;
            }
            else {
                // Alert.alert('', JSON.stringify(err))
            }
        })
    }

    apiCallGetGalleryImages() {
        this.setState({ showIndicator: true })
        usergalleryList(this.state.userItem.id, (err, result) => {
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

    apiCallGetuserDetail = () => {
        userdetail((err, result) => {
            if (!err && result) {
                result = result.success;

                storeDataIntoPreferance('id', result.id + "");
                storeDataIntoPreferance('plan', result.plan);
                storeDataIntoPreferance('plan_request', result.plan_request);


                if (result.plan === '0') {
                    this.props.navigation.navigate('Plan')
                } if (result.plan != '0' && result.plan_request === 'pending') {
                    ToastAndroid.show('Plan subscribed but confirmation is pending', ToastAndroid.LONG);
                }
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
                    title={this.state.userItem.first_name ?
                        this.state.userItem.first_name + " " +
                        this.state.userItem.last_name : ''} />

                <ScrollView>
                    <View style={{ flex: 1.0 }}>

                        <View style={{
                            height: 250,
                            width: '100%',
                            elevation: 4,
                            marginBottom: 16
                        }}>

                            {
                                this.state.imageList.length <= 0 ?
                                    <Image
                                        source={{ uri: 'main_user_ph' }}
                                        style={{ height: '100%', width: '100%', position: 'absolute' }} />
                                    : null
                            }


                            <Carousel
                                ref={(c) => { this._carousel = c; }}
                                data={this.state.imageList}
                                renderItem={(item, index) => this.renderItem(item.item, index)}
                                itemWidth={width}
                                sliderWidth={width}
                                inactiveSlideScale={1.0}
                                firstItem={0}
                                onSnapToItem={index => this.setState({ corCurrentIndex: index })}
                            />

                            <TouchableOpacity
                                onPress={() => {
                                    this._carousel.snapToNext(true, true)
                                }}
                                style={{
                                    height: 30,
                                    width: 30,
                                    borderRadius: 15,
                                    backgroundColor: 'white',
                                    alignSelf: 'center',
                                    right: 16,
                                    position: 'absolute',
                                    elevation: 2,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    bottom: 8
                                }}>
                                <Image style={{ height: 20, width: 20, tintColor: Colors.colorPrimary }}
                                    source={{ uri: 'ic_forward' }} />
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => {
                                    this._carousel.snapToPrev(true, true)
                                }}
                                style={{
                                    height: 30,
                                    width: 30,
                                    borderRadius: 15,
                                    backgroundColor: 'white',
                                    alignSelf: 'center',
                                    left: 16,
                                    position: 'absolute',
                                    elevation: 2,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    bottom: 8
                                }}>
                                <Image style={{ height: 20, width: 20, transform: [{ rotate: '180deg' }], tintColor: Colors.colorPrimary }}
                                    source={{ uri: 'ic_forward' }} />
                            </TouchableOpacity>


                            <TouchableOpacity
                                onPress={() => {
                                    this.setState({ zoomModalVisible: true })
                                }}
                                style={{
                                    height: 45,
                                    width: 45,
                                    borderRadius: 23,
                                    backgroundColor: 'white',
                                    alignSelf: 'center',
                                    right: -8,
                                    position: 'absolute',
                                    elevation: 2,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    bottom: 125
                                }}>
                                <Image style={{ height: 20, width: 20, tintColor: Colors.colorPrimary }}
                                    source={{ uri: 'ic_zoom_in' }} />
                            </TouchableOpacity>


                        </View>

                        {/* <Image
                            source={{
                                uri: this.state.userItem.user_profile ?
                                    baseImageUrl(this.state.userItem.user_profile) : 'main_user_ph'
                            }}
                            style={{
                                elevation: 3,
                                height: 100,
                                width: 100,
                                borderRadius: 50,
                                alignSelf: 'center',
                                borderWidth: 1,
                                borderColor: Colors.colorPrimary
                            }} /> */}


                        {this.renderTitleAndValue("Name", this.state.userItem.first_name + " " + this.state.userItem.last_name)}
                        {this.renderTitleAndValue("D.O.B", this.state.userItem.birth_date)}
                        {this.renderTitleAndValue("Gender", this.state.userItem.gender === "male" ? "Male" : "Female")}
                        {this.renderTitleAndValue("City", this.state.userItem.city != null && this.state.userItem.city != "null" ? this.state.userItem.city : '')}
                        {this.renderTitleAndValue("Country", this.state.userItem.country != null && this.state.userItem.country != "null" ? this.state.userItem.country : '')}
                        {this.renderTitleAndValue("Marital Status", this.state.userItem.marital_status != null && this.state.userItem.marital_status != "null" ? this.state.userItem.marital_status : '')}
                        {this.renderTitleAndValue("Profession", this.state.userItem.profession != null && this.state.userItem.profession != "null" ? this.state.userItem.profession : '')}
                        {this.renderTitleAndValue("Religion", this.state.userItem.religion != null && this.state.userItem.religion != "null" ? this.state.userItem.religion : '')}
                        {this.renderTitleAndValue("Height", this.state.userItem.size != null && this.state.userItem.size != "null" ? this.state.userItem.size : '')}
                        {this.renderTitleAndValue("Weight", this.state.userItem.weight != null && this.state.userItem.weight != "null" ? this.state.userItem.weight : '')}
                        {this.renderTitleAndValue("About me", this.state.userItem.description != null && this.state.userItem.description != "null" ? this.state.userItem.description : '')}

                        <TouchableOpacity
                            style={{
                                height: 40,
                                alignSelf: 'flex-end',
                                margin: 16,

                                borderRadius: 20,
                                backgroundColor: Colors.colorPrimary,
                                elevation: 3,
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                            onPress={() => {
                                this.showAlertForPlanSubscription();
                            }}>

                            <Image style={{ height: 25, width: 25, marginStart: 8 }} source={{ uri: 'comment' }} />
                            <Text style={{
                                color: 'white',
                                fontFamily: 'GothamMedium',
                                fontSize: 17,
                                marginStart: 4,
                                marginEnd: 8
                            }}>Message</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                <HEActivityIndicator showIndicator={this.state.showIndicator} />
                {this.renderZoomCorosole()}
            </View>
        )
    };


    showAlertForPlanSubscription() {
        _this = this;
        getDataFromPreferance('plan', function (value_plan) {
            getDataFromPreferance('plan_request', function (value_p_request) {
                if (value_plan != '0' && value_p_request === 'confirm') {
                    _this.props.navigation.navigate('Chat', { OtherUserItem: _this.state.userItem })
                } else {
                    _this.apiCallGetuserDetail(true)
                }
            })
        })


    }


    renderItem(item) {
        return (
            <View style={{ height: '100%', width: '100%' }}>
                <Image
                    resizeMode='stretch'
                    style={{ height: '100%', width: '100%' }}
                    source={{ uri: baseImageUrlGallery(item.image) }} />
            </View>
        )
    }

    renderItemZoomCorosol(item) {
        return (
            <View style={{ height: '100%', width: '100%' }}>
                <ImageZoom
                    cropWidth={Dimensions.get('window').width}
                    cropHeight={Dimensions.get('window').height}
                    imageWidth={Dimensions.get('window').width}
                    imageHeight={250}>
                    <Image
                        resizeMode='stretch'
                        style={{ height: '100%', width: '100%' }}
                        source={{ uri: baseImageUrlGallery(item.image) }} />
                </ImageZoom>
            </View>
        )
    }

    renderZoomCorosole() {
        return (
            <Modal transparent={false} visible={this.state.zoomModalVisible}>
                <View style={{
                    flex: 1.0,
                    backgroundColor: 'black'
                }}>
                    <View style={{
                        flex: 1.0,
                        position: 'absolute'
                    }}>

                        <Carousel
                            style={{ position: 'absolute' }}
                            ref={(c) => { this._carouselzoom = c; }}
                            data={this.state.imageList}
                            renderItem={(item, index) => this.renderItemZoomCorosol(item.item, index)}
                            itemWidth={width}
                            sliderWidth={width}
                            inactiveSlideScale={1.0}
                            onSnapToItem={index => this.setState({ corCurrentIndex: index })}
                        />
                    </View>
                    <View style={{
                        width: '100%',
                        flexDirection: 'row'
                    }}>

                        <TouchableOpacity style={{ left: 0 }}
                            onPress={() => { this.setState({ zoomModalVisible: false }) }}>
                            <Image source={{ uri: 'ic_delete_new' }} style={{ height: 44, width: 44, tintColor: 'white' }} resizeMode='center' />
                        </TouchableOpacity>

                        <Text style={{
                            position: 'absolute',
                            color: 'white',
                            justifyContent: 'center',
                            alignSelf: 'center',
                            textAlign: 'center',
                            paddingTop: 8,
                            right: Dimensions.get('screen').width / 2.2,
                            fontFamily: 'GothamBook'
                        }}>
                            {(this.state.corCurrentIndex + 1) + "of(" + this.state.imageList.length + ")"}
                        </Text>


                    </View>


                </View>

            </Modal>
        )
    }

    renderTitleAndValue(lable, value) {
        return (
            <View style={{
                width: '90%',
                alignSelf: 'center',
                minHeight: 56,
                elevation: 3,
                marginTop: 8,
                marginBottom: 4,
                borderColor: 'white',
                backgroundColor: 'white',
                justifyContent: 'center'
            }}>
                <Text style={{
                    color: 'black',
                    fontFamily: 'GothamBold',
                    marginStart: 16,
                    fontSize: 15
                }}>{lable + ":"}</Text>
                <Text style={{
                    color: 'black',
                    fontFamily: 'GothmaBook',
                    fontSize: 17,
                    marginStart: 16
                }}>{value}</Text>
            </View>
        )
    }
}