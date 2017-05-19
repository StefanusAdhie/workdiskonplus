import React, { Component } from 'react';

import {
	Modal,
	View,
	ScrollView,
	TouchableOpacity,
	Text,
	TextInput,
	StyleSheet,
} from 'react-native';

/* pages */
import Facebook from './facebook';
import Google from './google';
import ForgotPassword from './forgotPassword';
import Register from './register';


class popupLogin extends Component {
  constructor(props) {
  	super(props);
  	this.state = {
  		modalVisible: false,
  	};
  }

  componentWillMount() {
  	if(!this.props.state.token) {
  		this.setState({modalVisible: true});
  	};
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
  	this.setState({modalVisible: false});
  }
	
	render() {
		const { navigator, state, socket } = this.props;
		return (
			<Modal
				animationType={"fade"}
				transparent={true}
				visible={this.state.modalVisible}
				onRequestClose={(a) => console.log()}>
				<View style={{flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', backgroundColor: 'rgba(0, 0, 0, .5)'}}>
					<View style={{width: 300, height: 450, flexDirection: 'column', padding: 10, backgroundColor: 'white', borderRadius: 25}}>
					<ScrollView keyboardShouldPersistTaps={true}>
						<View style={{flex: 1}}>
							<Text style={{textAlign: 'center'}}>LOGIN</Text>
						</View>
						<View style={{flexDirection: 'column'}}>
							<TextInput
								ref='email'
								placeholder='Email'
								returnKeyType={'next'}
								keyboardType="email-address"
								onChangeText={(text) => state.email = text}
								onSubmitEditing={() => this.refs['password'].focus()} />
							<TextInput
								ref='password'
								placeholder='Password'
								returnKeyType='done'
								onChangeText={(text) => state.password = text}
								secureTextEntry={true}
								onSubmitEditing={() => this.login()} />
						</View>
						<View style={{alignItems: 'flex-end'}}>
							<TouchableOpacity
								onPress={() => {
									this.setState({modalVisible: false});
									navigator.push({
										component: ForgotPassword,
										title: 'Forgot Password'
									});
								}} >
								<Text style={{textAlign: 'right', padding: 10}}>Forgot Password?</Text>
							</TouchableOpacity>
						</View>
						<View style={{alignItems: 'center', padding: 10}}>
							<TouchableOpacity
								style={{width: 150, height: 50, borderRadius: 10, backgroundColor: 'rgba(0, 0, 0, .5)', justifyContent: 'center', alignItems: 'center'}}
								onPress={() => this.login()}>
								<Text style={{color: 'black'}}>Login</Text>
							</TouchableOpacity>
						</View>
						<Text style={{textAlign: 'center', padding: 10}}>or connect using</Text>
						<View style={{flexDirection: 'row', padding: 10, alignItems: 'center'}}>
							<Facebook
								state={state}
								socket={socket}
								close={() => this.setState({modalVisible: false})} />
							<Text> or </Text>
							<Google
								state={state}
								socket={socket}
								close={() => this.setState({modalVisible: false})} />
						</View>
						<TouchableOpacity
							style={{borderTopWidth: 1, padding: 10}}
							onPress={() => {
								this.setState({modalVisible: false});
								navigator.push({
									component: Register,
									title: 'Register'
								});
							}}>
							<Text style={{textAlign: 'center'}}>Dont have account? Register Now</Text>
						</TouchableOpacity>
						<View style={{alignItems: 'flex-end'}}>
							<TouchableOpacity
								onPress={() => this.setState({modalVisible: false})}>
								<Text style={{textAlign: 'right'}}>Skip>></Text>
							</TouchableOpacity>
						</View>
					</ScrollView>
					</View>
				</View>
			</Modal>
		)
	}
}

var Styles = StyleSheet.create({
})

module.exports = popupLogin;