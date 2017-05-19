import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';


class badge extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const { state } = this.props;
		return (
			<View style={Styles.badge}>
				<Text style={Styles.text}>{state}</Text>
			</View>
		);
	}
};

const Styles = StyleSheet.create({
	text: {
		color: 'white',
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
	},
});

module.exports = badge;