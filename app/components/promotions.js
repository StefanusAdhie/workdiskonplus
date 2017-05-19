import React, { Component } from 'react';

import {
	Alert,
	ScrollView,
	View,
	Text,
	TouchableOpacity,
	Image,
	ActivityIndicator,
	Modal,
} from 'react-native';

/* pages */
import Template2 from './template2';
import Description from './description';
import ViewPage from './viewPage';
import Wait from './wait';


export class promotions extends Component {
  constructor(props) {
  	super(props);
  	this.state = {
  		More_HotPromo: null,
  	}
  }

  componentWillUnmount() {
    this.props.socket.removeListener('More_HotPromo');
  }

  componentDidMount() {
  	this.props.socket.on('More_HotPromo', (data) => {
			switch(data.header.status) {
				case 200:
					this.setState({More_HotPromo: data.data});
					break;
				default:
					this.setAlert(data.header.message);
					break;
			};
		});
  }

  setAlert(text) {
		Alert.alert(
			null,
			text,
			[
				{text: 'OK'},
			]
		);
	}

	nav(a) {
		/*this.props.navigator.push({
  		component: Description,
  		title: a,
  	});*/

  	this.props.navigator.push({
			component: ViewPage,
			title: a.title,
			passProps: {data: a},
		});
	}

	render() {
		return (
			<View style={{marginTop: 55}}>
				
				{this.state.More_HotPromo ?
					<ScrollView style={{flex: 1, flexDirection: 'column'}}>
						{this.state.More_HotPromo.map((a, b, c) => {
							return (
								<Template2
									key={c[b]._id}
									image={c[b].image}
									title={c[b].nm_merchants}
									category={c[b].category}
									note={c[b].title}
									description={c[b].description}
									press={() => {
										this.nav(c[b])
										this.props.socket.emit('Show_HotPromoDetails', {header: {access: this.props.state.token}, data: {HotPromoSet: {_id: c[b]._id}}});
									}} />
							)
						})}
					</ScrollView>
					:
					<Wait />
				}

			</View>
		)
	}
}

module.exports = promotions;