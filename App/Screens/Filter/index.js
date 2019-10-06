import React, { Component } from 'react';
import { Platform, StyleSheet, Button, Text, View, TextInput, Dimensions, Image, FlatList, Modal, TouchableOpacity, ToastAndroid, ImageBackground } from 'react-native';
import HEStatusbar from '../../Components/HEStatusbar'
import HETitlteBackNavigationDrawer from '../../Components/HETitlteBackNavigationDrawer'
import { Colors } from '../../Constants/constants';
import LinearGradient from 'react-native-linear-gradient';
import Swiper from 'react-native-deck-swiper'
import DrawerLayout from 'react-native-drawer-layout';
import styles from './styles';
import UserListItem from '../../Views/UserListItem'
import { userListLikeDislikeFavUnFav, likeDislikeFavourite, placeComplete } from '../../Constants/Modal'
import HEActivityIndicator from '../../Components/HEActivityIndicator'
import { getDataFromPreferance, clearPreferance, storeDataIntoPreferance } from '../../Constants/Preferance'
import Geocoder from 'react-native-geocoding';
import { ScrollView } from 'react-native-gesture-handler';
import EventBus from 'react-native-event-bus';

// demo purposes only
function* range(start, end) {
    for (let i = start; i <= end; i++) {
        yield i
    }
}

export default class Filter extends Component {


    constructor(props) {
        super(props)

        // Geocoder.init('AIzaSyA_AisesHWVC--wpTDvQ0rweuZzQSjXpkY');
        Geocoder.init('AIzaSyAeFfkP1KK7L3KG40bnTyXy6DOQC6pXr8g');

        this.state = {
            showIndicator: false,
            gender: '',
            age: '',
            endege: '',
            agelist: [...range(18, 80)],
            isModal: false,
            locationsResult: [],
            location: '',
            latitude: '',
            longitude: '',
            isForEndage: false,

        }
    }

    componentDidMount() {
        getDataFromPreferance('filter', (value) => {
            let jsonFilter;
            if (value) {
                jsonFilter = JSON.parse(value)
                this.setState({
                    gender: jsonFilter.gender,
                    age: jsonFilter.age,
                    endege: jsonFilter.endege,
                    location: jsonFilter.location,
                    latitude: jsonFilter.latitude,
                    longitude: jsonFilter.longitude,
                })
                console.log("FILTER_VALUE==>" + value ? jsonFilter.gender : '')

            }
        })
    }

    getLocationFromAddress = async (address) => {
        this.setState({ showIndicator: true })
        Geocoder.from(address)
            .then(json => {
                this.setState({ indicator: true })
                var location = json.results[0].geometry.location;

                var latitude = location.lat;
                var longitude = location.lng;

                console.log(latitude + longitude)

                this.setState({
                    location: address,
                    latitude: latitude,
                    longitude: longitude,
                    locationsResult: []
                })

                // this.props.navigation.state.params.returnData(latitude, longitude, address,
                //     this.props.navigation.getParam('purpose'));
                // this.props.navigation.goBack();
            })
            .catch(error => console.log(error), this.setState({ showIndicator: false }));
    }

    render() {
        return (
            <View style={styles.container}>
                <ScrollView>
                    <View style={styles.container}>
                        <HETitlteBackNavigationDrawer
                            onmenuClick={() => { this.props.navigation.goBack() }} title={'Filter'} />
                        {this.renderGenderFilter()}
                        {this.renderAgeFilter()}
                        {this.renderAgeFilterEnd()}
                        {this.renderAutoCompletePlace()}
                        {this.renderAddressList()}
                        <TouchableOpacity style={styles.buttonLogin} onPress={() => {
                            let jsonFilter = {
                                gender: this.state.gender,
                                age: this.state.age,
                                endege: this.state.endege,
                                location: this.state.location,
                                latitude: this.state.latitude,
                                longitude: this.state.longitude,
                            }
                            storeDataIntoPreferance('filter', JSON.stringify(jsonFilter))
                            EventBus.getInstance().fireEvent("UPDATELIST")
                            this.props.navigation.goBack();

                        }}>
                            <Text style={styles.textsocialSignInStyle}>Submit</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.buttonLogin} onPress={() => {
                            let jsonFilter = {
                                gender: '',
                                age: '',
                                endege: '',
                                location: '',
                                latitude: '',
                                longitude: '',
                            }
                            this.setState({
                                gender: jsonFilter.gender,
                                age: jsonFilter.age,
                                endege: jsonFilter.endege,
                                location: jsonFilter.location,
                                latitude: jsonFilter.latitude,
                                longitude: jsonFilter.longitude,
                            })
                            storeDataIntoPreferance('filter', JSON.stringify(jsonFilter))
                            EventBus.getInstance().fireEvent("UPDATELIST")
                        }}>
                            <Text style={styles.textsocialSignInStyle}>Clear</Text>
                        </TouchableOpacity>
                        {this.renderNumberPickerModal()}
                    </View>
                </ScrollView>

                <HEActivityIndicator showIndicator={this.state.showIndicator} />
            </View>
        )
    };

    renderGenderFilter() {
        return (
            <View>
                <Text style={{ marginLeft: 12, marginTop: 16, color: Colors.colorPrimary, fontFamily: 'GothamBook', fontSize: 20, marginBottom: 6 }}>Gender :</Text>
                <View style={{ width: '95%', marginHorizontal: 16, borderWidth: 1, flexDirection: 'row', borderColor: Colors.colorAccent }}>
                    <TouchableOpacity
                        onPress={() => {
                            this.setState({ gender: 'male' })
                        }}
                        style={{
                            height: 44,
                            flex: 0.5,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: this.state.gender === 'male' ? Colors.colorAccent : Colors.white,
                            borderRightWidth: 1,
                            borderRightColor: Colors.colorAccent
                        }}>
                        <Text style={{
                            fontFamily: 'GothamBold', fontSize: 15,
                            color: this.state.gender === 'male' ? Colors.white : Colors.colorAccent
                        }}>
                            Male
                </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            this.setState({ gender: 'female' })
                        }}
                        style={{
                            height: 44,
                            flex: 0.5,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: this.state.gender === 'female' ? Colors.colorAccent : Colors.white
                        }}>
                        <Text style={{
                            fontFamily: 'GothamBold', fontSize: 15,
                            color: this.state.gender === 'female' ? Colors.white : Colors.colorAccent
                        }}>
                            Female
                </Text>
                    </TouchableOpacity>
                </View>

            </View>

        )
    }

    renderAgeFilter() {
        return (
            <View>
                <Text style={{ marginLeft: 12, marginTop: 16, color: Colors.colorPrimary, fontFamily: 'GothamBook', fontSize: 20, marginBottom: 6 }}>Age from :</Text>
                <View style={{ width: '95%', marginHorizontal: 16, borderWidth: 1, flexDirection: 'row', borderColor: Colors.colorAccent }}>
                    <TouchableOpacity
                        onPress={() => {
                            this.setState({ isModal: true, isForEndage: false })
                        }}
                        style={{
                            height: 44,
                            flex: 1.0,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: Colors.white
                        }}>
                        <Text style={{
                            fontFamily: 'GothamBold', fontSize: 15,
                            color: Colors.colorAccent
                        }}>
                            {this.state.age ? this.state.age : 'Age from'}
                        </Text>
                    </TouchableOpacity>
                </View>

            </View>

        )
    }

    renderAgeFilterEnd() {
        return (
            <View>
                <Text style={{ marginLeft: 12, marginTop: 16, color: Colors.colorPrimary, fontFamily: 'GothamBook', fontSize: 20, marginBottom: 6 }}>Age to :</Text>
                <View style={{ width: '95%', marginHorizontal: 16, borderWidth: 1, flexDirection: 'row', borderColor: Colors.colorAccent }}>
                    <TouchableOpacity
                        onPress={() => {
                            this.setState({ isModal: true, isForEndage: true })
                        }}
                        style={{
                            height: 44,
                            flex: 1.0,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: Colors.white
                        }}>
                        <Text style={{
                            fontFamily: 'GothamBold', fontSize: 15,
                            color: Colors.colorAccent
                        }}>
                            {this.state.endege ? this.state.endege : 'Age to'}
                        </Text>
                    </TouchableOpacity>
                </View>

            </View>

        )
    }

    renderAutoCompletePlace() {
        return (
            <View>
                <Text style={{ marginLeft: 12, marginTop: 16, color: Colors.colorPrimary, fontFamily: 'GothamBook', fontSize: 20, marginBottom: 6 }}>Location :</Text>
                <View style={{ width: '95%', marginHorizontal: 16, borderWidth: 1, flexDirection: 'row', borderColor: Colors.colorAccent }}>
                    <View
                        style={{
                            height: 44,
                            flex: 1.0,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: Colors.white
                        }}>

                        <TextInput
                            style={{
                                fontFamily: 'GothamBold', fontSize: 15,
                                color: Colors.colorAccent,
                                width: '100%',
                                textAlign: 'center'
                            }}
                            autoCapitalize='none'
                            keyboardType={'default'}
                            placeholder={'Select location'}
                            placeholderTextColor={Colors.colorAccent}
                            multiline={false}
                            value={this.state.location}
                            onChangeText={(text) => {
                                this.setState({ location: text })
                                placeComplete(text, (err, result) => {
                                    if (err == null && result != null) {
                                        console.log(result)
                                        this.setState({
                                            locationsResult: result
                                        })
                                    } else {
                                        // alert(err)
                                    }
                                })
                            }}
                        />
                    </View>
                </View>

            </View>

        )
    }


    renderAddressList = () => {
        return (
            this.state.locationsResult.length > 0 ?
                <FlatList
                    style={{ height: this.state.locationsResult.length * 40, marginLeft: 30, marginRight: 30 }}
                    data={this.state.locationsResult}
                    extraData={this.state}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => {
                        return (
                            <TouchableOpacity
                                style={{ height: 40, width: '100%' }}
                                onPress={() => {
                                    this.getLocationFromAddress(item.description)
                                }}>
                                <View style={{
                                    margin: 2, flex: 1.0, justifyContent: 'center',
                                    borderBottomWidth: 0.3,
                                    borderBottomColor: '#dfdfdf',
                                }}>
                                    <Text style={{
                                        alignSelf: 'center', width: '100%', paddingLeft: 4, paddingRight: 4, fontFamily: 'Poppins-Regular',
                                        color: 'black'
                                    }}
                                    >{item.description}</Text>
                                </View>
                            </TouchableOpacity>

                        )
                    }}
                /> : null
        )
    }

    renderNumberPickerModal() {
        return (
            <Modal transparent={true} visible={this.state.isModal}>
                <View style={{
                    flex: 1.0,
                    marginTop: Dimensions.get('screen').height / 2.1,
                    backgroundColor: Colors.colorAccent
                }}>
                    <TouchableOpacity style={{ left: 0 }}
                        onPress={() => { this.setState({ isModal: false }) }}>
                        <Image source={{ uri: 'ic_delete_new' }} style={{ height: 44, width: 44, tintColor: 'white' }} resizeMode='center' />
                    </TouchableOpacity>

                    <View style={{
                        flex: 1.0,
                        width: '100%',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>

                        <FlatList
                            numColumns={7}
                            data={this.state.agelist}
                            renderItem={({ item }) =>
                                <TouchableOpacity
                                    onPress={() => {
                                        if (this.state.isForEndage) {
                                            this.setState({ endege: item, isModal: false })
                                        } else {
                                            this.setState({ age: item, isModal: false })
                                        }

                                    }}>
                                    <Text style={{
                                        flex: 1.0,
                                        color: 'white',
                                        fontFamily: 'GothamBold',
                                        fontSize: 21,
                                        marginTop: 4,
                                        padding: 8,
                                        textAlign: 'center'
                                    }}>{item}</Text>
                                </TouchableOpacity>
                            }
                        />
                    </View>
                </View>

            </Modal>
        )
    }

}