import React, { Component } from 'react';

import {
  Dimensions,
  Navigator,
  AsyncStorage,
	NetInfo,
	Alert,
	BackAndroid,
  View,
  TouchableOpacity,
  Linking,
  Text,
	TextInput,
	StyleSheet,
} from 'react-native';
const { width, height } = Dimensions.get('window');

/* pages */
import Splash from './splash';
import Menu from './menu';
import Badge from './badge';
import Merchants from './merchants';

/* react native drawer */
import Drawer from 'react-native-drawer';
/* react native icon */
import Icon from 'react-native-vector-icons/MaterialIcons';
/* react native linear gradient */
import LinearGradient from 'react-native-linear-gradient';
/* react native fcm */
import FCM from 'react-native-fcm';
/* react native android badge */
import BadgeAndroid from 'react-native-android-badge';
/* react native socket */
window.navigator.userAgent = 'react-native';
const SocketIO = require('react-native-socket.io-client/socket.io');
import PickerNew from 'react-native-picker';
import FBSDK, {
  AccessToken,
	LoginManager,
} from 'react-native-fbsdk';
import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin';
/* react native admob */
import { AdMobInterstitial } from 'react-native-admob';


// we fill this up upon on first navigation.
var _navigator;

BackAndroid.addEventListener('hardwareBackPress', () => {
  if (_navigator.getCurrentRoutes().length == 1) {
    // return false;
    Alert.alert(
			null,
			'Are you sure want to close App?',
	    [
	    	{text: 'OK', onPress: () => BackAndroid.exitApp()},
	    	{text: 'CANCEL'},
	    ]
		);
  }
  _navigator.pop();
  return true;
});

/* admob */
	AdMobInterstitial.setAdUnitID('ca-app-pub-5582109422723390/1492401261');
	AdMobInterstitial.setTestDeviceID('EMULATOR');


class DiskonPlus extends Component {
	constructor(props) {
		super(props);

		this.socket = SocketIO('http://104.155.225.65/customer', {query:"app=3QKXb40y6ybbYTFpqoJ+rFRe4WEHZzLdkcxlS0BjxxsHwtSA7BYxdEqxTjcu51GRwOEEoaAmiUlGXhD3J2lcrpVFp3xXRWA7zu23/iA+CAOgv4TjhlESvRaeNVJBFwVOiD6pOZZJwBh43/qhrA8RIQ==&key=BY3aJN98F8",transports: ['websocket']});
		// this.socket = SocketIO('http://192.168.1.103:80/customer',{query:"app=3QKXb40y6ybbYTFpqoJ+rFRe4WEHZzLdkcxlS0BjxxsHwtSA7BYxdEqxTjcu51GRwOEEoaAmiUlGXhD3J2lcrpVFp3xXRWA7zu23/iA+CAOgv4TjhlESvRaeNVJBFwVOiD6pOZZJwBh43/qhrA8RIQ==&key=BY3aJN98F8", 'transports':['websocket']});
		
		this.state = {
			user: null,
			token: false,
			_v: '1.3',

			banner: null,
			newMerchants: null,
			hotPromotions: null,
			category: null,
			
			countInbox: 0,
			readInbox: [],
			deleteInbox: [],

			email: null,
			password: null,
			fcmToken: null,
			
			vouchercode: {
				code_merchants: null,
				_id: null,
				vouchercode: undefined,
			},
			
			popupLogin: null,
			loading: null,

			title: null,
			_id: null,

			initialPosition: null,

			search: false,
		}
	}

	componentDidMount() {
		// get user data
		this._getItem().done();

		/* connection internet */
		NetInfo.addEventListener(
      'change',
      this._handleConnectionInfoChange
    );

		/* FCM */
		FCM.getFCMToken().then(token => {
      // store fcm token in your server
      this.setState({fcmToken: token});

      if(this.state.fcmToken != null) {
				var header = {
	        header: {
	          access: this.state.token,
	        }, 
	        data: {
	          registeredId: this.state.fcmToken,
	        }
	      };
	      this.socket.emit('registered_gcm', header);
			};
    });

		/* geolocation */
		navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({initialPosition: position});
      },
      (error) => console.log(error),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );

    this.watchID = navigator.geolocation.watchPosition((position) => {
      this.setState({initialPosition: position});
    });


    /* socket connection */
    this.socket.on('connect', function(res) {
    });

    this.socket.on('connect_error', function(err) {
    });

    this.socket.on('new_inbox', (data) => {
    	if(this.state.token != false) {
    		for(var a in data.data) {
	    		if(this.state.readInbox.length == 0) {
	    			this.setState({countInbox: data.data.length});
	    		} else {
	    			for(var b in this.state.readInbox) {
		    			if(data.data[a]._id == this.state.readInbox[b]) {
		    				this.setState({countInbox: data.data.length - this.state.readInbox.length});
		    			};
		    		};

		    		for(var b in this.state.deleteInbox) {
		    			if(data.data[a]._id == this.state.deleteInbox[b]) {
		    				if(this.state.readInbox.length < this.state.deleteInbox.length) {
		    					this.setState({countInbox: data.data.length - this.state.deleteInbox.length});
		    				}
		    			};
		    		};

	    		};
	    	};
	    	BadgeAndroid.setBadge(this.state.countInbox);
    	};
    });

    this.socket.on('registered_account', (data) => {
    	console.log(data);
			switch(data.header.status) {
				case 200:
					if(data.header.social == false) {
						this.setAlert(data.header.message);
					} else {
						this.setState({user: data});
						this.setState({token: data.header.access});
						this._setItem(data);
						this.setAlert(data.header.message);
					}
					break;
				default :
					this.setAlert(data.header.message);
					break;
			}
		});

    this.socket.on('post_sign', (data) => {
			switch(data.header.status) {
				case 200:
					this.setState({user: data});
					this.setState({token: data.header.access});
					this._setItem(data);
					this.setAlert(data.header.message);
					break;
				default :
					this.setAlert(data.header.message);
					break;
			};
		});

		this.socket.on('update_cs', (data) => {
			switch(data.header.status) {
				case 200:
					this.setAlert(data.header.message);
					this.setState({user:{
						header: this.state.user.header,
						data: data.data
					}});
					this._setItem(this.state.user);
					break;
				default :
					this.setAlert(data.header.message);
					break;
			}
		});

		this.socket.on('update_password', (data) => {
			switch(data.header.status) {
				case 200:
					this._setItem(data);
					this.setAlert(data.header.message);
					break;
				default :
					this.setAlert(data.header.message);
					break;
			}
		});

		this.socket.on('upload_img_cs', (data) => {
			switch(data.header.status) {
				case 200:
					this.setAlert(data.header.message);
					this.setState({user:{
						header: this.state.user.header,
						data: data.data
					}});
					this._setItem(this.state.user);
					break;
				default :
					this.setAlert(data.header.message);
					break;
			}
		});
	}

	componentWillMount() {
		this.socket.on('_v', (data) => {
			if(this.state._v === data.data && data.allowed) {
				this.socket.emit('Dash_BannerSet', {header:{access: this.state.token}});
				this.socket.emit('More_NewMerchants', {header:{access: this.state.token}});
				this.socket.emit('More_HotPromo', {header:{access: this.state.token}});
				this.socket.emit('More_Category', {header:{access: this.state.token}});
				this.socket.emit('new_inbox', {header:{access: this.state.token}});
			} else if(this.state._v != data.data && data.allowed) {
				Alert.alert(
					null,
					data.header.message,
					[
						{text: 'Update', onPress: () => {
							Linking.canOpenURL("market://details?id=com.diskonplus").then(supported => {
					      if (supported) {
					        Linking.openURL("market://details?id=com.diskonplus");
					      } else {
					      	Linking.openURL("https://play.google.com/store/apps");
					      }
					    });
						}},
						{text: 'Close', onPress: () => {
							this.socket.emit('Dash_BannerSet', {header:{access: this.state.token}});
							this.socket.emit('More_NewMerchants', {header:{access: this.state.token}});
							this.socket.emit('More_HotPromo', {header:{access: this.state.token}});
							this.socket.emit('More_Category', {header:{access: this.state.token}});
						}},
					]
				);
			} else {
				Alert.alert(
					null,
					data.header.message,
					[
						{text: 'Update', onPress: () => {
							BackAndroid.exitApp();
							Linking.canOpenURL("market://details?id=com.diskonplus").then(supported => {
					      if (supported) {
					        Linking.openURL("market://details?id=com.diskonplus");
					      } else {
					      	Linking.openURL("https://play.google.com/store/apps");
					      }
					    });
						}},
					],
					{
            cancelable: false
          }
				);
			};
		});

		/* banner */
  	this.socket.on('Dash_BannerSet', (data) => {
			switch(data.header.status) {
				case 200 :
					this.setState({banner: data.data});
					break;
				default:
					this.setAlert(data.header.message);
					break;
			};
  	});
		
		/* new merchants */
  	this.socket.on('More_NewMerchants', (data) => {
			switch(data.header.status) {
				case 200 :
					this.setState({newMerchants: data.data});
					break;
				default:
					this.setAlert(data.header.message);
					break;
			};
  	});
		
		/* hot promotion */
  	this.socket.on('More_HotPromo', (data) => {
			switch(data.header.status) {
				case 200 :
					this.setState({hotPromotions: data.data});
					break;
				default:
					this.setAlert(data.header.message);
					break;
			};
  	});
		
		/* category */
  	this.socket.on('More_Category', (data) => {
			switch(data.header.status) {
				case 200 :
					this.setState({category: data.data});
					break;
				default:
					this.setAlert(data.header.message);
					break;
			};
  	});
	}

	// get user data
	_getItem = async () => {
		try {
			var value = await AsyncStorage.getItem('USER');
			var token = await AsyncStorage.getItem('TOKEN');
			var readInbox = await AsyncStorage.getItem('readInbox');
			var deleteInbox = await AsyncStorage.getItem('deleteInbox');
			if(token == null) {
				// not have user data
				
				// check version app
				this.socket.emit('_v', {header: {access: this.state.token}, data: {_v: this.state._v}});
			} else {
				// have user data
				this.setState({user: JSON.parse(value)});
				this.setState({token: JSON.parse(token)});
				if(readInbox != null) {
					this.setState({readInbox: readInbox.split(',')});
				}
				if(deleteInbox != null) {
					this.setState({deleteInbox: deleteInbox.split(',')});
				}
				// check version app
				this.socket.emit('_v', {header: {access: this.state.token}, data: {_v: this.state._v}});
			}
		} catch(err) {
		}
	}

	// set user data
	async _setItem(data) {
		try {
			await AsyncStorage.setItem('USER', JSON.stringify(data))
			if(data.header.access) {
				await AsyncStorage.setItem('TOKEN', JSON.stringify(data.header.access))
			}
		} catch(err) {
		}
	}

	_removeStorage = async () => {
		try {
			this.setState({
				user: null,
				token: false,
				readInbox: [],
				deleteInbox: [],
				countInbox: 0,
			});
			BadgeAndroid.setBadge(0);
			LoginManager.logOut();
			GoogleSignin.signOut().then(() => {}).catch((err) => {});
			this.closeDrawer();
      await AsyncStorage.removeItem('USER');
      await AsyncStorage.removeItem('TOKEN');
      await AsyncStorage.removeItem('readInbox');
      await AsyncStorage.removeItem('deleteInbox');
		} catch(err) {
		}
	}

	componentWillUnmount() {
		/* connection internet */
		NetInfo.removeEventListener(
      'change',
      this._handleConnectionInfoChange
    );

		/* geolocation */
    navigator.geolocation.clearWatch(this.watchID);
	}



	_handleConnectionInfoChange = (connectionInfo) => {
	  if(connectionInfo == 'NONE') {
	  	this.setAlert('Internet Connection');
	  };
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
	
	/* side menu */
  closeDrawer = () => {
    this._drawer.close();
  }
	
  openDrawer = () => {
    this._drawer.open();
    this.setState({update: true});
  }

  nav = (component, title) => {
  	_navigator.push({
  		component: component,
  		title: title,
  	});
  }
	
  render() {
    return (
			<Drawer
				ref={(ref) => this._drawer = ref}
				type="static"
			  content={<Menu closeDrawer={this.closeDrawer} navigator={this.nav} state={this.state} socket={this.socket} _removeStorage={this._removeStorage} />}
			  tapToClose={true}
			  openDrawerOffset={0.2}
			  panCloseMask={0.2}
			  style={Styles.drawerStyles}
			  tweenHandler={(ratio) => ({
			    main: { opacity:(2-ratio)/2 }
			  })}>
				<Navigator 
					initialRoute={{component: Splash}}
					renderScene={this.renderScene.bind(this)}
					configureScene={(route) => {
						if(route.sceneConfig) {
							return route.sceneConfig;
						}
						return Navigator.SceneConfigs.PushFromRight;
					}}
					navigationBar={
						<Navigator.NavigationBar
							routeMapper={this.NavigationBarRouteMapper}
							style={Styles.navigation}
						/>
					}
				/>
			</Drawer>
    )
  }
	
	NavigationBarRouteMapper = {
		LeftButton: (route, navigator, index, navState) => {
			if(route.title == 'DiskonPlus') {
				return (
					<TouchableOpacity
						style={Styles.button}
						onPress={() => this.openDrawer()}>
						<Icon name="menu" size={30} color="white" />
						{(() => {
							if(this.state.countInbox > 0 && this.state.token != false){
								return (
									<View style={{flex: 1, position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, justifyContent: 'center', alignItems: 'flex-end'}}>
										<Badge state={this.state.countInbox} />
									</View>
								)
							};
						})()}
					</TouchableOpacity>
				);
			} else if(route.title == 'Login') {
			} else {
				return (
					<TouchableOpacity
						style={Styles.button}
						onPress={() => {navigator.pop(); PickerNew.hide();}}>
						<Icon name="keyboard-arrow-left" size={30} color="white"/>
					</TouchableOpacity>
				);
			};
		},
		Title: (route, navigator, index, navState) => {
			if(route.title == 'Login') {
			} else {
				return (
					<View
						style={Styles.title}>
						{this.title(route)}
					</View>
				);
			};
		},
		RightButton: (route, navigator, index, navState) => {
			if(route.title == 'Login' || route.title == 'Forgot Password' || route.title == 'Register' || route.title == 'Update' || route.title == 'About Us') {
				
			} else {
				return (
					<View
						style={Styles.button}>
						{this.rightBtn()}
					</View>
				);
			};
		},
	}
	
	search(route) {
		var header = {
			header: {
				access: this.state.token
			}, 
			data: {
				search : this.state.search
			}
		};

		this.socket.emit('search_box', header);
		this.setState({search: false});
		switch(route.component.name) {
			case 'merchants':
				route.title = 'Search result for ' + this.state.search;
				break;
			default:
				this.nav(Merchants, 'Search result for ' + this.state.search);
				break;
		};
	}
	
	title(route) {
		if(this.state.search) {
  		return (
  			<View style={{height: 40, justifyContent: 'center'}}>
					<TextInput
	  				style={{width: width / 2, borderColor: 'white', color: 'white'}}
	  				placeholder='Search'
						placeholderTextColor='white'
						underlineColorAndroid='white'
	  				autoFocus={true}
	  				onChangeText={(text) => this.setState({search: text})}
	  				onSubmitEditing ={() => this.search(route)}
	  				blurOnSubmit={true}
	  			/>
  			</View>
  		)
  	} else {
  		return (
  			<Text style={{fontWeight: 'bold', fontSize: 20, color: 'white'}}>{route.title}</Text>
  		)
  	}
	}
	
	rightBtn() {
		if(this.state.search) {
  		return (
				<TouchableOpacity
					onPress={() => this.setState({search: false})}>
					<Icon name="close" size={30} color="white"/>
				</TouchableOpacity>
  		)
  	} else {
  		return (
  			<TouchableOpacity
					onPress={() => this.setState({search: true})}>
  				<Icon name="search" size={30} color="white"/>
  			</TouchableOpacity>
  		)
  	}
	}

  renderScene(route, navigator) {
		_navigator = navigator;

		return (
			<LinearGradient
				start={[0.0, 0.25]}
				end={[0.5, 1.0]}
				locations={[0,.5,1]}
				style={{position: 'absolute', top: 0, left: 0, bottom: 0, right: 0}}
				colors={['#a540e4', '#376dda', '#34b29a']}>
				<route.component {...route.passProps} navigator={_navigator} state={this.state} socket={this.socket}/>
			</LinearGradient>
		)
    
    return this.noRoute(_navigator);
  }

  noRoute(navigator) {
    return (
			<TouchableOpacity
				style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
				onPress={() => navigator.pop()}>
				<Text>
					404
				</Text>
			</TouchableOpacity>
    )
  }
}

var Styles = StyleSheet.create({
	/* NavigationBarRouteMapper */
	navigation: {
		flex: 1,

		/*borderWidth: 1,
		borderColor: 'white',*/
	},
	button: {
    flex: 1,
    justifyContent: 'center',

    /*borderWidth: 1,
    borderColor: 'white',*/
  },
  title: {
  	flex: 1,
  	width: width / 2,
  	justifyContent: 'center',

  	/*borderWidth: 1,
    borderColor: 'white',*/
  },

  badge: {
		width: 20,
		height: 20,
		backgroundColor: 'red',
		borderWidth: 1,
		borderRadius: 50,
		borderColor: 'white',
		justifyContent: 'center',
		alignItems: 'center',
		position: 'absolute',
		top: 0,
		right: 0,
	},

	text: {
		color: 'white',
	}
});

module.exports = DiskonPlus;