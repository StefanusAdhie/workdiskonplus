import React, { Component } from 'react';

import {
	Dimensions,
	BackAndroid,
	Alert,
  ScrollView,
	View,
	Text,
	TextInput,
	WebView,
	TouchableOpacity,
	PanResponder,
	Linking,
	ListView,
	Image,
	Modal,
	ActivityIndicator,
	StyleSheet,
	Animated,
  Easing,
	Picker,
} from 'react-native';
const { width, height } = Dimensions.get('window');

/* pages */
import Wait from './wait';

/* react native maps */
import MapView from 'react-native-maps';
/* react native linear gradient */
import LinearGradient from 'react-native-linear-gradient';
/* react native tab */ 
import ScrollableTabView from 'react-native-scrollable-tab-view';
/* react native icon */
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon1 from 'react-native-vector-icons/Ionicons';
/* react native carousel control */
import CarouselControl from 'react-native-carousel-control';
/* react native carousel */
var Carousel = require('react-native-carousel');
/* react native collapse */
import Accordion from 'react-native-collapsible/Accordion';
/* react native admobs */
import { AdMobInterstitial } from 'react-native-admob'
/* react native photo view */
import PhotoView from 'react-native-photo-view';
/* react native facebook */
import FBSDK, {
  ShareDialog,
} from 'react-native-fbsdk';
/* react native share */
import Share from 'react-native-share';


class description extends Component {
  constructor(props) {
  	super(props);
  	this.animatedValue = new Animated.Value(0);
		this.state = {
			modalVisible: false,
			redeem: false,
			voucher: null,
			vouchercode: '',
			qty: '1',

			description: {
				_id: null,
				code_merchants: null,
				nm_merchants: null,
				location: null,
				about: null,
				archive: null,
				category: null,
				subunit: null,
				voucher: null,
				address: null,
				contact: null,
				logo: null,
				content_social: null,
			},
		}
  }

  componentWillMount() {
		this._panResponder = PanResponder.create({
			// Ask to be the responder:
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      
      onPanResponderMove: (evt, gestureState) => {
        // The most recent move distance is gestureState.move{X,Y}
        if((gestureState.moveY - gestureState.y0) >= 100) {
        	this.setState({modalVisible: false});
        }
        // The accumulated gesture distance since becoming responder is
        // gestureState.d{x,y}
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        // Returns whether this component should block native components from becoming the JS
        // responder. Returns true by default. Is currently only supported on android.
        
        return true;
      },
		});
	}

  componentDidMount() {
  	/* animation marquee */
    this.animate();

    /* react native admob */
    AdMobInterstitial.addEventListener('interstitialDidLoad', () => console.log('interstitialDidLoad event'));
    AdMobInterstitial.addEventListener('interstitialDidClose', this.interstitialDidClose);
    AdMobInterstitial.addEventListener('interstitialDidFailToLoad', () => console.log('interstitialDidFailToLoad event'));
    AdMobInterstitial.addEventListener('interstitialDidOpen', () => console.log('interstitialDidOpen event'));
    AdMobInterstitial.addEventListener('interstitialWillLeaveApplication', () => console.log('interstitalWillLeaveApplication event'));

    AdMobInterstitial.requestAd((error) => error && console.log(error));

    this.props.socket.on('Show_BannerDetails', (data) => {
    	console.log(data);
			switch(data.header.status) {
				case 200:
					this.setState({description: data.data});
					break;
				default:
					this.setAlert(data.header.message);
					break;
			};
		});

		this.props.socket.on('Show_NewMerchantsDetails', (data) => {
			switch(data.header.status) {
				case 200:
					this.setState({description: data.data});
					break;
				default:
					this.setAlert(data.header.message);
					break;
			};
		});

		this.props.socket.on('show_merchants_details', (data) => {
			switch(data.header.status) {
				case 200:
					this.setState({description: data.data});
					break;
				default:
					this.setAlert(data.header.message);
					break;
			};
		});

		this.props.socket.on('Show_HotPromoDetails', (data) => {
			switch(data.header.status) {
				case 200:
					this.setState({description: data.data});
					break;
				default:
					this.setAlert(data.header.message);
			};
		});

		this.props.socket.on('post_redem_code', (data) => {
			switch(data.header.status) {
				case 200:
					this.setAlert(data.header.message);
					break;
				default :
					this.setAlert(data.header.message);
					break;
			};
		});
  }

  componentWillUnmount() {
    AdMobInterstitial.removeAllListeners();

    this.props.socket.removeListener('Show_BannerDetails');
    this.props.socket.removeListener('Show_NewMerchantsDetails');
    this.props.socket.removeListener('show_merchants_details');
    this.props.socket.removeListener('Show_HotPromoDetails');
    this.props.socket.removeListener('post_redem_code');
  }

  interstitialDidClose() {
    AdMobInterstitial.requestAd((error) => error && console.log(error));
  }

  showInterstital(voucher) {
    AdMobInterstitial.showAd((error) => error && console.log(error));
    this.setState({redeem: true, voucher: voucher});
  }

  shareLinkWithShareDialog(title, content, site) {
		ShareDialog.canShow({
				contentType: 'link',
				contentUrl: site,
				contentDescription: content,
			}).then(
			function(canShow) {
				if (canShow) {
					return ShareDialog.show({
						contentType: 'link',
						contentUrl: site,
						contentDescription: content,
					});
				}
			}
		).then(
			function(result) {
				if (result.isCancelled) {
					alert('Share cancelled');
				} else {
					alert('Share success with postId: '
						+ result.postId);
				}
			},
			function(error) {
				alert('Share fail with error: ' + error);
			}
		);
	}
	
	tweet(title, content, site) {
		let shareOptions = {
      title: title,
      message: content,
      url: site,
      // subject: "Share Link" //  for email
    };
		Share.shareSingle(Object.assign(shareOptions, {
			"social": "twitter"
		}));
	}

	animate () {
	  this.animatedValue.setValue(0)
	  Animated.timing(
	    this.animatedValue,
	    {
	      toValue: 1,
	      duration: 10000,
	      easing: Easing.linear
	    }
	  ).start(() => this.animate())
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
	
	catur(b) {
		if(b%2 == 0) {
			return {
				backgroundColor: 'rgba(0, 0, 0, .25)'
			}
		}
	}
	
	link(a) {
		Linking.canOpenURL(a).then(supported => {
			if(supported) {
				Linking.openURL(a);
			}
		})
	}

	modal() {
		if(this.state.modalVisible) {
			return (
				<Modal
					animationType={"fade"}
					transparent={true}
					visible={this.state.modalVisible}
					onRequestClose={(e) => console.log(e)}>
					
					<View style={{backgroundColor: 'rgba(0, 0, 0, .5)', alignItems: 'flex-end'}}>
						<TouchableOpacity
							style={{flexDirection: 'row', alignItems: 'center'}}
							onPress={() => this.setState({modalVisible: false})}>
							<Icon1 name="ios-close" size={25} color="white" style={{margin: 5}}/>
							<Text style={{color: 'white'}}>Close</Text>
						</TouchableOpacity>
					</View>
					
					<View style={{flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', backgroundColor: 'rgba(0, 0, 0, .5)'}}>
						<Carousel
							indicatorSize={0}
							animate={false}
							initialPage={this.state.initialPage}>
							{this.state.description.archive.photo.map((img) => {
								return (
									<View
										key={img._id}
										style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
										<PhotoView
											{...this._panResponder.panHandlers}
											source={{uri: img.image}}
											minimumZoomScale={0.5}
											maximumZoomScale={3}
											androidScaleType="center"
											onLoad={() => console.log()}
											onTap={() => console.log()}
											style={{flex: 1, width: 3000, height: 3000}}/>
									</View>
								)
							})}
						</Carousel>
					</View>
				</Modal>
			);
		};

		if(this.state.redeem) {
			return (
				<Modal
					animationType={'fade'}
					transparent={true}
					visible={this.state.redeem}
					onRequestClose={(e) => console.log(e)}>
					<View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
						<View style={{width: 300, height: 200, borderRadius: 20, padding: 20, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center'}}>
							<Text style={{flex: 1}}>Redeem Voucher</Text>
							
							<View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
								<Text style={{flex: 1}}>Voucher Code</Text>
								<Text>:</Text>
								<TextInput
									style={{flex: 2}}
									placeholder='Voucher Code'
									autoCapitalize='characters'
									onChangeText={(text) => this.setState({vouchercode: text})}
									returnKeyType='done'
									onSubmitEditing={() => this.redeem()}/>
							</View>

							{this.state.voucher.qty ? 
								<View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
									<Text style={{flex: 1}}>Qty</Text>
									<Text>:</Text>
									<Picker
										style={{flex: 2}}
									  selectedValue={this.state.qty}
									  onValueChange={(lang) => this.setState({qty: lang})}>
									  <Picker.Item label="1" value="1" />
									  <Picker.Item label="2" value="2" />
									  <Picker.Item label="3" value="3" />
									  <Picker.Item label="4" value="4" />
									</Picker>
								</View>
								: null
							}

							<View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
								{this.state.vouchercode == '' ?
									<View
										style={{flex: 1, width: 50, height: 35, borderRadius: 10, margin: 10, backgroundColor: 'grey', justifyContent: 'center', alignItems: 'center'}}>
										<Text style={{color: 'white'}}>Redeem</Text>
									</View>
									:
									<TouchableOpacity
										style={{flex: 1, width: 50, height: 35, borderRadius: 10, margin: 10, backgroundColor: '#a540e4', justifyContent: 'center', alignItems: 'center'}}
										onPress={() => this.redeem()}>
										<Text style={{color: 'white'}}>Redeem</Text>
									</TouchableOpacity>
								}
								
								<TouchableOpacity
									style={{flex: 1, width: 50, height: 35, borderRadius: 10, margin: 10, backgroundColor: 'grey', justifyContent: 'center', alignItems: 'center'}}
									onPress={() => this.setState({redeem: false})}>
									<Text style={{color: 'white'}}>Cancel</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</Modal>
			);
		};
	}
	
	redeem(a) {
		if(this.state.vouchercode != '') {
			this.setState({redeem: false});

			var header = {
				header: {
					access: this.props.state.token
				}, 
					data: {
						redem_code: {
							merchants: this.state.description.code_merchants, 
							voucher: this.state.voucher._id, 
							verify_code: this.state.vouchercode, 
							quota: Number(this.state.qty)
						}
					}
				}

			this.props.socket.emit('post_redem_code', header);
		}
	}
	
	btnRedeem(voucher) {
		if(this.props.state.token != false) {
			return (
				<View style={Styles.homeheader}>
					<View style={{flex: 4}} />
					<TouchableOpacity
						style={Styles.homebutton}
						onPress={() => this.showInterstital(voucher)}>
						<Text style={{color: 'white', fontWeight: 'bold'}}>Redeem</Text>
					</TouchableOpacity>
				</View>
			)
		}
	}

	render() {
		const marginLeft = this.animatedValue.interpolate({
	    inputRange: [0, 1],
	    outputRange: [width, -width/2]
	  })

		return (
			<View style={{flex: 1}}>
				{this.state.description ? this.modal() : null}
				
				{this.state.description.logo ? 
					<Image
							style={{width: width, height: height/3, alignItems: 'stretch'}}
							source={{uri: this.state.description.logo}}>
							<LinearGradient
								locations={[0, 1]}
								colors={['rgba(0, 0, 0, .75)', 'rgba(0, 0, 0, 0)']}
								style={{height: 70, position: 'absolute', top: 0, left: 0, right: 0}}/>
							<LinearGradient
								locations={[0, 1]}
								colors={['rgba(0, 0, 0, .1)', 'rgba(0, 0, 0, 1)']}
								style={{height: 40, position: 'absolute', left: 0, right: 0, bottom: 0}}>

									{this.state.description.running ?
										<View style={{flex: 1}}>
								      <Animated.View
								        style={{
								          marginLeft,
								          height: 30,
								          width: width,
								          justifyContent: 'center',
								          backgroundColor: 'transparent'}} >
								        <Text style={{color: 'white', fontSize: 15}}>{this.state.description.running}</Text>
								      </Animated.View>
								    </View>
								    :
								    null
								  }

							</LinearGradient>
						</Image>
						: 
						<Image
							style={{width: width, height: height/3, alignItems: 'stretch'}}
							source={require('../img/no_img.png')} />
					}

					<View style={{flexDirection: 'row', height: 50, padding: 10, backgroundColor: 'rgba(0, 0, 0, .25)', alignItems: 'center'}}>
						<Text style={{flex: 1, textAlign: 'left', color: 'white'}}>
							{this.state.description.nm_merchants ? this.state.description.nm_merchants : null}
						</Text>

						<Text style={{flex: 1, textAlign: 'right', color: 'white'}}>
							{this.state.description.category ? this.state.description.category : null}
						</Text>
					</View>

					<ScrollableTabView
						tabBarUnderlineStyle={{backgroundColor: 'white'}}
						tabBarActiveTextColor='white'
						tabBarInactiveTextColor='white'>
						<ScrollView tabLabel='ABOUT'>
							{this.state.description.about ?
								<View>
									<TouchableOpacity
										style={{flexDirection: 'row', height: 50, padding: 10, backgroundColor: 'rgba(0, 0, 0, .25)', alignItems: 'center', marginTop: 10}}
										onPress={() => this.link(this.state.description.content_social.site)}>
										<Icon name="public" size={30} color="white" style={{margin: 5}}/>
										<View
											style={{flex: 1, borderLeftWidth: 1, borderColor: 'white'}}>
											<Text numberOfLines={1} style={{textAlign: 'left', color: 'white', marginLeft: 5}}>
												{this.state.description.content_social ? this.state.description.content_social.site : null}
											</Text>
										</View>
										<Icon name="chevron-right" size={30} color="white" style={{margin: 5, textAlign: 'right'}}/>
									</TouchableOpacity>

									<TouchableOpacity
										style={{flexDirection: 'row', height: 50, padding: 10, backgroundColor: 'rgba(0, 0, 0, .25)', alignItems: 'center', borderTopWidth: 1, borderColor: 'white'}}
										onPress={() => this.link('tel:' + this.state.description.contact.phone)}>
										<Icon name="phone" size={30} color="white" style={{margin: 5}}/>
										<View
											style={{flex: 1, borderLeftWidth: 1, borderColor: 'white'}}>
											<Text style={{color: 'white', marginLeft: 5}}>
												{this.state.description.contact ? this.state.description.contact.phone : null}
											</Text>
										</View>
										<Icon name="chevron-right" size={30} color="white" style={{margin: 5, textAlign: 'right'}}/>
									</TouchableOpacity>
									
									<View style={{flexDirection: 'row', height: 50, padding: 10, backgroundColor: 'rgba(0, 0, 0, .25)', alignItems: 'center', marginTop: 10}}>
										<View style={{flex: 1, height: 50, margin: -10, backgroundColor: 'rgba(0, 0, 0, .25)', justifyContent: 'center', alignItems: 'center'}}>
											<Text style={{color: 'white'}}>SHARED</Text>
										</View>
										
										<TouchableOpacity
											style={{flex: 1, alignItems: 'center'}}
											onPress={() => this.shareLinkWithShareDialog(this.state.description.content_social.title, this.state.description.content_social.content, this.state.description.content_social.site)}>
											<Icon1 name="logo-facebook" size={30} color="white" />
										</TouchableOpacity>
										
										<TouchableOpacity
											style={{flex: 1, alignItems: 'center'}}
											onPress={() => this.tweet(this.state.description.content_social.title, this.state.description.content_social.content, this.state.description.content_social.site)}>
											<Icon1 name="logo-twitter" size={30} color="white" />
										</TouchableOpacity>
									</View>

									<View style={{marginTop: 10, padding: 10, backgroundColor: 'rgba(0, 0, 0, .25)'}}>
										<Text style={{color: 'white'}}>
											{this.state.description.about ? this.state.description.about : null}
										</Text>
									</View>

									{/*<ScrollView
										style={{flex: 1, marginLeft: -50}}
										directionalLockEnabled={false}
										horizontal={true} >*/}
									<View style={{ marginTop: 10, backgroundColor: 'rgba(0, 0, 0, .25)'}}>
										{this.state.description.archive ? 
											/*<CarouselControl
												sneak={50}
												pageWidth={200} >*/
											<View style={{flexDirection: 'row'}}>
												<View style={{flex: 1}}>
													{this.state.description.archive.photo.map((img, index) => {
														if(index % 2 == 0 && index < 4) {
															return (
																<TouchableOpacity
																	key={img._id}
																	activeOpacity={1}
																	style={{margin: 5}}
																	onPress={() => this.setState({modalVisible: true, initialPage: index})}>
																	<Image
																		style={{width: width / 2, height: width / 2}}
																		source={{uri: img.image}}/>
																</TouchableOpacity>
															)
														}
													})}
												</View>

												<View style={{flex: 1}}>
													{this.state.description.archive.photo.map((img, index) => {
														if(index % 2 == 1 && index < 4) {
															return (
																<TouchableOpacity
																	key={img._id}
																	activeOpacity={1}
																	style={{margin: 5}}
																	onPress={() => this.setState({modalVisible: true, initialPage: index})}>
																	<Image
																		style={{width: width / 2, height: width / 2}}
																		source={{uri: img.image}}/>
																</TouchableOpacity>
															)
														}
													})}
												</View>
											</View>
											/*</CarouselControl>*/
											: 
											null
										}
									</View>
									{/*</ScrollView>*/}
									
									{this.state.description.archive ? 
										this.state.description.archive.video[0] ?
											<View style={{height: 180, marginTop: 20, backgroundColor: 'transparent'}}>
												<WebView
													source={{uri: this.state.description.archive.video[0].url}}
													javaScriptEnabled={true}
													scrollEnabled={false}
													domStorageEnabled={true}
													style={{marginTop: -45, position: 'relative'}}/>
											</View>
											:
											null
										: 
										null
									}
								</View>
								:
								<Wait />
							}
							
							<View style={{height: 50}} />
						</ScrollView>
						
						<ScrollView tabLabel='VOUCHER'>
							{this.state.description.voucher ? 
								this.state.description.voucher.map((voucher) => {
									return (
										<View key={voucher._id}>
											{voucher.used ?
												<Image
													style={{width: width, height: 150, position: 'absolute', zIndex: 1}}
													source={require('../img/used.png')} />
												:
												null
											}
											<Image
												style={{height: 150}}
												source={{uri: voucher.image}}>
												<LinearGradient
													locations={[0, 1]}
													colors={['rgba(0, 0, 0, .75)', 'rgba(0, 0, 0, 0)']}
													style={{height: 50}}>
													<Text style={Styles.titlenewmerchant}>{voucher.title}</Text>
												</LinearGradient>
											</Image>
											<Text style={{textAlign: 'right', color: 'white', paddingRight: 10}}>{voucher.expiry}</Text>
											<View>
												{voucher.terms.map((terms, b, c) => {
													return (
														<View
															key={terms.number}
															style={[{flexDirection: 'row', padding: 10}, this.catur(b)]}>
															<Text style={{color: 'white'}}>{terms.number}</Text>
															<Text style={{flex: 1, marginLeft: 5, color: 'white'}}>{terms.condition}</Text>
														</View>
													)
												})}
											</View>
											{voucher.used ?
												null
												:
												this.btnRedeem(voucher)
											}
										</View>
									)
								})
							 	:
							 	<Wait />
							}
							
							<View style={{height: 50}} />
						</ScrollView>
						
						<ScrollView tabLabel='LOCATION'>
							
							{this.state.description.subunit ? 
								<Accordion
									style={{height: 250}}
									sections={this.state.description.subunit}
									renderHeader={this._renderHeader}
									renderContent={this._renderContent}
									underlayColor='rgba(0, 0, 0, .25)'
									logo={this.state.description.logo}
									propsState={this.props.state}
									link={this.link}
									setAlert={this.setAlert}
									mapview={this.mapview}/>
								:
								<Wait />
							}
							<View style={{height: 50}} />
						</ScrollView>
					</ScrollableTabView>
			</View>
		)
	}

	/* collapse */
	_renderHeader(section, i, isActive) {
    return (
      <View style={{flexDirection: 'row', margin: 10, alignItems: 'center'}}>
				<Image
					style={{width: 50, height: 50, borderRadius: 50}}
					source={{uri: this.logo}} />
        <Text style={{marginLeft: 5, color: 'white'}}>{section.name}</Text>
      </View>
    );
  }

  _renderContent(section, index, isActive) {
    return (
			<View style={{flex: 1}}>
				<TouchableOpacity
					style={{flexDirection: 'row', height: 50, padding: 10, backgroundColor: 'rgba(0, 0, 0, .25)', alignItems: 'center'}}
					onPress={() => this.link('tel:' + section.phone)}>
					<Icon name="phone" size={30} color="white" style={{margin: 5}}/>
					<View style={{flex: 1, borderLeftWidth: 1, borderColor: 'white'}}>
						<Text style={{color: 'white', marginLeft: 5}}>{section.phone}</Text>
					</View>
					<Icon name="chevron-right" size={30} color="white" style={{margin: 5, textAlign: 'right'}}/>
				</TouchableOpacity>
				
				<TouchableOpacity
					style={{flexDirection: 'row', height: 50, padding: 10, backgroundColor: 'rgba(0, 0, 0, .25)', alignItems: 'center', borderTopWidth: 1, borderColor: 'white'}}
					onPress={() => {
						try {
							this.propsState.initialPosition ?
							this.link('http://maps.google.com/maps?saddr=' + this.propsState.initialPosition.coords.latitude + ',' + this.propsState.initialPosition.coords.longitude + '&daddr=' + section.location.split(",")[0] + ',' + section.location.split(",")[1] + '&dirflg=d')
							:
							this.setAlert('GPS not found')
						} catch(e){}
					}}>

					<Icon name="location-on" size={30} color="white" style={{margin: 5}}/>
				
					<View style={{flex: 1, borderLeftWidth: 1, borderColor: 'white'}}>
						<Text style={{color: 'white', marginLeft: 5}}>Location</Text>
					</View>
				
					<Icon name="chevron-right" size={30} color="white" style={{margin: 5, textAlign: 'right'}}/>
				</TouchableOpacity>
				
				{this.mapview(section, index, isActive)}
			</View>
    );
  }

  mapview(section, index, isActive) {
		if(isActive) {
			return (
				<MapView 
					style={{height: 150}}
					initialRegion={{
						latitude: Number(section.location.split(",")[0]),
						longitude: Number(section.location.split(",")[1]),
						latitudeDelta: 0.0922,
						longitudeDelta: 0.0421,
					}}>
					<MapView.Marker
						coordinate={{
							latitude: Number(section.location.split(",")[0]),
							longitude: Number(section.location.split(",")[1]),
						}}
						pinColor={'red'} />
				</MapView>
			)
		}
	}
}

var Styles = StyleSheet.create({
	titlenewmerchant: {
    margin: 10,
    color: 'white',
  },
	homeheader: {
    flexDirection: 'row',
    height: 50,
    padding: 10,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, .5)',
  },
	homebutton: {
    flex: 1,
		width: 50,
		height: 35,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, .5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
})

module.exports = description;

/*
get 4 random number from 0 to x

var arr = []
while(arr.length < 4){
    var randomnumber = Math.floor(Math.random() * 6) + 0
    if(arr.indexOf(randomnumber) > -1) continue;
    arr[arr.length] = randomnumber;
}
*/