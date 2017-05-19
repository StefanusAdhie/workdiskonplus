import React, { Component } from 'react';

import {
	View,
	Text,
	TouchableOpacity,
	Image,
} from 'react-native';


class template1 extends Component {
  constructor(props) {
  	super(props);
  }

  render() {
  	const { image, title, press, type } = this.props;
  	var viewStyle, imageStyle;
  	switch(type) {
  		case 'square':
  			viewStyle = {height: 100};
  			imageStyle = {flex: 1, alignSelf: 'auto'};
  			break;
  		case 'avatar':
  			viewStyle = {height: 100, justifyContent: 'center', alignItems: 'center'};
  			imageStyle = {width: 100, height: 100, borderRadius: 50};
  			break;
  	};

  	return (
  		<View
				style={{backgroundColor: 'rgba(255, 255, 255, .25)'}}>
				<TouchableOpacity
					onPress={press}>
					<View style={viewStyle}>
						<Image style={imageStyle} source={{uri: image}} />
					</View>
					<Text style={{flex: 1, textAlign: 'center', backgroundColor: 'rgba(0, 0, 0, .25)', color: 'white'}}>{title}</Text>
				</TouchableOpacity>
			</View>
  	)
  }
}

module.exports = template1;