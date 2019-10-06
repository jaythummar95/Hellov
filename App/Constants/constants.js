import React from 'react';

export var base_domain = "http://hellov.prometteursolutions.com"

export var base_url = 'http://hellov.prometteursolutions.com/api/'

export function baseImageUrl(imageName) {
    return "http://hellov.prometteursolutions.com/public/uploads/profile/" + imageName
}

export function baseImageUrlBlog(imageName) {
    return "http://hellov.prometteursolutions.com/public/uploads/blog/" + imageName
}

export function baseImageUrlGallery(imageName) {
    return "http://hellov.prometteursolutions.com/public/uploads/gallery/" + imageName
}



export var URL = {
    //User Module
    signup: base_url + "register2",
    signin: base_url + "login",
    updaetProfile: base_url + "update/user/profile",
    user_detail: base_url + "user-detail",


    forgot_password: base_url + "forgotpasswor",
    change_password: base_url + "change_password",
    update_device_token: base_url + "update_device_token",
    logout: base_url + "user/logout",
    user_profile: base_url + "user_profile",
    update_profile: base_url + "update_profile",
    terms_condition: base_url + "/page/terms_condition",
    resend_verification_mail: base_url + "resend_verification_mail",
    check_social_id: base_url + "check_social_id",
    social_login: base_url + "social_login",
    verify_otp: base_url + "verify_otp",
    driverPostAdd: base_url + "driver/post/add",
    driverPostList: base_url + "driver/post/list",
    userSettingsUpdate: base_url + "user/setting/update",
    userSettingsList: base_url + "user/setting/list",
    userPostBook: base_url + "user/post/book",
    userPostBookList: base_url + "user/book/list",
    driverPostUpdate: base_url + 'driver/post/update',
    driverPostDelete: base_url + 'driver/post/delete',
    userBookUpdate: base_url + 'user/book/update',
    userBookDelete: base_url + 'user/book/delete',
    drivePostListSearch: base_url + 'driver/post/list/search',
    userRequestListSearch: base_url + 'user/request_book/list/search',
    myBookigs: base_url + 'user/booking/current_user/list',
    userBookingPayment: base_url + 'user/booking/payment',
    user_list: base_url + "user/list",


    //Category
    user_category: base_url + "user_category",
    user_category_new: base_url + "user_category_new",

    add_user_category: base_url + 'add_user_category',
    add_contact_to_category: base_url + 'add_contact_to_category',

    //Contacts
    add_contacts: base_url + 'add_contacts',
    contact_list: base_url + 'contact_list',
    add_contact_to_category: base_url + 'add_contact_to_category',
    add_user_category: base_url + 'add_user_category',

    //add
    addFavorite: base_url + "user/favourite/add",
    removeFavorite: base_url + "user/favourite/remove",

    addLike: base_url + "user/like/add",
    removeLike: base_url + "user/like/remove",

    addBlock: base_url + "user/block/add",
    removeBlock: base_url + "user/block/remove",

    likeList: base_url + "user/like/list",
    blockList: base_url + "user/block/list",
    favList: base_url + "user/favourite/list",

    planRequest: base_url + "user/plan/request",
    addToVisit: base_url + 'user/visitor/add',
    visitorList: base_url + 'user/visitor/list',
    blogList: base_url + 'blog/list',
    blogDetail: base_url + 'blog/detail',
    chatuserlist: base_url + 'chat/user/list',
    messageList: base_url + 'message/list',
    message_send: base_url + 'message/send',
    socialCheck: base_url + 'social/login/check',
    matchesList: base_url + 'matches/list',
    userGallerySave: base_url + 'user/gallery/save',
    userGallery: base_url + 'user/gallery',
    userGalleryDelete: base_url + 'user/gallery/delete',
    singleUserDetail: base_url + 'single/user/detail',
    userGalleryImage: base_url + 'user/gallery/image',
    userListFilter: base_url + 'user/list/filter',
    userAccountDelete: base_url + 'user/account/delete'
}


/**
 *  Collection of collors
 */
export var Colors = {
    colorPrimary: '#DA195C',
    colorPrimaryDark: '#a20033',
    colorAccent: '#0083BC',
    bgColor: '#F3F3F3',
    white: '#ffffff',
    loginDashbgColor: '#F64934',
    loginBox: '#343436',
    loginButton: '#F8CA18',
}

/**
 * Collection of string 
 */
export var Strings = {
    email: 'Email',
    username: 'Username',
    password: 'Password',
    login: 'Login'
}



