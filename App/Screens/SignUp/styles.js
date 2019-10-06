import { StyleSheet, Platform, Dimensions } from 'react-native'
import { Colors } from '../../Constants/constants'

const styles = StyleSheet.create({
    container: {
        flex: 1.0,
        alignItems: 'center',
        backgroundColor: Colors.colorAccent
    },
    logoContainer: {
        flex: 0.5,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: -25,
    },
    logoBg: {
        backgroundColor: 'white',
        height: 150,
        width: 150,
        borderRadius: 75,
        elevation: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: Colors.colorAccent,
        borderWidth: 5,
        marginBottom: 48
    },
    logo: {
        marginTop: -20,
        height: 100,
        width: 100,
        position: 'absolute',
    },
    signInOptionsNg: {
        flex: 0.4,
        alignItems: 'center'
    },
    buttonSignInWithSocial: {
        width: '90%',
        height: 48,
        elevation: 3,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
        backgroundColor: Colors.white,
    },
    buttonGenderSelected: {
        elevation: 3,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
        backgroundColor: Colors.white,
    },
    txtGenderUnSlected: {
        paddingVertical: 8,
        color: 'black',
        fontSize: 16,
        fontFamily: 'GothamMedium',
    },
    txtGenderSlected: {
        paddingVertical: 8,
        color: Colors.colorPrimary,
        fontSize: 16,
        fontFamily: 'GothamBold',
    },
    txtBirthDate: {
        width: '90%',
        paddingVertical: 8,
        color: 'black',
        fontSize: 16,
        textAlign: 'left',
        fontFamily: 'GothamMedium',
    },
    textsocialSignInStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        color: Colors.white,
        fontFamily: 'GothamBold',
        fontSize: 16,
        textAlign: 'center'
    },
    bgContainer: {
        flex: 1.0,
        position: 'absolute',
        height: '100%',
        width: '100%'
    },
    bgTop: {
        flex: 0.15,
        backgroundColor: Colors.colorAccent
    },
    bgBottom: {
        flex: 0.85,
        backgroundColor: Colors.colorPrimary,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        elevation: 2,
        marginHorizontal: 8
    },
    bottomViewContainer: {
        flex: 1.0,
        width: '100%',
        alignItems: 'center'
    },
    bottomImageContainer: {
        flex: 0.15,
        alignItems: 'center'
    },
    bottomBottomConainer: {
        justifyContent: 'center',
        width: '100%',
        alignItems: 'center'
    },
    buttonLogin: {
        width: '90%',
        height: 48,
        elevation: 3,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
        backgroundColor: Colors.colorPrimary,
    },
    textForgotPassword: {
        color: Colors.white,
        fontFamily: 'GothamBold',
        fontSize: 16,
    },
    forgotPasswordBUtton: {
        padding: 10,
        marginTop: 5,
        justifyContent: 'center',
        alignSelf: 'flex-end',
        marginEnd: 8,
        elevation: 6
    }
})

export default styles