import React, { Component } from 'react';
import {
	Dimensions,
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
} from 'react-native';
const { width, height } = Dimensions.get('window');


class wait extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<View style={Styles.container}>
				<ActivityIndicator size='small' color='white' />
			</View>
		);
	}
};

const Styles = StyleSheet.create({
	container: {
		height: height / 4,
		justifyContent: 'center',
		alignItems: 'center',
	},
});

module.exports = wait;