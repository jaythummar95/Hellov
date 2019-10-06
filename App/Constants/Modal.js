import { webRequest, webRequestWithToken, multipartRequest } from './WebRequester'
import { URL } from './constants'
import { getDataFromPreferance } from '../Constants/Preferance'
import DeviceInfo from 'react-native-device-info';



export function signin(email, password, callback) {

    var params = '&email=' + email + '&password=' + password

    let url = URL.signin

    webRequest(url, params, function (err, result) {
        if (err == null && result != null) {
            callback(null, result, false)
        }
        else if (err != null, result != null) {
            callback(err, result, true)
        }
        else {
            console.log('error')
            callback(err, null, false)
        }
    })
}

export function socialCheck(media_id, media_type, email, callback) {

    var params = 'media_type=' + media_type + '&media_id=' + media_id + '&email=' + email
    let url = URL.socialCheck

    webRequest(url, params, function (err, result) {
        if (err == null && result != null) {
            callback(null, result, false)
        }
        else if (err != null, result != null) {
            callback(err, result, true)
        }
        else {
            console.log('error')
            callback(err, null, false)
        }
    })
}


export function forgotpassword(email, callback) {

    var params = 'email=' + email

    let url = URL.forgot_password

    webRequest(url, params, function (err, result) {
        if (err == null && result != null) {
            callback(null, result, false)
        }
        else if (err != null, result != null) {
            callback(err, result, true)
        }
        else {
            console.log('error')
            callback(err, null, false)
        }
    })
}
export function signup(
    first_name,
    last_name,
    email,
    password,
    birth_date,
    gender,
    user_profile,
    callback) {

    let params = new FormData();
    params.append('first_name', first_name);
    params.append('last_name', last_name);
    params.append('email', email)
    params.append('password', password);
    params.append('c_password', password);
    params.append('birth_date', birth_date);
    params.append('gender', gender);

    if (user_profile != null) {
        params.append('user_profile', {
            uri: user_profile,
            type: 'image/jpeg',
            name: 'user_profile.jpg'
        });
    }

    let url = URL.signup

    multipartRequest(url, params, '', function (err, result) {
        if (err == null && result != null) {
            callback(null, result, false)
        }
        else if (err != null, result != null) {
            callback(err, result, true)
        }
        else {
            console.log('error')
            callback(err, null, false)
        }
    })
}

export function signupSocial(
    first_name,
    last_name,
    email,
    media_id,
    media_type,
    birth_date,
    gender,
    user_profile,
    callback) {

    let params = new FormData();
    params.append('first_name', first_name);
    params.append('last_name', last_name);
    params.append('email', email)
    params.append('media_id', media_id);
    params.append('media_type', media_type);
    params.append('birth_date', birth_date);
    params.append('gender', gender);

    if (user_profile != null) {
        params.append('user_profile', {
            uri: user_profile,
            type: 'image/jpeg',
            name: 'user_profile.jpg'
        });
    }

    let url = URL.social_login

    multipartRequest(url, params, '', function (err, result) {
        if (err == null && result != null) {
            callback(null, result, false)
        }
        else if (err != null, result != null) {
            callback(err, result, true)
        }
        else {
            console.log('error')
            callback(err, null, false)
        }
    })
}


export function updateProfile(
    first_name,
    last_name,
    gender,
    birth_date,
    phone,
    description,
    user_profile,
    city,
    country,
    marital_status,
    profession,
    religion,
    size,
    weight,
    callback
) {

    getDataFromPreferance('token', function (value) {

        let url = URL.updaetProfile

        let params = new FormData();
        params.append('first_name', first_name);
        params.append('last_name', last_name);
        params.append('gender', gender);
        params.append('birth_date', birth_date);
        params.append('phone', phone);
        params.append('description', description);
        params.append('city', city);
        params.append('country', country);
        params.append('marital_status', marital_status);
        params.append('profession', profession);
        params.append('religion', religion);
        params.append('size', size);
        params.append('weight', weight);


        if (user_profile != null) {
            params.append('user_profile', {
                uri: user_profile,
                type: 'image/jpeg',
                name: 'user_profile.jpg'
            });
        }

        multipartRequest(url, params, value, function (err, result) {
            if (err == null && result != null) {
                callback(null, result, false)
            }
            else if (err != null, result != null) {
                callback(err, result, true)
            }
            else {
                console.log('error')
                callback(err, null, false)
            }
        })

    })
}

export function updateLocation(
    lat,
    longi,
    callback
) {

    getDataFromPreferance('token', function (value) {

        let url = URL.updaetProfile

        let params = new FormData();
        params.append('lat', lat);
        params.append('longi', longi);

        multipartRequest(url, params, value, function (err, result) {
            if (err == null && result != null) {
                callback(null, result, false)
            }
            else if (err != null, result != null) {
                callback(err, result, true)
            }
            else {
                console.log('error')
                callback(err, null, false)
            }
        })

    })
}


export function userdetail(callback) {


    getDataFromPreferance('token', function (value) {

        let url = URL.user_detail

        webRequestWithToken(url, "", value, function (err, result) {
            if (err == null && result != null) {
                callback(null, result, false)
            }
            else if (err != null, result != null) {
                callback(err, result, true)
            }
            else {
                console.log('error')
                callback(err, null, false)
            }
        })
    })

}

export function logout(callback) {


    getDataFromPreferance('token', function (value) {

        let url = URL.logout

        webRequestWithToken(url, "", value, function (err, result) {
            if (err == null && result != null) {
                callback(null, result, false)
            }
            else if (err != null, result != null) {
                callback(err, result, true)
            }
            else {
                console.log('error')
                callback(err, null, false)
            }
        })
    })

}

export function addToVisit(profile_visit_id, callback) {



    getDataFromPreferance('token', function (value) {

        let params = new FormData();
        params.append('profile_visit_id', profile_visit_id);

        let url = URL.addToVisit

        webRequestWithToken(url, params, value, function (err, result) {
            if (err == null && result != null) {
                callback(null, result, false)
            }
            else if (err != null, result != null) {
                callback(err, result, true)
            }
            else {
                console.log('error')
                callback(err, null, false)
            }
        })
    })

}

export function singleUserDetail(id, callback) {



    getDataFromPreferance('token', function (value) {

        let params = new FormData();
        params.append('id', id);

        let url = URL.singleUserDetail

        webRequestWithToken(url, params, value, function (err, result) {
            if (err == null && result != null) {
                callback(null, result, false)
            }
            else if (err != null, result != null) {
                callback(err, result, true)
            }
            else {
                console.log('error')
                callback(err, null, false)
            }
        })
    })

}

export function userList(callback) {


    getDataFromPreferance('token', function (value) {

        let url = URL.user_list

        webRequestWithToken(url, "", value, function (err, result) {
            if (err == null && result != null) {
                callback(null, result, false)
            }
            else if (err != null, result != null) {
                callback(err, result, true)
            }
            else {
                console.log('error')
                callback(err, null, false)
            }
        })
    })

}

export function likeDislikeFavourite(flag, id, callback) {


    getDataFromPreferance('token', function (value) {

        let url = ""
        let params = new FormData();



        switch (flag) {
            case 'like':
                url = URL.addLike
                params.append('like_user_id', id);
                break
            case 'dislike':
                url = URL.removeLike
                params.append('like_user_id', id);
                break
            case 'fav':
                url = URL.addFavorite
                params.append('favrite_user_id', id);
                break
            case 'unfav':
                url = URL.removeFavorite
                params.append('favrite_user_id', id);
                break
            case 'block':
                url = URL.addBlock
                params.append('block_user_id', id);
                break
            case 'unblock':
                url = URL.removeBlock
                params.append('block_user_id', id);
                break


        }

        webRequestWithToken(url, params, value, function (err, result) {
            if (err == null && result != null) {
                callback(null, result, false)
            }
            else if (err != null, result != null) {
                callback(err, result, true)
            }
            else {
                console.log('error')
                callback(err, null, false)
            }
        })
    })

}

export function userListLikeDislikeFavUnFav(flag, callback) {


    getDataFromPreferance('token', function (value) {

        let url = URL.user_list

        switch (flag) {
            case 'fav':
                url = URL.favList
                break
            case 'like':
                url = URL.likeList
                break
            case 'block':
                url = URL.blockList
                break
            case 'visit':
                url = URL.visitorList
                break
            case 'chat':
                url = URL.chatuserlist
                break
            case 'match':
                url = URL.matchesList
                break

        }


        webRequestWithToken(url, "", value, function (err, result) {
            if (err == null && result != null) {
                callback(null, result, false)
            }
            else if (err != null, result != null) {
                callback(err, result, true)
            }
            else {
                console.log('error')
                callback(err, null, false)
            }
        })
    })

}

export function planRequest(plan_id, callback) {


    getDataFromPreferance('token', function (value) {

        let url = URL.planRequest
        let params = new FormData();
        params.append('plan_id', plan_id);

        webRequestWithToken(url, params, value, function (err, result) {
            if (err == null && result != null) {
                callback(null, result, false)
            }
            else if (err != null, result != null) {
                callback(err, result, true)
            }
            else {
                console.log('error')
                callback(err, null, false)
            }
        })
    })

}

export function messageList(from_user_id, callback) {


    getDataFromPreferance('token', function (value) {

        let url = URL.messageList

        let params = new FormData();
        params.append('from_user_id', from_user_id);


        webRequestWithToken(url, params, value, function (err, result) {
            if (err == null && result != null) {
                callback(null, result, false)
            }
            else if (err != null, result != null) {
                callback(err, result, true)
            }
            else {
                console.log('error')
                callback(err, null, false)
            }
        })
    })

}

export function messageSend(receiver_id, message, callback) {


    getDataFromPreferance('token', function (value) {

        let url = URL.message_send

        let params = new FormData();
        params.append('receiver_id', receiver_id);
        params.append('message', message);


        webRequestWithToken(url, params, value, function (err, result) {
            if (err == null && result != null) {
                callback(null, result, false)
            }
            else if (err != null, result != null) {
                callback(err, result, true)
            }
            else {
                console.log('error')
                callback(err, null, false)
            }
        })
    })

}

export function blogList(callback) {


    getDataFromPreferance('token', function (value) {

        let url = URL.blogList

        webRequestWithToken(url, "", value, function (err, result) {
            if (err == null && result != null) {
                callback(null, result, false)
            }
            else if (err != null, result != null) {
                callback(err, result, true)
            }
            else {
                console.log('error')
                callback(err, null, false)
            }
        })
    })

}

export function blogDetail(blog_id, callback) {


    getDataFromPreferance('token', function (value) {

        let url = URL.blogDetail
        let params = new FormData();
        params.append('blog_id', blog_id);

        webRequestWithToken(url, "", value, function (err, result) {
            if (err == null && result != null) {
                callback(null, result, false)
            }
            else if (err != null, result != null) {
                callback(err, result, true)
            }
            else {
                console.log('error')
                callback(err, null, false)
            }
        })
    })

}


export function addImageToGallery(
    image,
    callback
) {

    getDataFromPreferance('token', function (value) {

        let url = URL.userGallerySave

        let params = new FormData();

        if (image != null) {
            params.append('image', {
                uri: image,
                type: 'image/jpeg',
                name: 'image.jpg'
            });
        }

        multipartRequest(url, params, value, function (err, result) {
            if (err == null && result != null) {
                callback(null, result, false)
            }
            else if (err != null, result != null) {
                callback(err, result, true)
            }
            else {
                console.log('error')
                callback(err, null, false)
            }
        })

    })
}

export function galleryList(callback) {


    getDataFromPreferance('token', function (value) {

        let url = URL.userGallery

        webRequestWithToken(url, "", value, function (err, result) {
            if (err == null && result != null) {
                callback(null, result, false)
            }
            else if (err != null, result != null) {
                callback(err, result, true)
            }
            else {
                console.log('error')
                callback(err, null, false)
            }
        })
    })

}

export function usergalleryList(user_id, callback) {


    getDataFromPreferance('token', function (value) {

        let url = URL.userGalleryImage
        let params = new FormData();
        params.append('user_id', user_id)

        webRequestWithToken(url, params, value, function (err, result) {
            if (err == null && result != null) {
                callback(null, result, false)
            }
            else if (err != null, result != null) {
                callback(err, result, true)
            }
            else {
                console.log('error')
                callback(err, null, false)
            }
        })
    })

}

export function galleryDelete(image_id, callback) {


    getDataFromPreferance('token', function (value) {

        let url = URL.userGalleryDelete

        let params = new FormData();
        params.append('image_id', image_id)

        webRequestWithToken(url, params, value, function (err, result) {
            if (err == null && result != null) {
                callback(null, result, false)
            }
            else if (err != null, result != null) {
                callback(err, result, true)
            }
            else {
                console.log('error')
                callback(err, null, false)
            }
        })
    })

}

export function userListFilter(
    gender,
    start_age,
    end_age,
    lat,
    longi,
    callback) {


    getDataFromPreferance('token', function (value) {

        let url = URL.userListFilter

        let params = new FormData();
        params.append('gender', gender)
        params.append('start_age', start_age)
        params.append('end_age', end_age)
        params.append('lat', lat)
        params.append('longi', longi)

        webRequestWithToken(url, params, value, function (err, result) {
            if (err == null && result != null) {
                callback(null, result, false)
            }
            else if (err != null, result != null) {
                callback(err, result, true)
            }
            else {
                console.log('error')
                callback(err, null, false)
            }
        })
    })

}

export function postTrip(
    origin,
    origin_lat,
    origin_long,
    destination,
    destination_lat,
    destination_long,
    stops,
    leaving_type,
    leaving_datetime,
    return_trip_date,
    vehicle,
    modal,
    type,
    color,
    year,
    licence_plate,
    luggage,
    other,
    seats,
    price_per_seat,
    description,
    vehicleImage,
    id,
    isForUpdate,
    callback) {


    let params = new FormData();
    if (isForUpdate) {
        params.append('id', id);
        alert(id)
    }
    params.append('origin', origin);
    params.append('origin_lat', origin_lat);
    params.append('origin_long', origin_long);
    params.append('destination', destination);
    params.append('destination_lat', destination_lat);
    params.append('destination_long', destination_long);
    params.append('stops', stops);
    params.append('leaving_type', leaving_type);
    params.append('leaving_datetime', leaving_datetime);
    params.append('return_trip_date', return_trip_date);
    params.append('vehicle', vehicle);
    params.append('modal', modal);
    params.append('type', type);
    params.append('color', color);
    params.append('year', year);
    params.append('licence_plate', licence_plate);
    params.append('luggage', luggage);
    params.append('other', other);
    params.append('seats', seats);
    params.append('price_per_seat', price_per_seat);
    params.append('description', description);

    if (vehicleImage != null) {
        params.append('vehicle_image', {
            uri: vehicleImage.uri,
            type: 'image/jpeg',
            name: 'vehicle_image.jpg'
        });
    }

    getDataFromPreferance('token', function (value) {

        let url = isForUpdate ? Constant.URL.driverPostUpdate : Constant.URL.driverPostAdd

        multipartRequest(url, params, value, function (err, result) {
            if (err == null && result != null) {
                callback(null, result, false)
            }
            else if (err != null, result != null) {
                callback(err, result, true)
            }
            else {
                console.log('error')
                callback(err, null, false)
            }
        })
    })


}

export function postTripList(callback) {


    getDataFromPreferance('token', function (value) {

        let url = Constant.URL.driverPostList

        webRequestWithToken(url, "", value, function (err, result) {
            if (err == null && result != null) {
                callback(null, result, false)
            }
            else if (err != null, result != null) {
                callback(err, result, true)
            }
            else {
                console.log('error')
                callback(err, null, false)
            }
        })
    })

}

export function settingList(callback) {


    getDataFromPreferance('token', function (value) {

        let url = Constant.URL.userSettingsList

        webRequestWithToken(url, "", value, function (err, result) {
            if (err == null && result != null) {
                callback(null, result, false)
            }
            else if (err != null, result != null) {
                callback(err, result, true)
            }
            else {
                console.log('error')
                callback(err, null, false)
            }
        })
    })

}

export function updaetSettings(push, token, callback) {

    let url = Constant.URL.userSettingsUpdate

    let params = new FormData();
    params.append('push_notification', push);
    params.append('product_email', "0");
    params.append('sms_message', "0");
    params.append('marketing_emails', "0");
    params.append('auto_request', "0");
    params.append('device_id', DeviceInfo.getDeviceId() + "");



    webRequestWithToken(url, params, token, function (err, result) {
        if (err == null && result != null) {
            callback(null, result, false)
        }
        else if (err != null, result != null) {
            callback(err, result, true)
        }
        else {
            console.log('error')
            callback(err, null, false)
        }
    })

}

export function updateDeviceToken(device_token, token, callback) {

    let url = URL.updaetProfile

    let params = new FormData();
    params.append('device_token', device_token);
    params.append('device_id', DeviceInfo.getDeviceId());

    webRequestWithToken(url, params, token, function (err, result) {
        if (err == null && result != null) {
            callback(null, result, false)
        }
        else if (err != null, result != null) {
            callback(err, result, true)
        }
        else {
            console.log('error')
            callback(err, null, false)
        }
    })

}

export function apiDelete(callback) {


    getDataFromPreferance('token', function (value) {

        let url = URL.userAccountDelete

        webRequestWithToken(url, "", value, function (err, result) {
            if (err == null && result != null) {
                callback(null, result, false)
            }
            else if (err != null, result != null) {
                callback(err, result, true)
            }
            else {
                console.log('error')
                callback(err, null, false)
            }
        })
    })

}



export function postRequest(
    origin,
    origin_lat,
    origin_long,
    destination,
    destination_lat,
    destination_long,
    seats,
    description,
    deaprturePassDate,
    id,
    isForUpdate,
    callback) {


    let params = new FormData();
    if (isForUpdate) {
        params.append('id', id);
    }
    params.append('origin', origin);
    params.append('origin_lat', origin_lat);
    params.append('origin_long', origin_long);
    params.append('destination', destination);
    params.append('destination_lat', destination_lat);
    params.append('destination_long', destination_long);
    params.append('seats', seats);
    params.append('description', description);
    params.append('departure_datetime', deaprturePassDate);


    console.log(JSON.stringify(params))

    getDataFromPreferance('token', function (value) {

        let url = isForUpdate ? Constant.URL.userBookUpdate : Constant.URL.userPostBook

        multipartRequest(url, params, value, function (err, result) {
            if (err == null && result != null) {
                callback(null, result, false)
            }
            else if (err != null, result != null) {
                callback(err, result, true)
            }
            else {
                console.log('error')
                callback(err, null, false)
            }
        })
    })


}


export function postRequestList(callback) {


    getDataFromPreferance('token', function (value) {

        let url = Constant.URL.userPostBookList

        webRequestWithToken(url, "", value, function (err, result) {
            if (err == null && result != null) {
                callback(null, result, false)
            }
            else if (err != null, result != null) {
                callback(err, result, true)
            }
            else {
                console.log('error')
                callback(err, null, false)
            }
        })
    })

}

export function postRequestListSearh(
    origin_lat,
    origin_long,
    destination_lat,
    destination_long,
    callback) {

    let params = new FormData();

    params.append('origin_lat', origin_lat)
    params.append('origin_long', origin_long)
    params.append('destination_lat', destination_lat)
    params.append('destination_long', destination_long)

    getDataFromPreferance('token', function (value) {

        let url = Constant.URL.userRequestListSearch

        webRequestWithToken(url, params, value, function (err, result) {
            if (err == null && result != null) {
                callback(null, result, false)
            }
            else if (err != null, result != null) {
                callback(err, result, true)
            }
            else {
                console.log('error')
                callback(err, null, false)
            }
        })
    })

}

export function driverPostLisSearch(
    origin_lat,
    origin_long,
    destination_lat,
    destination_long,
    callback) {

    let params = new FormData();

    params.append('origin_lat', origin_lat)
    params.append('origin_long', origin_long)
    params.append('destination_lat', destination_lat)
    params.append('destination_long', destination_long)


    getDataFromPreferance('token', function (value) {

        let url = Constant.URL.drivePostListSearch

        webRequestWithToken(url, params, value, function (err, result) {
            if (err == null && result != null) {
                callback(null, result, false)
            }
            else if (err != null, result != null) {
                callback(err, result, true)
            }
            else {
                console.log('error')
                callback(err, null, false)
            }
        })
    })

}


export function driverPostDelete(
    id,
    callback) {

    let params = new FormData();
    params.append('id', id);

    getDataFromPreferance('token', function (value) {

        let url = Constant.URL.driverPostDelete
        webRequestWithToken(url, params, value, function (err, result) {
            if (err == null && result != null) {
                callback(null, result, false)
            }
            else if (err != null, result != null) {
                callback(err, result, true)
            }
            else {
                console.log('error')
                callback(err, null, false)
            }
        })
    })
}

export function userBookDelete(
    id,
    callback) {


    let params = new FormData();
    params.append('id', id);


    getDataFromPreferance('token', function (value) {

        let url = Constant.URL.userBookDelete

        webRequestWithToken(url, params, value, function (err, result) {
            if (err == null && result != null) {
                callback(null, result, false)
            }
            else if (err != null, result != null) {
                callback(err, result, true)
            }
            else {
                console.log('error')
                callback(err, null, false)
            }
        })
    })
}


export function placeComplete(text, callback) {
    let url = "https://maps.googleapis.com/maps/api/place/autocomplete/json?input=" + text + "&key=" + "AIzaSyAeFfkP1KK7L3KG40bnTyXy6DOQC6pXr8g"
    console.log('===================')
    console.log("URL:- ", url)
    console.log('===================')
    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    })
        .then((res) => res.json())
        .then((json) => {
            console.log("RESPONSE:- ", json)
            if (json.status == 'OK') {
                callback(null, json.predictions)
            }
            else {
                callback(json.error_message, null)
            }
        })
        .catch((err) => {
            console.log("ERROR WEB:- ", err)
            callback(err, null)
        })
}

export function myBookingsList(callback) {


    getDataFromPreferance('token', function (value) {

        let url = Constant.URL.myBookigs

        webRequestWithToken(url, "", value, function (err, result) {
            if (err == null && result != null) {
                callback(null, result, false)
            }
            else if (err != null, result != null) {
                callback(err, result, true)
            }
            else {
                console.log('error')
                callback(err, null, false)
            }
        })
    })


}


export function userBookingPayment(
    driver_post_id,
    price,
    paypal_response,
    booking_seat,
    callback) {

    let params = new FormData();

    params.append('driver_post_id', driver_post_id)
    params.append('payment_status', "success")
    params.append('price', price)
    params.append('paypal_response', paypal_response)
    params.append('booking_seat', booking_seat)

    getDataFromPreferance('token', function (value) {

        let url = Constant.URL.userBookingPayment

        webRequestWithToken(url, params, value, function (err, result) {
            if (err == null && result != null) {
                callback(null, result, false)
            }
            else if (err != null, result != null) {
                callback(err, result, true)
            }
            else {
                console.log('error')
                callback(err, null, false)
            }
        })
    })

}