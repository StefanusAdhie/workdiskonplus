import React, { Component } from 'react';
import { 
	View,
	Text,
	Image,
	TouchableOpacity,
	Animated,
	Easing,
	Dimensions,
	StyleSheet,
} from 'react-native';
const { width, height } = Dimensions.get('window');

import Description from './description';

/* react native linear gradient */
import LinearGradient from 'react-native-linear-gradient';


class NewMerchants extends Component {
	constructor() {
		super();
  	this.animatedValue = new Animated.Value(0);
  }

	componentDidMount() {
		/* animation marquee */
    this.animate();
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

	nav(component, title) {
		this.props.navigator.push({
			component: component,
			title: title,
		});
	}

	render() {
		const marginLeft = this.animatedValue.interpolate({
	    inputRange: [0, 1],
	    outputRange: [width, -width/2]
	  })
		const { state, socket } = this.props;
		return (
			<View>
				{state.map((merchant, a) => {
	  			return(
				  	<TouchableOpacity
						key={merchant._id}
						activeOpacity={0.8}
						onPress={() => {
							this.nav(Description, merchant.nm_merchants);
							socket.emit('Show_NewMerchantsDetails', {header: {access: state.token}, data: {NewMerchantsSet: {_id: merchant._id}}});
						}}
						style={Styles.newMerchants}>
							<Image
								style={Styles.image}
								source={{uri: merchant.logo}}>
								<View style={Styles.headernewmerchant}>
									<View style={{flex: 1}}>
							      <Animated.View
							        style={{
							          marginLeft,
							          height: 30,
							          width: width,
							          justifyContent: 'center',
							          backgroundColor: 'transparent'}} >
							        <Text style={{color: 'white', fontSize: 19}}>{merchant.nm_merchants}</Text>
							      </Animated.View>
							    </View>
								</View>
								
								<LinearGradient
									locations={[0, 1]}
									colors={['rgba(0, 0, 0, .1)', 'rgba(0, 0, 0, 1)']}
									style={{height: 50, position: 'absolute', left: 0, right: 0, bottom: 0}}>
									<View style={{flex: 1}}>
							      <Animated.View
							        style={{
							          marginLeft,
							          height: 30,
							          width: width,
							          justifyContent: 'center',
							          backgroundColor: 'transparent'}} >
							        <Text style={{color: 'white', fontSize: 15}}>{merchant.running}</Text>
							      </Animated.View>
							    </View>
								</LinearGradient>
							</Image>
				  	</TouchableOpacity>
			  	)
	  		})}
	  	</View>
		)
	}
};

var Styles = StyleSheet.create({
	newMerchants: {
    flex: 1,
    height: height / 2.5,
  },
  image: {
  	flex: 1,
  	alignSelf: 'auto',
  },
  headernewmerchant: {
    width: width,
    height: 30,
    backgroundColor: 'black',
  },
});

module.exports = NewMerchants;