import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

/* pages */
import Home from './home';

/* react native icon */
import Icon from 'react-native-vector-icons/Ionicons';
import FBSDK, {
  AccessToken,
	LoginManager,
} from 'react-native-fbsdk';


class facebook extends Component {
	constructor(props) {
		super(props);
	}

	_facebookSignIn() {
		const { state, socket, close } = this.props;
		close();
		// Attempt a login using the Facebook login dialog asking for default permissions.
		LoginManager.logInWithPublishPermissions(['publish_pages']).then(
			function(result) {
				if (result.isCancelled) {
					AccessToken.getCurrentAccessToken().then((data) => {
						var header = {
							header: {
								access: state.token
							}, 
							data: {
								customers: {
									value: {
										auth: {
											type: 2, 
											token: data.accessToken
										}
									}
								}
							}
						}
						socket.emit('registered_account', header);
					})
				} else {
					AccessToken.getCurrentAccessToken().then((data) => {
						var header = {
							header: {
								access: state.token
							}, 
							data: {
								customers: {
									value: {
										auth: {
											type: 2, 
											token: data.accessToken
										}
									}
								}
							}
						}
						socket.emit('registered_account', header);
					})
				}
			},
			function(error) {
				AccessToken.getCurrentAccessToken().then((data) => {
				})
			}
		);
	}

	render() {
		return (
			<TouchableOpacity
				style={{flexDirection: 'row', flex: 1, width: 100, height: 50, borderRadius: 10, backgroundColor: '#3b5998', justifyContent: 'center', alignItems: 'center'}}
				onPress={() => this._facebookSignIn()}>
				<Icon name="logo-facebook" size={30} color="white" style={{margin: 5}}/>
				<Text style={{color: 'white'}}>Facebook</Text>
			</TouchableOpacity>
		);
	}
};

const styles = StyleSheet.create({

});

module.exports = facebook;