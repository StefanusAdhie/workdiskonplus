import React, { Component } from 'react';

import {
	ScrollView,
	View,
	Text,
	TextInput,
	TouchableOpacity,
	Image,
	StyleSheet,
} from 'react-native';

/* pages */
import Home from './home';
import Facebook from './facebook';
import Google from './google';
import ForgotPassword from './forgotPassword';
import Register from './register';


class login extends Component {
  constructor(props) {
  	super(props);
  }

  login() {
  	var header = {
  		header: {
  			access: this.props.state.token
  		},
  		auth: {
  			email: this.props.state.email,
  			password: this.props.state.password
  		}
  	};
  	this.props.socket.emit('post_sign', header);
  	this.props.navigator.pop();
  }
	
	render() {
		const { navigator, state, socket } = this.props;
		return (
			<ScrollView keyboardShouldPersistTaps={true}>
				<View style={{justifyContent: 'center', alignItems: 'center'}}>
					<Image
						style={{width: 200, height: 200}}
						source={require('../img/diskon_plus.png')} />
				</View>
				<View style={{flexDirection: 'column'}}>
					<TextInput
						ref='email'
						placeholder='Email'
						style={Styles.text}
						placeholderTextColor='white'
						underlineColorAndroid='white'
						returnKeyType={'next'}
						keyboardType="email-address"
						onChangeText={(text) => state.email = text}
						onSubmitEditing={() => this.refs['password'].focus()} />
					<TextInput
						ref='password'
						placeholder='Password'
						style={Styles.text}
						placeholderTextColor='white'
						underlineColorAndroid='white'
						returnKeyType='done'
						onChangeText={(text) => state.password = text}
						secureTextEntry={true}
						onSubmitEditing={() => this.login()} />
				</View>
				<View style={{alignItems: 'flex-end'}}>
					<TouchableOpacity onPress={() => {
							navigator.push({
								component: ForgotPassword,
								title: 'Forgot Password'
							})
						}}>
						<Text style={{padding: 10, color: 'white'}}>Forgot Password?</Text>
					</TouchableOpacity>
				</View>
				<View style={{alignItems: 'center', padding: 10}}>
					<TouchableOpacity
						style={{width: 150, height: 50, borderRadius: 10, backgroundColor: 'rgba(255, 255, 255, .5)', justifyContent: 'center', alignItems: 'center'}}
						onPress={() => this.login()}>
						<Text style={{color: 'black'}}>Login</Text>
					</TouchableOpacity>
				</View>
				<Text style={{textAlign: 'center', padding: 10, color: 'white'}}>or connect using</Text>
				<View style={{flexDirection: 'row', padding: 10, alignItems: 'center'}}>
					<Facebook
						state={state}
						socket={socket}
						close={() => {
							navigator.pop()
						}} />
					<Text style={{color: 'white'}}> or </Text>
					<Google
					state={state}
					socket={socket}
					close={() => {
						navigator.pop()
					}} />
				</View>
				<TouchableOpacity
					style={{borderTopWidth: 1, borderColor: 'white', padding: 10}}
					onPress={() => {
						navigator.push({
							component: Register,
							title: 'Register'
						})
					}}>
					<Text style={{textAlign: 'center', color: 'white'}}>Dont have account? Register Now</Text>
				</TouchableOpacity>
			</ScrollView>
		)
	}
}

var Styles = StyleSheet.create({
	text: {
		color: 'white',
	},
})

module.exports = login;