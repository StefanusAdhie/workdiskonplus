import React, { Component } from 'react';

import {
	View,
	Text,
	TouchableOpacity,
	Image,
} from 'react-native';


class template2 extends Component {
  constructor(props) {
  	super(props);
  }

  render() {
  	const { press, image, title, category, note, description } = this.props;
  	return (
  		<TouchableOpacity onPress={press}
				style={{flexDirection: 'row', height: 70, margin: 10, borderBottomWidth: 1, borderBottomColor: 'white'}}>
				<Image
					style={{width: 50, height: 50, borderRadius: 50}}
					source={{uri: image}} />
				<View style={{flex: 1, flexDirection: 'column', marginLeft: 5}}>
					<View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
						<View style={{justifyContent: 'center'}}>
							<Text style={{color: 'white'}}>{title}</Text>
							<Text style={{color: 'white'}}>{category}</Text>
						</View>
						<Text style={{flex: 2, textAlign:'right', color: 'maroon'}}>{note}</Text>
					</View>
					<Text style={{flex: 1, color: 'white'}} numberOfLines={1}>{description}</Text>
				</View>
			</TouchableOpacity>
  	)
  }
}

module.exports = template2;