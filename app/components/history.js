import React, { Component } from 'react';

import {
	Alert,
	ScrollView,
	View,
	Text,
	Image,
	TouchableOpacity,
	StyleSheet,
} from 'react-native';

/* pages */
import Template2 from './template2';
import Wait from './wait';


class history extends Component {
  constructor(props) {
  	super(props);
  	this.state = {
  		history: null,
  	}
  }

  componentWillUnmount() {
    this.props.socket.removeListener('history_redem');
  }

  componentDidMount() {
  	this.props.socket.on('history_redem', (data) => {
			switch(data.header.status) {
				case 200:
					this.setState({history: data.data});
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
	
	render() {
		return (
			<View style={{marginTop: 55}}>
				
				{this.state.history ?
					<ScrollView style={{flexDirection: 'column'}}>
						{this.state.history.map((a, b, c) => {
							return (
								<Template2
									key={c[b]._id}
									press={() => console.log()}
									image={c[b].image}
									title={c[b].merchants}
									category={new Date(c[b].date).toDateString()}
									description={c[b].voucher} />
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

var Styles = StyleSheet.create({
	
})

module.exports = history;