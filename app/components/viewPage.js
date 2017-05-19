import React, { Component } from 'react';

import {
	Dimensions,
	ScrollView,
	View,
	Text,
	Image,
	TouchableOpacity,
	StyleSheet,
} from 'react-native';
const { width, height } = Dimensions.get('window');

/* react native linear gradient */
import LinearGradient from 'react-native-linear-gradient';


export default class viewPage extends Component {
  constructor(props) {
  	super(props);
  }
	
	render() {
		const { data } = this.props;
		return (
			<View style={{flex: 1}}>
				<Image
					style={{height: height/3, alignItems: 'stretch', marginBottom: 10}}
					source={{uri: data.image}}>
					<LinearGradient
						locations={[0, 1]}
						colors={['rgba(0, 0, 0, .75)', 'rgba(0, 0, 0, 0)']}
						style={{height: 70, position: 'absolute', top: 0, left: 0, right: 0}}/>
				</Image>

				<ScrollView keyboardShouldPersistTaps={true}>
					<View style={{padding: 10, backgroundColor: 'rgba(0, 0, 0, .25)'}}>
						<Text style={{color: 'white'}}>
							{data.content ? data.content : data.description}
						</Text>
					</View>
				</ScrollView>
			</View>
		)
	}
}

var Styles = StyleSheet.create({
	
})