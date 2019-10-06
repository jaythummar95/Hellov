import { StyleSheet, Platform, Dimensions } from 'react-native'
import { Colors } from '../../Constants/constants'

const styles = StyleSheet.create({
    container: {
        flex: 1.0,
        alignItems: 'center',
        width:'100%',
        backgroundColor: 'transparent'
    }
    , bottomMenuContainer: {
        elevation: 4,
        position: 'absolute',
        flexDirection: 'row',
        bottom:16
    },
    buttonIconContainer: {
        backgroundColor: 'white',
        height: 56,
        width: 56,
        borderRadius: 28,
        elevation: 8,
        margin: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconImge: {
        height: 25,
        width: 25
    },
    card: {
        flex: 0.85,
        borderRadius: 10,
        backgroundColor:Colors.white,
        elevation:4,
        overflow: 'hidden',
    },
    text: {
        textAlign: 'center',
        fontSize: 50,
        backgroundColor: 'transparent'
    },
    done: {
        textAlign: 'center',
        fontSize: 30,
        color: 'white',
        backgroundColor: 'transparent'
    },
    bottomButtions: {
        flex: 0.25,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 2,
        backgroundColor: Colors.colorPrimary,
        elevation: 4
    },
    textButtonBottom: {
        color: 'white',
        fontSize: 15,
        fontFamily: 'GothamBook',
        textAlign: 'center',
    },
    buttonLogin: {
        width: '95%',
        height: 48,
        elevation: 3,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 12,
        backgroundColor: Colors.colorPrimary,
    },
    textsocialSignInStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        color: Colors.white,
        fontFamily: 'GothamBold',
        fontSize: 16,
        textAlign: 'center'
    },
})

export default styles