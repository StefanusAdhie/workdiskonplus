import React from 'react';
import { 
	View,
	Image,
	TouchableOpacity,
	Dimensions,
	StyleSheet,
} from 'react-native';
const { width, height } = Dimensions.get('window');

import Description from './description';

/* react native carousel */
var Carousel = require('react-native-carousel');


const Banner = React.createClass({
	nav(component, title) {
		this.props.navigator.push({
			component: component,
			title: title,
		});
	},

	render() {
		const { state, socket } = this.props;
		return (
			<Carousel
				delay={5000}
				indicatorSize={25}
				indicatorOffset={5}
				loop={true}>
				{state.map((banner) => {
					return (
						<TouchableOpacity
							key={banner._id}
							style={Styles.homecarousel}
							activeOpacity={0.8}
							onPress={() => {
								this.nav(Description, banner.nm_merchants);
								socket.emit('Show_BannerDetails', {header: {access: state.token}, data: {BannerSet: {_id: banner._id}}});
							}}>
							<Image
							style={Styles.image}
							source={{uri: banner.image}} />
						</TouchableOpacity>
					)
				})}
			</Carousel>
		)
	}
});

var Styles = StyleSheet.create({
	homecarousel: {
    height: height / 2.5,

    /*borderWidth: 1,
    borderColor: 'green',*/
  },
  image: {
  	flex: 1,
  	alignSelf: 'auto',
  },
})

export default Banner;