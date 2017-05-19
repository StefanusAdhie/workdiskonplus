import React, { Component } from 'react';

import {
	Dimensions,
	AsyncStorage,
	Linking,
	View,
	TouchableOpacity,
	TouchableHighlight,
	Text,
	ScrollView,
	Image,
	StyleSheet,
} from 'react-native';
const { width, height } = Dimensions.get('window');

/* pages */
import Inbox from './inbox';
import History from './history';
import AboutUs from './about';
import Login from './login';
import Badge from './badge';
import Update from './update';

/* react native linear gradient */
import LinearGradient from 'react-native-linear-gradient';
/* react native icon */
import Icon from 'react-native-vector-icons/MaterialIcons';
/* image picker */
var Platform = require('react-native').Platform;
var ImagePicker = require('react-native-image-picker');


class menu extends Component {
	constructor(props) {
		super(props);
		this.state = {
			user: null,
		}
	}
	
	selectPhotoTapped() {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true
      }
    };

    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
      }
      else if (response.error) {
      }
      else if (response.customButton) {
      }
      else {
        var source;

        // You can display the image using either:
        //source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};

        //Or:
        if (Platform.OS === 'android') {
          source = {uri: response.uri, isStatic: true};
        } else {
          source = {uri: response.uri.replace('file://', ''), isStatic: true};
        }

				var header = {
					header: {
						access: this.props.state.token
					}, 
					data: {
						customers: {
							value: {
								photo: "data:image/jpeg;base64," + response.data
							}
						}
					}
				};
				this.props.socket.emit('upload_img_cs', header);
      }
    });
  }
	
	img() {
		const { state } = this.props;
		if(state.user.data.photo == null) {
			return (
				<Image
					source={require('../img/diskon_plus.png')}
					style={Styles.sidemenuimage}/>
			)
		} else {
			return (
				<Image
					source={{uri: state.user.data.photo}}
					style={Styles.sidemenuimage}/>
			)
		}
	}
	
	header() {
		const { closeDrawer, navigator, state } = this.props;
		if(state.token != false) {
			return (
				<View style={Styles.sidemenuheader}>
					<LinearGradient
						locations={[0, 1]}
						colors={['rgba(0, 0, 0, .75)', 'rgba(0, 0, 0, 0)']}
						style={Styles.sidemenutitle}>
						<Text style={Styles.text}>EXCLUSIVE MEMBER</Text>
					</LinearGradient>
					<View style={Styles.sidemenuuser}>
						<TouchableOpacity onPress={() => this.selectPhotoTapped()} >
							<Icon name="create" size={10} color="white" style={{position: 'absolute', top: 0, right: 0}} />

							<View style={[Styles.sidemenuimage, {backgroundColor: 'black'}]}>
								<Image
									source={{uri: state.user.data.photo}}
									style={Styles.sidemenuimage}/>
							</View>
						</TouchableOpacity>
						<View style={Styles.sidemenuname}>
							<TouchableOpacity
								onPress={() => {closeDrawer(); navigator(Update, 'Update')}}
								style={[Styles.sidemenuusername, {flexDirection: 'row'}]}>
								<Text style={[Styles.text, {flex: 1}]}>{state.user.data.fullname.toUpperCase()}</Text>
								<Icon name="create" size={10} color="white" />
							</TouchableOpacity>
							<View
								style={[Styles.sidemenuusername, {borderTopWidth: 1, borderColor: 'white'}]}>
								<Text style={Styles.text}>EXCLUSIVE MEMBER</Text>
							</View>
						</View>
					</View>
					<View style={{paddingLeft: 5, backgroundColor: 'rgba(0, 0, 0, .5)'}}>
						<Text style={Styles.text}>{state.user.data.noid}</Text>
					</View>
				</View>
			)
		}
	}
	
	menu() {
		const { closeDrawer, navigator, state, socket } = this.props;
		return (
			<View>
				<TouchableOpacity
					style={Styles.sidemenulist}
					onPress={() => closeDrawer()}>
					<Icon name="home" size={30} color="white"/>
					<Text style={Styles.sidemenulisttext}>HOME</Text>
				</TouchableOpacity>
			
				{state.token ? 
					<View>
						<TouchableOpacity
							style={Styles.sidemenulist}
							disabled={this.state.button}
							onPress={() => {
								this.setState({button: true});
								socket.emit('get_inbox', {header: {access: state.token}});
								navigator(Inbox, 'Inbox');
								closeDrawer();
							}}
							onPressOut={this._timeout.bind(this)}>
							<Icon name="inbox" size={30} color="white"/>
							<Text style={Styles.sidemenulisttext}>INBOX</Text>
							{(() => {
								if(state.countInbox > 0){
									return (
										<Badge state={state.countInbox} />
									)
								};
							})()}
						</TouchableOpacity>
						
						<TouchableOpacity
							style={Styles.sidemenulist}
							disabled={this.state.button}
							onPress={() => {
								this.setState({button: true});
								socket.emit('history_redem', {header: {access: state.token}});
								navigator(History, 'History');
								closeDrawer();
							}}
							onPressOut={this._timeout.bind(this)}>
							<Icon name="history" size={30} color="white"/>
							<Text style={Styles.sidemenulisttext}>HISTORY</Text>
						</TouchableOpacity>
					</View>
					: null
				}
				
				<TouchableOpacity
					style={Styles.sidemenulist}
					disabled={this.state.button}
					onPress={() => {
						this.setState({button: true});
						navigator(AboutUs, 'About Us');
						closeDrawer();
					}}
					onPressOut={this._timeout.bind(this)}>
					<Icon name="settings" size={30} color="white"/>
					<Text style={Styles.sidemenulisttext}>ABOUT US</Text>
				</TouchableOpacity>
			</View>
		)
	}

	_timeout() {
		setTimeout(() => {this.setState({button: false})}, 2000);
	}
	
	loginlogout() {
		const { closeDrawer, navigator, state, _removeStorage } = this.props;
		if(state.token == false) {
			return (
				<TouchableOpacity
					style={[Styles.sidemenulist, {borderTopWidth: 1, backgroundColor: 'rgba(0, 0, 0, .25)'}]}
					disabled={this.state.button}
					onPress={() => {
						this.setState({button: true});
						closeDrawer();
						navigator(Login, 'Login');
					}}
					onPressOut={this._timeout.bind(this)}>
					<Text style={[Styles.sidemenulisttext, {textAlign: 'right'}]}>LOGIN</Text>
				</TouchableOpacity>
			)
		} else {
			return (
				<TouchableOpacity
					style={[Styles.sidemenulist, {borderTopWidth: 1, backgroundColor: 'rgba(0, 0, 0, .25)'}]}
					disabled={this.state.button}
					onPress={() => {
						this.setState({button: true});
						closeDrawer();
						_removeStorage().done();
					}}
					onPressOut={this._timeout.bind(this)}>
					<Text style={[Styles.sidemenulisttext, {textAlign: 'right'}]}>LOGOUT</Text>
				</TouchableOpacity>
			)
		}
	}
	
	link(a) {
		Linking.canOpenURL(a).then(supported => {
			if(supported) {
				Linking.openURL(a);;
			}
		})
	}
	
	render() {
		const { state } = this.props;
		return (
			<LinearGradient
				start={[0.0, 0.25]}
				end={[0.5, 1.0]}
				locations={[0,.5,1]}
				colors={['#a540e4', '#376dda', '#34b29a']}
				style={Styles.sidemenu}>
				{this.header()}
				<ScrollView>
					{this.menu()}
				</ScrollView>
				<View style={{justifyContent: 'flex-end'}}>
					{this.loginlogout()}
					<View style={Styles.sidemenubottom}>
						<Text style={Styles.text}>For more Information CONTACT US :</Text>
						<TouchableOpacity
							style={Styles.sidemenuemail}
							onPress={() => this.link('mailto:cs@diskonplus.com?subject=&body=')}>
							<Icon name="email" size={30} color="white"/>
							<Text style={Styles.sidemenulisttext}>cs@diskonplus.com</Text>
						</TouchableOpacity>
					</View>
				</View>
			</LinearGradient>
		)
	}
}

var Styles = StyleSheet.create({
	sidemenu: {
		flex: 1,
		flexDirection: 'column',
	},
	sidemenuheader: {
    height: height / 3,
		borderBottomWidth: 1,
		borderColor: 'white',
  },
	sidemenutitle: {
		height: 50,
		padding: 10,
	},
	sidemenuuser: {
		flexDirection: 'row',
		padding: 10,
	},
	sidemenuimage: {
		width: 70,
		height: 70,
		borderRadius: 50,
	},
	sidemenuname: {
		flex: 4,
		flexDirection: 'column',
		paddingLeft: 5,
	},
	sidemenuusername: {
		flex: 1,
		justifyContent: 'center',
	},
  sidemenulist: {
		flexDirection: 'row',
    height: 50,
    alignItems: 'center',
    borderBottomWidth : 1,
    borderColor: 'white',
		padding: 10,
  },
	sidemenulisttext: {
		flex: 1,
    color: 'white',
		textAlign: 'left',
		marginLeft: 5,
  },
	sidemenubottom: {
		padding: 10,
	},
	sidemenuemail: {
		flexDirection: 'row',
		height: 50,
		alignItems: 'center',
	},
	text: {
		color: 'white',
	},
	badge: {
		width: 25,
		height: 25,
		backgroundColor: 'red',
		borderWidth: 1,
		borderRadius: 50,
		borderColor: 'white',
		justifyContent: 'center',
		alignItems: 'center',
	},
});

module.exports = menu;