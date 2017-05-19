import React, { Component } from 'react';

import {
	Dimensions,
	StatusBar,
	ScrollView,
	View,
	StyleSheet,
} from 'react-native';
const { width, height } = Dimensions.get('window');

/* pages */
import PopupLogin from './popupLogin';
import Wait from './wait';

import Login from './login';
import Register from './register';
import Banner from './banner';
import NewMerchants from './newMerchants';
import HotPromotions from './hotPromotions';
import Category from './category';
import FacebookTabBar from './FacebookTabBar';

/* react native scrollable tab view */
import ScrollableTabView from 'react-native-scrollable-tab-view';
/* react native system notification */
import Notification from 'react-native-system-notification';
/* react native fcm */
import FCM from 'react-native-fcm';


class home extends Component {
  constructor(props) {
  	super(props);
  }

  componentDidMount() {
    /* react native fcm */
    this.notificationUnsubscribe = FCM.on('notification', (notif) => {
        // there are two parts of notif. notif.notification contains the notification payload, notif.data contains data payload
        if(notif.local_notification){
          //this is a local notification
        };
        if(notif.opened_from_tray){
          //app is open/resumed because user clicked banner
        } else {
        	Notification.create({
		        subject: notif.title,
		        message: notif.body,
		        smallIcon: 'diskon_plus',
		      });
        };
    });
    this.refreshUnsubscribe = FCM.on('refreshToken', (token) => {
        // fcm token may not be available on first load, catch it here
    });
	}

	titleTab(i) {
		switch(i) {
			case 0:
				this.setState({title: 'Rekor'});
				break;
			case 1:
				this.setState({title: 'Yang Akan'});
				break;
			case 2:
				this.setState({title: 'Yang Lalu'});
				break;
			case 3:
				this.setState({title: 'My Race'});
				break;
			case 4:
				this.setState({title: 'My Event'});
				break;
			default:
				this.setState({title: 'Rekor'});
				break;
		}
	}
	
	render() {
		const { navigator, state, socket } = this.props;
		return (
			<View style={{marginTop: 55, flex: 1}}>
				<StatusBar  backgroundColor='rgba(165, 64, 228, 0.5)' animated={true} />

				<PopupLogin navigator={navigator} state={state} socket={socket} style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, height: height}} />
				
				<ScrollView>
					<ScrollableTabView
						// onChangeTab={(e) => this.titleTab(e.i)}
						renderTabBar={() => <FacebookTabBar />} >
						<View tabLabel='brightness-high' style={Styles.Tab}>
							{state.newMerchants ?
					  		<NewMerchants state={state.newMerchants} navigator={this.props.navigator} socket={socket} />
						  	:
								<Wait />
							}
						</View>

						<View tabLabel='whatshot' style={Styles.Tab}>
							{state.hotPromotions ?
								<HotPromotions state={state.hotPromotions} navigator={this.props.navigator} socket={socket} />
				  			:
								<Wait />
							}
						</View>

						<View tabLabel='layers' style={Styles.Tab}>
							{state.category ?
								<Category state={state.category} navigator={this.props.navigator} socket={socket} />
								:
								<Wait />
							}
						</View>
					</ScrollableTabView>

					<View style={Styles.homebanner}>
						{state.banner ?
							<Banner state={state.banner} navigator={this.props.navigator} socket={socket} />
							:
							<Wait />
						}
					</View>
				</ScrollView>
			</View>
		)
	}
};

var Styles = StyleSheet.create({
  homebanner: {
  	width: width,
    height: height / 2.5,
    position: 'absolute',
    marginTop: 45,

    /*borderWidth: 1,
    borderColor: 'green',*/
  },
  Tab: {
  	marginTop: height / 2.5,

  	/*borderWidth: 1,
  	borderColor: 'green',*/
  },
});

module.exports = home;