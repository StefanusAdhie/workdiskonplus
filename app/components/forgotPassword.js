import React, { Component } from 'react';

import {
	ScrollView,
	View,
	Text,
	TextInput,
	TouchableOpacity,
	Alert,
	StyleSheet,
} from 'react-native';

/* pages */
import Home from './home';


class forgotPassword extends Component {
  constructor(props) {
  	super(props);
		this.state = {
			emailBorder: 'red',
			passwordBorder: 'red',
			confirmPasswordBorder: 'red',

			editable: true,
			switchCode: false,
			switchPassword: false,
		}
  }

  componentWillUnmount() {
    this.props.socket.removeListener('forgot_password');
    this.props.socket.removeListener('code_reset');
    this.props.socket.removeListener('reset_password');
  }

  componentDidMount() {
  	this.props.socket.on('forgot_password', (data) => {
			switch(data.header.status) {
				case 200:
					this.setAlert(data.header.message);
					break;
				default :
					this.setAlert(data.header.message);
					break;
			}
		});

		this.props.socket.on('code_reset', (data) => {
			switch(data.header.status) {
				case 200:
					this.setAlert(data.header.message);
					break;
				default :
					this.setAlert(data.header.message);
					break;
			}
		});

		this.props.socket.on('reset_password', (data) => {
			switch(data.header.status) {
				case 200:
					this.setAlert(data.header.message);
					this.props.navigator.push({
						component: Home,
						title: 'DiskonPlus',
					});
					break;
				default :
					this.setAlert(data.header.message);
					break;
			}
		});
  }

  setAlert(text) {
		Alert.alert(
			null,
			text,
			[
				{text: 'OK'},
			]
		);
	}

	// check input email type
	validEmail(text) {
		var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		this.email(re.test(text), text);
	}

	email(value, text) {
		if(value) {
			this.setState({emailBorder: 'white', email: text});
		} else {
			this.setState({emailBorder: 'red', email: text});
		}
	}

	// check min and max input
	password(text) {
		this.setState({password: text})
		if(text.length <= 7 || text.length >= 20) {
			this.setState({passwordBorder: 'red'})
		} else {
			this.setState({passwordBorder: 'white'})
		};
	}

	confirmPassword(text) {
		this.setState({confirmPassword: text})
		if(this.state.password == text) {
			this.setState({confirmPasswordBorder: 'white'})
		} else {
			this.setState({confirmPasswordBorder: 'red'})
		};
	}

	submit(title) {
		if(this.state.emailBorder == 'white') {
			var header = {
				header: {
					access: this.props.state.token
				},
				auth: {
					email: this.state.email
				}
			};
			this.props.socket.emit('forgot_password', header);

			this.setState({editable: false, switchCode: true})
		}
	}

	submitCode(title) {
		var header = {
			header: {
				access: this.props.state.token
			},
			auth: {
				code: this.state.code
			}
		};
		this.props.socket.emit('code_reset', header);

		this.setState({switchCode: false, switchPassword: true})
	}

	submitPassword(title) {
		if(this.state.passwordBorder == 'white' && this.state.confirmPasswordBorder == 'white') {
			var header = {
				header: {
					access: this.props.state.token
				},
				auth: {
					password: {
						new_password: this.state.password,
						retype_password: this.state.confirmPassword,
					},
					email: this.state.email
				}
			};
			this.props.socket.emit('reset_password', header);
		}
	}
	
	render() {
		const { state } = this.props;
		return (
			<View style={{marginTop: 55}}>
				<ScrollView style={{padding: 10}} keyboardShouldPersistTaps={true}>

					<View style={Styles.containerInput}>
						<View style={{flex: 1}}>
							<Text style={Styles.text}>Email</Text>
						</View>

						<Text style={Styles.text}> : </Text>
						<TextInput
							ref='email'
							underlineColorAndroid={this.state.emailBorder}
							style={Styles.textInput}
							editable={this.state.editable}
							placeholderTextColor='white'
							keyboardType="email-address"
							onChangeText={(text) => this.validEmail(text)}
							returnKeyType='done'
							onSubmitEditing={() => this.submit('forgot_password')} />
					</View>

					{this.state.switchCode ? 
						<View style={Styles.containerInput}>
							<View style={{flex: 1}}>
								<Text style={Styles.text}>Code</Text>
							</View>

							<Text style={Styles.text}> : </Text>
							<TextInput
								ref='code'
								underlineColorAndroid={this.state.emailBorder}
								style={Styles.textInput}
								placeholderTextColor='white'
								onChangeText={(text) => this.setState({code: text})}
								returnKeyType='done'
								onSubmitEditing={() => this.submitCode('code_reset')} />
						</View>
						: null
					}

					{this.state.switchPassword ? 
						<View>
							<View style={Styles.containerInput}>
								<View style={{flex: 1}}>
									<Text style={Styles.text}>Password</Text>
								</View>

								<Text style={Styles.text}>* : </Text>
								<TextInput
									ref='password'
									underlineColorAndroid={this.state.passwordBorder}
									style={Styles.textInput}
									placeholderTextColor='white'
									secureTextEntry={true}
									onChangeText={(text) => this.password(text)}
									returnKeyType='next'
									onSubmitEditing={() => this.refs['confirmPassword'].focus()} />
							</View>

							<View style={Styles.containerInput}>
								<View style={{flex: 1}}>
									<Text style={Styles.text}>Confirm Password</Text>
								</View>

								<Text style={Styles.text}>* : </Text>
								<TextInput
									ref='confirmPassword'
									underlineColorAndroid={this.state.confirmPasswordBorder}
									style={Styles.textInput}
									placeholderTextColor='white'
									secureTextEntry={true}
									onChangeText={(text) => this.confirmPassword(text)}
									returnKeyType='done'
									onSubmitEditing={() => this.submitPassword('reset_password')} />
							</View>
						</View>
						: null
					}

					<View style={{justifyContent: 'center', alignItems: 'center', padding: 10}}>

						{this.state.switchPassword ? 
							<TouchableOpacity
								style={{width: 150, height: 50, borderRadius: 10, backgroundColor: '#a540e4', justifyContent: 'center', alignItems: 'center'}}
								onPress={() => this.submitPassword('reset_password')}>
								<Text style={Styles.text}>Submit</Text>
							</TouchableOpacity> :

							this.state.switchCode ? 
							<TouchableOpacity
								style={{width: 150, height: 50, borderRadius: 10, backgroundColor: '#a540e4', justifyContent: 'center', alignItems: 'center'}}
								onPress={() => this.submitCode('code_reset')}>
								<Text style={Styles.text}>Submit</Text>
							</TouchableOpacity> : 

							(this.state.emailBorder == 'white') ?
							<TouchableOpacity
								style={{width: 150, height: 50, borderRadius: 10, backgroundColor: '#a540e4', justifyContent: 'center', alignItems: 'center'}}
								onPress={() => this.submit('forgot_password')}>
								<Text style={Styles.text}>Submit</Text>
							</TouchableOpacity> :

							<View
								style={{width: 150, height: 50, borderRadius: 10, backgroundColor: 'rgba(255, 255, 255, .5)', justifyContent: 'center', alignItems: 'center'}}>
								<Text style={Styles.text}>Submit</Text>
							</View>
						}
					</View>
				</ScrollView>
			</View>
		)
	}
}

var Styles = StyleSheet.create({
	containerInput: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	textInput: {
		flex: 3,
		color: 'white',
	},
	text: {
		color: 'white',
	},
})

module.exports = forgotPassword;