import React, { Component } from 'react';
import { Platform, StyleSheet, Button, Text, View, Image, PermissionsAndroid, TouchableOpacity, ToastAndroid, Alert, ImageBackground } from 'react-native';
import HEStatusbar from '../../Components/HEStatusbar'
import HETitlteBackNavigationDrawer from '../../Components/HETitlteBackNavigationDrawer'
import { Colors } from '../../Constants/constants';
import Swiper from 'react-native-deck-swiper'
import styles from './styles';
import { userList, likeDislikeFavourite, userListFilter } from '../../Constants/Modal'
import HEActivityIndicator from '../../Components/HEActivityIndicator'
import { baseImageUrl } from '../../Constants/constants'


// demo purposes only
function* range(start, end) {
    for (let i = start; i <= end; i++) {
        yield i
    }
}

export default class FilterResult extends Component {


    constructor(props) {
        super(props)
        this.state = {
            swipedAllCards: false,
            swipeDirection: '',
            cardIndex: 0,
            name: '',
            email: '',
            user_profile: '',
            showIndicator: false,
            userList: [],
            updatedCardIndex: 0,
            disableAllSwipe: false,
            gender: this.props.navigation.getParam('gender'),
            start_age: this.props.navigation.getParam('start_age'),
            end_age: this.props.navigation.getParam('end_age'),
            lat: this.props.navigation.getParam('lat'),
            longi: this.props.navigation.getParam('longi'),
        }
    }

    componentDidMount() {
        this.apiCallGetuserList()
    }

    apiCallGetuserList = () => {
        this.setState({ showIndicator: true, userList: [] })
        userListFilter(
            this.state.gender,
            this.state.start_age,
            this.state.end_age,
            this.state.lat,
            this.state.longi,
            (err, result) => {
                this.setState({ showIndicator: false })
                if (!err && result) {
                    result = result.success;

                    let tempList = [];
                    tempList = result;
                    tempList.push("Empty View")

                    this.setState({
                        userList: tempList,
                        disableAllSwipe: tempList.length === 1
                    })

                }
                else {
                    // Alert.alert('', JSON.stringify(err))
                }
            })
    }



    apiCalLikeFavouriteDislike(flag, id) {
        likeDislikeFavourite(flag, id, (err, result) => {
            if (!err && result) {

            }
            else {
                // Alert.alert('', JSON.stringify(err))
            }
        })
    }

    renderCard = (card, index) => {
        return (
            <TouchableOpacity style={styles.card}
                onPress={() => {
                    this.props.navigation.navigate('Profile', {
                        userItem: this.state.userList[index]
                    })
                }}
            >
                {(index) === (this.state.userList.length - 1) ?
                    <View style={{ height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ alignContent: 'center', justifyContent: 'center', fontFamily: 'GothamBold', color: Colors.colorPrimary, fontSize: 19 }}>
                            No more Profile
                            </Text>
                    </View> :
                    <View style={{ width: '100%', height: '100%' }}>
                        <Image style={{ height: '100%', width: '100%' }}
                            source={{ uri: this.state.userList[index].user_profile ? baseImageUrl(this.state.userList[index].user_profile) : 'main_user_ph' }} />

                        <View style={{ position: 'absolute', bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', width: '100%' }}>
                            <Text style={{ color: 'white', fontFamily: 'GothamBook', fontSize: 24, marginBottom: 8, marginTop: 8, marginHorizontal: 16 }}>
                                {this.state.userList[index].first_name} </Text>
                            <Text style={{ color: 'white', fontFamily: 'GothamBook', fontSize: 20, marginBottom: 8, marginHorizontal: 16 }}>
                                {"Age:" + this.getAge(this.state.userList[index].birth_date)} </Text>
                        </View>
                    </View>}

            </TouchableOpacity>
        )
    };

    getAge(dateString) {
        var today = new Date();
        var birthDate = new Date(dateString);
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }

    onSwiped = (index, type) => {
        this.setState({
            updatedCardIndex: index + 1
        })
        let id = type != 'general' ? this.state.userList[index].id : 0

        if ((index + 1) === (this.state.userList.length - 1)) {
            // this.setState({ userList: [] })
            this.setState({ disableAllSwipe: true })
        }

        switch (type) {
            case 'left':
                this.apiCalLikeFavouriteDislike('dislike', id)
                break
            case 'right':
                this.apiCalLikeFavouriteDislike('like', id)
                break
            case 'top':
                this.apiCalLikeFavouriteDislike('fav', id)
                break
            case 'bottom':
                this.apiCalLikeFavouriteDislike('block', id)
                break

        }
        console.log(`on swiped ,${type}`)

    }

    onSwipedAllCards = () => {
        this.setState({
            swipedAllCards: true,
        })
    };

    swipeLeft = () => {
        this.swiper.swipeLeft()
    };

    render() {
        return (
            <View style={styles.container}>
                <HEStatusbar />
                <ImageBackground style={{ height: '100%', width: '100%' }} source={{ uri: 'bg' }}>
                    <View style={styles.container}>
                        {this.renderEmptyView()}
                        <View style={styles.container}>
                            {this.state.userList.length > 0 ? this.renderSwipper() : null}
                            <HETitlteBackNavigationDrawer
                                onmenuClick={() => { this.props.navigation.goBack() }} title={""} />
                            {this.renderBottomDashMenu()}
                        </View>

                    </View>
                </ImageBackground>

                <HEActivityIndicator showIndicator={this.state.showIndicator} />
            </View>
        )
    };



    renderEmptyView() {
        return (
            this.state.userList.length <= 0 && !this.state.showIndicator ?
                <View style={{
                    height: '100%',
                    width: '100%',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(255,255,255,0.5)',
                    position: 'absolute'
                }}>
                    <View style={{ height: '60%', width: '60%', alignSelf: 'center' }}>
                        <View style={styles.card}>
                            <TouchableOpacity
                                onPress={() => {
                                    this.apiCallGetuserList()
                                }}
                                style={{ flex: 1.0, backgroundColor: Colors.white, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ alignSelf: 'center', fontFamily: 'GothamBold', color: Colors.colorPrimary, fontSize: 19, textAlign: 'center' }}>
                                    No more Profile
                            </Text>
                            </TouchableOpacity>

                        </View>
                    </View>


                </View> : null
        )
    }


    renderSwipper() {
        return (
            this.state.userList.length > 0 ?
                <Swiper
                    backgroundColor='rgba(255,255,255,0.8)'
                    ref={swiper => {
                        this.swiper = swiper
                    }}
                    onSwiped={(index) => this.onSwiped(index, 'general')}
                    onSwipedLeft={(index) => this.onSwiped(index, 'left')}
                    onSwipedRight={(index) => this.onSwiped(index, 'right')}
                    onSwipedTop={(index) => this.onSwiped(index, 'top')}
                    onSwipedBottom={(index) => this.onSwiped(index, 'bottom')}
                    onTapCard={this.swipeLeft}
                    cards={this.state.userList}
                    cardIndex={0}
                    cardVerticalMargin={80}
                    renderCard={this.renderCard}
                    onSwipedAll={this.onSwipedAllCards}
                    stackSize={3}
                    stackSeparation={15}
                    disableBottomSwipe={this.state.disableAllSwipe}
                    disableLeftSwipe={this.state.disableAllSwipe}
                    disableRightSwipe={this.state.disableAllSwipe}
                    disableTopSwipe={this.state.disableAllSwipe}
                    overlayLabels={{
                        bottom: {
                            title: 'BLEAH',
                            style: {
                                label: {
                                    backgroundColor: 'black',
                                    borderColor: 'black',
                                    color: 'white',
                                    borderWidth: 1
                                },
                                wrapper: {
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }
                            }
                        },
                        left: {
                            title: 'NOPE',
                            style: {
                                label: {
                                    backgroundColor: 'black',
                                    borderColor: 'black',
                                    color: 'white',
                                    borderWidth: 1
                                },
                                wrapper: {
                                    flexDirection: 'column',
                                    alignItems: 'flex-end',
                                    justifyContent: 'flex-start',
                                    marginTop: 30,
                                    marginLeft: -30
                                }
                            }
                        },
                        right: {
                            title: 'LIKE',
                            style: {
                                label: {
                                    backgroundColor: 'black',
                                    borderColor: 'black',
                                    color: 'white',
                                    borderWidth: 1
                                },
                                wrapper: {
                                    flexDirection: 'column',
                                    alignItems: 'flex-start',
                                    justifyContent: 'flex-start',
                                    marginTop: 30,
                                    marginLeft: 30
                                }
                            }
                        },
                        top: {
                            title: 'SUPER LIKE',
                            style: {
                                label: {
                                    backgroundColor: 'black',
                                    borderColor: 'black',
                                    color: 'white',
                                    borderWidth: 1
                                },
                                wrapper: {
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }
                            }
                        }
                    }}
                    animateOverlayLabelsOpacity
                    animateCardOpacity
                    swipeBackCard
                >


                </Swiper> : null
        )
    }

    renderBottomDashMenu() {
        return (
            <View style={styles.bottomMenuContainer}>
                {this.renderButtonsWithIcons(1, 'previous')}
                {this.renderButtonsWithIcons(2, 'cancel')}
                {this.renderButtonsWithIcons(3, 'favourite')}
                {this.renderButtonsWithIcons(4, 'like')}
            </View>
        )
    }

    renderButtonsWithIcons(type, iconName) {
        return (
            <TouchableOpacity style={styles.buttonIconContainer}
                onPress={() => {
                    if (this.swiper === undefined || this.swiper === null) {
                        return
                    }
                    switch (type) {
                        case 1:
                            this.swiper.swipeBack()
                            this.setState({ disableAllSwipe: this.state.userList.length === 1 })
                            break
                        case 2:
                            if (!this.state.disableAllSwipe) {
                                this.swiper.swipeBottom()
                            }
                            break
                        case 3:
                            if (!this.state.disableAllSwipe) {
                                this.swiper.swipeTop()
                            }
                            break
                        case 4:
                            if (!this.state.disableAllSwipe) {
                                this.swiper.swipeRight()
                            }

                            break
                    }
                }}>
                <Image style={styles.iconImge} source={{ uri: iconName }} />
            </TouchableOpacity>
        )
    }

}

