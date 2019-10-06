import { StyleSheet, Platform, Dimensions } from 'react-native'
import { Colors } from '../../Constants/constants'

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 56,
        backgroundColor: Colors.colorPrimary,
        alignItems: 'center',
        flexDirection: 'row',
        elevation: 4
    },
    imageContainer: {
        height: 56,
        width: 56,
        justifyContent: 'center',
        alignItems: 'center',
        elevation:8,
    },
    image1: {
        height: 25,
        width: 25,
        tintColor:'white'
    },
    image2: {
        marginRight:-20,
        height: 22,
        width: 22,
        tintColor:'white'
    },
    titleContainer: { flex: 1.0, justifyContent: 'center' },
    titleText: {
        color: 'white',
        fontFamily: 'Gotham-Black',
        fontSize: 18,
    },
   
})

export default styles