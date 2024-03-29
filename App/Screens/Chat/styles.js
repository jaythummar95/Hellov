import { StyleSheet, Platform, Dimensions } from 'react-native'
import { Colors } from '../../Constants/constants'

const styles = StyleSheet.create({
    container: {
        flex: 1.0,
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.95)'
    }
    , bottomMenuContainer: {
        elevation: 4,
        position: 'absolute',
        flexDirection: 'row',
        bottom: 16
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
        backgroundColor: Colors.white,
        elevation: 4,
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
    }
})

export default styles