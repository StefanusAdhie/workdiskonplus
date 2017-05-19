import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

import ViewPage from './viewPage';


const HotPromotions = React.createClass({
	newNav(data) {
		this.props.navigator.push({
			component: ViewPage,
			title: data.title,
			passProps: {data: data},
		});
	},

	render() {
		const { state, socket } = this.props;
		return (
			<View style={{flexDirection: 'row'}}>
				<View style={{flex: 1, backgroundColor: 'rgba(255, 255, 255, .25)'}}>
					{state.map((a, b, c) => {
						if(b%2 == 0) {
							return (
								<View
									key={c[b]._id}
									style={{flex: 1, padding: 10}}>
									<TouchableOpacity
										onPress={() => this.newNav(a)}>
										<View style={{flexDirection: 'row', borderBottomWidth: 1, borderColor: 'white'}}>
											<View style={{flex: 1}}>
												<Text style={{color: 'white'}}>{c[b].nm_merchants}</Text>
												<Text style={{color: 'white'}}>{c[b].category}</Text>
											</View>
											<Image
												style={{width: 50, height: 50, borderRadius: 50}}
												source={{uri: c[b].image}}/>
										</View>
										<Text numberOfLines={3} style={{color: 'white'}}>{c[b].description}</Text>
										<Text style={{fontWeight: 'bold', textAlign: 'center', marginTop: 5, color: 'white'}}>{c[b].title}</Text>
									</TouchableOpacity>
								</View>
							);
						}
					})}
				</View>
			</View>
		)
	}
});

export default HotPromotions;