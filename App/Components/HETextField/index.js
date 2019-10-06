import React, { Component } from 'react';
import { View, TextInput, Image } from 'react-native';
import styles from './styles'

export default class PPTTextFiled extends Component {

    constructor(props) {
        super(props)
        this.state = {
            leftImage: this.props.leftImage,
            rightImage: this.props.rightImage,
            keyboardType: this.props.keyboardType,
            secure: this.props.secure,
            placeholder: this.props.placeholder,
            multiline: this.props.multiline,
            editable: this.props.editable,
        }
    }

    render() {
        return (
            <View style={styles.container}>
                {this.renderLeft()}
                {this.renderInput()}
                {this.renderRight()}
            </View>
        )
    }

    renderLeft() {
        if (this.state.leftImage) {
            return (
                <View style={styles.leftView}>
                    <Image style={styles.leftImage} source={{ uri: this.state.leftImage }} />
                </View>
            )
        }
        else {
            return (
                <View style={styles.leftEmptyView} />
            )
        }
    }

    renderInput() {
        return (
            <TextInput
                autoCapitalize='none'
                style={styles.textInput}
                value={this.props.value}
                keyboardType={this.state.keyboardType}
                secureTextEntry={this.state.secure}
                placeholder={this.state.placeholder}
                placeholderTextColor='black'
                multiline={this.state.multiline ? this.state.multiline : false}
                onChangeText={(text) => {
                    this.props.onChangeText(text)
                }}
                editable={this.props.myeditable != null || this.props.myeditable != undefined ? this.props.myeditable : true}
                onKeyPress={(event) => { this.props.onKeyPress ? this.props.onKeyPress(event) : {} }}
            />
        )
    }

    renderRight() {
        if (this.state.rightImage) {
            return (
                <View style={styles.rightView}>
                    <Image style={styles.rightImage} />
                </View>
            )
        }
        else {
            return (
                <View style={styles.rightEmptyView} />
            )
        }
    }
}