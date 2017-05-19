import React, { Component } from 'react';

import {
	View,
	StatusBar,
	Image,
  StyleSheet,

  TouchableHighlight,
  Text,
  Alert,
} from 'react-native';

/* pages */
import Home from './home';


class splash extends Component {
	componentDidMount() {
		var navigator = this.props.navigator;
		setTimeout(() => {
			navigator.replace({
				component: Home,
				title: 'DiskonPlus',
			});
		}, 2000);
	}

	render() {
		return (
			<View style={Styles.splashpage}>
				<StatusBar hidden={true} animated={true} />
				<Image
					style={Styles.splashimg}
					source={require('../img/diskon_plus.png')} />
			</View>
		)
	}
};

var Styles = StyleSheet.create({
	splashpage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
		backgroundColor: 'white',
  },
  splashimg: {
    width: 200,
    height: 200,
  },
});

module.exports = splash;