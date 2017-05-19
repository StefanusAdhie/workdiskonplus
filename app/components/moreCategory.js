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
import Merchants from './merchants';


export class moreCategory extends Component {
  constructor(props) {
  	super(props);
  	this.state = {
  		More_Category: null,
  	}
  }

  componentWillUnmount() {
    this.props.socket.removeListener('More_Category');
  }

  componentDidMount() {
  	this.props.socket.on('More_Category', (data) => {
			switch(data.header.status) {
				case 200:
					this.setState({More_Category: data.data});
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
	
	render() {
		return (
			<View style={{marginTop: 55}}>
				
				{this.state.More_Category ?
					<ScrollView style={{flex: 1, flexDirection: 'column'}}>
						<View style={{flex: 1, flexDirection: 'row'}}>
							<View
								style={{flex: 1, margin: 10}}>
								{this.state.More_Category.map((a, b, c) => {
									if(b%2 == 0) {
										return (
											<Template1
												key={c[b]._id}
												image={c[b].image}
												title={c[b].title}
												type='avatar'
												press={() => {
													this.props.navigator.push({component: Merchants, title: c[b].title})
													this.props.socket.emit('Show_CategoryMerchants', {header: {access: this.props.state.token}, data: {CategoryMerchants: {_id: c[b]._id}}});
												}} />
										)
									}
								})}
							</View>
							<View style={{flex: 1, margin: 10}}>
								{this.state.More_Category.map((a, b, c) => {
									if(b%2 == 1) {
										return (
											<Template1
												key={c[b]._id}
												image={c[b].image}
												title={c[b].title}
												type='avatar'
												press={() => {
													this.props.navigator.push({component: Merchants, title: c[b].title})
													this.props.socket.emit('Show_CategoryMerchants', {header: {access: this.props.state.token}, data: {CategoryMerchants: {_id: c[b]._id}}});
												}} />
										)
									}
								})}
							</View>
						</View>
					</ScrollView>
					:
					null
		  	}

			</View>
		)
	}
}

module.exports = moreCategory;