import React, { Component } from 'react';

import {
	ScrollView,
	View,
	Text,
	Image,
	StyleSheet,
} from 'react-native';


class about extends Component {
  constructor(props) {
  	super(props);
  }
	
	render() {
		return (
			<View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
				<Image
					style={{width: 200, height: 200}}
					source={require('../img/diskon_plus.png')} />
				<Text style={{color: 'white'}}>Version {this.props.state._v}</Text>
				<View style={{justifyContent: 'center', alignItems: 'center', margin: 10}}>
					<Text style={{color: 'white', textAlign: 'center'}}>
						DiskonPlus is the new level of how people using discount, it's just only one click anyway from your finger "get the best deal from the best Merchant only @DiskonPlus"
					</Text>
				</View>
			</View>
		)
	}
}

var Styles = StyleSheet.create({
	
})

module.exports = about;