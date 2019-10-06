import { StyleSheet, Platform, Dimensions } from 'react-native'

const styles = StyleSheet.create({
    container: {
        flex: 1.0,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,1.0)',
        flexDirection: 'row'
    },
    leftView: {
        height: '100%',
        width: 40,
        justifyContent: 'center'
    },
    leftEmptyView: {
        height: '100%',
        width: 8,
    },
    leftImage: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
        alignSelf: 'center'
    },
    textInput: {
        paddingVertical: 8,
        flex: 1.0,
        height: '100%',
        width: 48,
        textAlign: 'left',
        color: 'black',
        fontSize: 16,
        fontFamily: 'GothamMedium',
    },
    rightView: {
        height: '100%',
        width: 30,
        justifyContent: 'center'
    },
    rightImage: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
        alignSelf: 'center'
    },
    rightEmptyView: {
        height: '100%',
        width: 8,
    },

})

export default styles