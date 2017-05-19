import React, { Component } from 'react';

import {
	AsyncStorage,
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
import ViewPage from './viewPage';
import Wait from './wait';

/* react native android badge */
import BadgeAndroid from 'react-native-android-badge';
/* react native swipeout */
var Swipeout = require('react-native-swipeout')


class inbox extends Component {
  constructor(props) {
  	super(props);
  	this.state = {
  		inbox: null,
  	}
  }

  componentWillUnmount() {
    this.props.socket.removeListener('get_inbox');
  }

  componentDidMount() {
  	this.props.socket.on('get_inbox', (data) => {
			switch(data.header.status) {
				case 200:
					this.setState({inbox: data.data});
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

	readInbox(data) {
		if(this.props.state.readInbox.length == 0) {
			this.props.state.readInbox.push(data._id);
		} else {
			for(var a in this.props.state.readInbox) {
				if(this.props.state.readInbox[a] != data._id) {
					this.props.state.readInbox.push(data._id);
				};
			};
		};
		
		this._setItem('readInbox', this.props.state.readInbox);
		this.props.state.countInbox = this.state.inbox.length - this.props.state.readInbox.length;
		BadgeAndroid.setBadge(this.props.state.countInbox);

		this.props.navigator.push({
			component: ViewPage,
			title: data.title,
			passProps: {data: data},
		});
		this.setState({update: true});
	}

	async _setItem(key, data) {
		try {
			await AsyncStorage.setItem(key, data.toString());
		} catch(err) {
		};
	}

	deleteInbox(data) {
		if(this.props.state.deleteInbox.length == 0) {
			this.props.state.deleteInbox.push(data._id);
		} else {
			for(var a in this.props.state.deleteInbox) {
				if(this.props.state.deleteInbox[a] != data._id) {
					this.props.state.deleteInbox.push(data._id);
				};
			};
		};
		data.value = true;
		this._setItem('deleteInbox', this.props.state.deleteInbox);
		if(this.props.state.readInbox.length < this.props.state.deleteInbox.length) {
			this.props.state.countInbox = this.state.inbox.length - this.props.state.deleteInbox.length;
			BadgeAndroid.setBadge(this.props.state.countInbox);
		};
		this.setState({update: true});
	}
	
	render() {
		return (
			<View style={{marginTop: 55}}>
				{this.state.inbox ?
					<ScrollView style={{flexDirection: 'column'}}>
						{this.state.inbox.map((a, b, c) => {
							var swipeoutBtns = [
							  {
							    text: 'Delete', backgroundColor: 'red', onPress:() => this.deleteInbox(a)
							  }
							]

							var notes = '*';
							for(var i in this.props.state.readInbox) {
								if(a._id == this.props.state.readInbox[i]) {
									notes = '';
								};
							};

							for(var i in this.props.state.deleteInbox) {
								if(a._id == this.props.state.deleteInbox[i]) {
									return null;
								};
							};
							return (
								<Swipeout
									key={c[b]._id}
									right={swipeoutBtns}
									autoClose={true}
									backgroundColor='transparent'>
									
									{a.value ? null :
										<Template2
											press={() => this.readInbox(a)}
											image={c[b].image}
											title={c[b].title}
											description={c[b].content}
											note={notes} />
									}
									
								</Swipeout>
							);
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

module.exports = inbox;