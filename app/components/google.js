import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

/* react native icon */
import Icon from 'react-native-vector-icons/Ionicons';
import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin';


class google extends Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		this._setupGoogleSignin();
	}

	async _setupGoogleSignin() {
    try {
      await GoogleSignin.hasPlayServices({ autoResolve: true });
      await GoogleSignin.configure({
        scopes: ['https://www.googleapis.com/auth/plus.login'],
				webClientId: '544758072095-1eiv9s96abf114jvv3pf3sfk44pvpmcg.apps.googleusercontent.com',
        offlineAccess: true,
      });

      const googleUser = await GoogleSignin.currentUserAsync();
			this.setState({googleUser})
    }
    catch(err) {
    }
  }

	_googleSignIn(a) {
		const { state, socket, close } = this.props;
		close();

		GoogleSignin.signIn()
    .then((user) => {
    	console.log(user);
    	console.log(user.accessToken);
			var header = {
				header: {
					access: state.token
				}, 
				data: {
					customers: {
						value: {
							auth: {
								type: 3, 
								token: user.accessToken
							}
						}
					}
				}
			}
			socket.emit('registered_account', header);
    })
    .catch((err) => {
    })
    .done();
	}

	_googleSignOut() {
    GoogleSignin.revokeAccess().then(() => GoogleSignin.signOut()).then(() => {
      this.setState({googleUser: null});
    })
    .done();
  }

	render() {
		return (
			<TouchableOpacity
				style={{flexDirection: 'row', flex: 1, width: 100, height: 50, borderRadius: 10, backgroundColor: '#d34836', justifyContent: 'center', alignItems: 'center'}}
				onPress={() => this._googleSignIn()}>
				<Icon name="logo-googleplus" size={30} color="white" style={{margin: 5}}/>
				<Text style={{color: 'white'}}>Google</Text>
			</TouchableOpacity>
		);
	}
};

const styles = StyleSheet.create({

});

module.exports = google;