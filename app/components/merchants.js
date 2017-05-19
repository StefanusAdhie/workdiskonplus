import React, { Component } from 'react';

import {
	Alert,
	ScrollView,
	View,
	Text,
	TouchableOpacity,
	ListView,
	Image,
	TextInput,
	ActivityIndicator,
	Modal,
} from 'react-native';

/* pages */
import Template1 from './template1';
import Description from './description';
import Wait from './wait';


class merchants extends Component {
  constructor(props) {
  	super(props);
		this.state = {
			title: null,
			content: null,
		}
  }

  componentWillUnmount() {
    this.props.socket.removeListener('Show_CategoryMerchants');
    this.props.socket.removeListener('More_NewMerchants');
    this.props.socket.removeListener('search_box');
  }

  componentDidMount() {
		if(this.scrollView) {
			setTimeout(() => this.scrollView.getScrollResponder().scrollTo({y: this.state.y, animated: true}), 0)
		};

		this.props.socket.on('Show_CategoryMerchants', (data) => {
  		switch(data.header.status){
				case 200:
					this.setState({content: data.data, title: 'show_merchants_details'});
					break;
				default:
					this.setAlert(data.header.message);
					break;
			};
		});

		this.props.socket.on('More_NewMerchants', (data) => {
			switch(data.header.status) {
				case 200:
					this.setState({content: data.data, title: 'Show_NewMerchantsDetails'});
					break;
				default:
					this.setAlert(data.header.message);
					break;
			};
		});

		this.props.socket.on('search_box', (data) => {
			switch(data.header.status) {
				case 200:
					this.setState({content: data.data, title: 'show_merchants_details'});
					break;
				default :
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

	detail(a) {
		this.props.navigator.push({
  		component: Description,
  		title: a.nm_merchants,
  	});

		switch(this.state.title) {
			case 'show_merchants_details':
				var header = {
					header: {
						access: this.props.state.token
					}, 
					data: {
						merchants: {
							_id: a.code_merchants
						}
					}
				};
				this.props.socket.emit('show_merchants_details', header);
				break;
			case 'Show_NewMerchantsDetails':
				var header = {
					header: {
						access: this.props.state.token
					}, data: {
						NewMerchantsSet: {
							_id: a._id
						}
					}
				};
				this.props.socket.emit('Show_NewMerchantsDetails', header);
				break;
		};
	}
	
	render() {
		return (
			<View style={{marginTop: 55, flex: 1}}>
				<ScrollView 
					ref={ref => this.scrollView = ref}
					onScroll={(a) => this.setState({y: a.nativeEvent.contentOffset.y})}
					style={{flex: 1, flexDirection: 'column'}}>
					{this.state.content ?
						<View style={{flex: 1, flexDirection: 'row'}}>
							<View
								style={{flex: 1, margin: 10}}>
								{this.state.content.map((a, b, c) => {
									if(b%2 == 0) {
										return (
											<View key={c[b].code_merchants} style={{marginBottom: 20}}>
												<Template1
													image={c[b].logo}
													title={c[b].nm_merchants}
													type='square'
													press={() => this.detail(c[b])}
												/>
											</View>
										)
									}
								})}
							</View>
							<View style={{flex: 1, margin: 10}}>
								{this.state.content.map((a, b, c) => {
									if(b%2 == 1) {
										return (
											<View key={c[b].code_merchants} style={{marginBottom: 20}}>
												<Template1
													image={c[b].logo}
													title={c[b].nm_merchants}
													type='square'
													press={() => this.detail(c[b])}
												/>
											</View>
										)
									}
								})}
							</View>
						</View>
						:
						<Wait />
					}
				</ScrollView>
			</View>
		)
	}
}

module.exports = merchants;