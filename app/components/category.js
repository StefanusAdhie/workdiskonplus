import React from 'react';
import { View } from 'react-native';

import Template1 from './template1';
import Merchants from './merchants';


const Category = React.createClass({
	nav(component, title) {
		this.props.navigator.push({
			component: component,
			title: title,
		});
	},

	render() {
		const { state, socket } = this.props;
		return (
			<View style={{flexDirection: 'row'}}>
				<View style={{flex: 1}}>
					{state.map((a, b, c) => {
						if(b % 2 == 0) {
							return (
								<Template1
									key={c[b]._id}
									image={c[b].image}
									title={c[b].title}
									type='avatar'
									press={() => {
										this.nav(Merchants, c[b].title);
										socket.emit('Show_CategoryMerchants', {header: {access: state.token}, data: {CategoryMerchants: {_id: c[b]._id}}});
									}}
								/>
							)
						}
					})}
				</View>
				<View style={{flex: 1}}>
					{state.map((a, b, c) => {
						if(b % 2 == 1) {
							return (
								<Template1
									key={c[b]._id}
									image={c[b].image}
									title={c[b].title}
									type='avatar'
									press={() => {
										this.nav(Merchants, c[b].title);
										socket.emit('Show_CategoryMerchants', {header: {access: state.token}, data: {CategoryMerchants: {_id: c[b]._id}}});
									}}
								/>
							)
						}
					})}
				</View>
				{/*<View style={{flex: 1}}>
					{state.map((a, b, c) => {
						if(b % 3 == 2) {
							return (
								<Template1
									key={c[b]._id}
									image={c[b].image}
									title={c[b].title}
									type='avatar'
									press={() => {
										this.nav(Merchants, c[b].title);
										socket.emit('Show_CategoryMerchants', {header: {access: state.token}, data: {CategoryMerchants: {_id: c[b]._id}}});
									}}
								/>
							)
						}
					})}
				</View>*/}
			</View>
		)
	}
});

export default Category;