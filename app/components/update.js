import React, { Component } from 'react';

import {
	ScrollView,
	View,
	Text,
	TextInput,
	TouchableOpacity,
	DatePickerAndroid,
	StyleSheet,
	Switch,
} from 'react-native';

/* pages */
import Home from './home';

import PickerNew from 'react-native-picker';


export class update extends Component {
  constructor(props) {
  	super(props);
		this.state = {
			fullname: null,
			birthday: null,
			birthdayISO: null,
			email: null,
			phone_number: null,
			oldPassword: null,
			newPassword: null,
			confirmPassword: null,

			switch: false,

			nameBorder: 'red',
			birthdayBorder: 'red',
			emailBorder: 'red',
			oldPasswordBorder: 'red',
			newPasswordBorder: 'red',
			confirmPasswordBorder: 'red',
		}
  }

  componentWillMount() {
		if(this.props.state.user != null) {
			this.setState({
				fullname: this.props.state.user.data.fullname,
				email: this.props.state.user.data.email,
				phone_number: this.props.state.user.data.phone_number,
			});
			if(this.props.state.user.data.birthday != null) {
				this.setState({
					birthday: new Date(this.props.state.user.data.birthday).toDateString(),
					birthdayISO: new Date(this.props.state.user.data.birthday)
				});
			};

			if(this.props.state.user.data.fullname != null) {
				this.setState({nameBorder: 'white'});
			};
			if(this.props.state.user.data.birthday != null) {
				this.setState({birthdayBorder: 'white'});
			};
			if(this.props.state.user.data.email != null) {
				this.setState({emailBorder: 'white'});
			};
		};
	}

	createDateData(){
    let date = [];
    for(let i = new Date().getFullYear()-100; i <= new Date().getFullYear(); i++){
      let month = [];
      for(let j = 1;j<13;j++){
          let day = [];
          if(j === 2){
              for(let k=1;k<29;k++){
                  day.push(k);
              }
              //Leap day for years that are divisible by 4, such as 2000, 2004
              if(i%4 === 0){
                  day.push(29);
              }
          }
          else if(j in {1:1, 3:1, 5:1, 7:1, 8:1, 10:1, 12:1}){
              for(let k=1;k<32;k++){
                  day.push(k);
              }
          }
          else{
              for(let k=1;k<31;k++){
                  day.push(k);
              }
          }
          let _month = {};
          _month[j] = day;
          month.push(_month);
      }
      let _date = {};
      _date[i] = month;
      date.push(_date);
  }
  return date;
}

	_showDatePicker() {
		console.log(PickerNew);
		// var date;
		this.state.birthdayISO == null ? date = new Date() : date = this.state.birthdayISO;
    PickerNew.init({
      pickerData: this.createDateData(),
      // selectedValue: [date.getFullYear().toString(), (date.getMonth() + 1).toString(), date.getDate().toString()],
      onPickerConfirm: pickedValue => {
      	var a = new Date(Number(pickedValue[0]), Number(pickedValue[1])-1, Number(pickedValue[2]));
        this.setState({birthdayBorder: 'white', birthday: new Date(a).toDateString(), birthdayISO: new Date(a)});
      },
      onPickerCancel: pickedValue => {
      },
      onPickerSelect: pickedValue => {
      	var a = new Date(Number(pickedValue[0]), Number(pickedValue[1])-1, Number(pickedValue[2]));
        this.setState({birthdayBorder: 'white', birthday: new Date(a).toDateString(), birthdayISO: new Date(a)});
      }
    });
    PickerNew.show();
	}
	
	// check input a-z A-Z and space
	validName(text) {
		var clean = text.replace( /[^a-z A-Z]+/g, '');
		this.name(clean);
	}

	name(text) {
		this.setState({fullname: text})
		if(text.length <= 3 || text.length >= 50) {
			this.setState({nameBorder: 'red'})
		} else {
			this.setState({nameBorder: 'white'})
		};
	}

	async showPicker(stateKey, options) {
		try {
			const {action, year, month, day} = await DatePickerAndroid.open({
				// Use `new Date()` for current date.
				// May 25 2020. Month 0 is January.
				date: new Date()
			});
			if(action !== DatePickerAndroid.dismissedAction) {
				// Selected year, month (0-11), day
				this.setState({birthdayBorder: 'white', birthday: new Date(year, month, day).toDateString(), birthdayISO: new Date(year, month, day)});
			}
		} catch ({code, message}) {
			this.setState({birthdayBorder: 'red'});
			// console.warn('Cannot open date picker', message);
		}
	}

	// check input just number
	validNumber(text) {
		var clean = text.replace( /[^0-9]+/g, '');
		this.number(clean);
	}
	
	number(text) {
		this.setState({phone_number: text})
	}

	// check input email type
	validEmail(text) {
		var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		this.email(re.test(text), text);
	}

	email(value, text) {
		if(value) {
			this.setState({emailBorder: 'white', email: text});
		} else {
			this.setState({emailBorder: 'red', email: text});
		}
	}

	// check min and max input
	oldPassword(text) {
		this.setState({oldPassword: text})
		if(text.length <= 7 || text.length >= 20) {
			this.setState({oldPasswordBorder: 'red'})
		} else {
			this.setState({oldPasswordBorder: 'white'})
		};
	}

	newPassword(text) {
		this.setState({newPassword: text})
		if(text.length <= 7 || text.length >= 20) {
			this.setState({newPasswordBorder: 'red'})
		} else {
			this.setState({newPasswordBorder: 'white'})
		};
	}

	confirmPassword(text) {
		this.setState({confirmPassword: text})
		if(this.state.newPassword == text) {
			this.setState({confirmPasswordBorder: 'white'})
		} else {
			this.setState({confirmPasswordBorder: 'red'})
		};
	}

	update_cs(title) {
		if(this.state.nameBorder == 'white' && this.state.birthdayBorder == 'white') {
			var header = {
        header: {
          access: this.props.state.token
        }, 
        data: {
          customers: {
            value: {
              fullname: this.state.fullname,
              birthday: this.state.birthdayISO,
              phone_number: this.state.phone_number,
            }
          }
        }
      };
      this.props.socket.emit('update_cs', header);

      this.props.navigator.pop();
		}
	}
	
	update_password(title) {
		if(this.state.oldPasswordBorder == 'white' && this.state.newPasswordBorder == 'white' && this.state.confirmPasswordBorder == 'white') {
			var header = {
				header : {
					access : this.props.state.token
				},
				data : {
					password : {
						new_password : this.state.newPassword,
						old_password : this.state.oldPassword,
					}
				}
			};
			this.props.socket.emit('update_password', header);

			this.props.navigator.pop();
		}
	}
	
	render() {
		const { state } = this.props;
		return (
			<View style={{marginTop: 55}}>
				<ScrollView style={{padding: 10}} keyboardShouldPersistTaps={true}>

					{this.state.switch ? null :
						<View>
							<View style={Styles.containerInput}>
								<View style={{flex: 1}}>
									<Text style={Styles.text}>Full Name</Text>
								</View>

								<Text style={Styles.text}>* : </Text>
								<TextInput
									ref='fullname'
									underlineColorAndroid={this.state.nameBorder}
									style={Styles.textInput}
									placeholderTextColor='white'
									autoCapitalize='words'
									onChangeText={(text) => this.validName(text)}
									onFocus={() => PickerNew.hide()}
									value={this.state.fullname}
									returnKeyType='next'
									onSubmitEditing={() => {this.refs['birthday'].focus()}} />
							</View>

							<View style={Styles.containerInput}>
								<View style={{flex: 1}}>
									<Text style={Styles.text}>Birthday</Text>
								</View>

								<Text style={Styles.text}>* : </Text>
								<TextInput
									ref='birthday'
									underlineColorAndroid={this.state.birthdayBorder}
									style={Styles.textInput}
									placeholderTextColor='white'
									onFocus={this.showPicker.bind(this)}
									value={this.state.birthday}
									returnKeyType='next'
									onSubmitEditing={() => this.refs['phone_number'].focus()} />
							</View>

							<View style={Styles.containerInput}>
								<View style={{flex: 1}}>
									<Text style={Styles.text}>Phone Number</Text>
								</View>

								<Text style={Styles.text}>  : </Text>
								<TextInput
									ref='phone_number'
									underlineColorAndroid='white'
									style={Styles.textInput}
									placeholderTextColor='white'
									keyboardType="numeric"
									onChangeText={(text) => this.validNumber(text)}
									onFocus={() => PickerNew.hide()}
									value={this.state.phone_number}
									returnKeyType='next'
									onSubmitEditing={() => this.update_cs('update_cs')} />
							</View>
						</View>
					}

					{this.state.switch ?
						<View>
							<View style={Styles.containerInput}>
								<View style={{flex: 1}}>
									<Text style={Styles.text}>Old Password</Text>
								</View>

								<Text style={Styles.text}>  : </Text>
								<TextInput
									ref='oldPassword'
									underlineColorAndroid={this.state.oldPasswordBorder}
									style={Styles.textInput}
									placeholderTextColor='white'
									secureTextEntry={true}
									onChangeText={(text) => this.oldPassword(text)}
									value={this.state.oldPassword}
									returnKeyType='next'
									onSubmitEditing={() => this.refs['newPassword'].focus()} />
							</View>

							<View style={Styles.containerInput}>
								<View style={{flex: 1}}>
									<Text style={Styles.text}>New Password</Text>
								</View>

								<Text style={Styles.text}>  : </Text>
								<TextInput
									ref='newPassword'
									underlineColorAndroid={this.state.newPasswordBorder}
									style={Styles.textInput}
									placeholderTextColor='white'
									secureTextEntry={true}
									onChangeText={(text) => this.newPassword(text)}
									value={this.state.newPassword}
									returnKeyType='next'
									onSubmitEditing={() => this.refs['confirmPassword'].focus()} />
							</View>

							<View style={Styles.containerInput}>
								<View style={{flex: 1}}>
									<Text style={Styles.text}>Confirm Password</Text>
								</View>

								<Text style={Styles.text}>  : </Text>
								<TextInput
									ref='confirmPassword'
									underlineColorAndroid={this.state.confirmPasswordBorder}
									style={Styles.textInput}
									placeholderTextColor='white'
									secureTextEntry={true}
									onChangeText={(text) => this.confirmPassword(text)}
									value={this.state.confirmPassword}
									returnKeyType='next'
									onSubmitEditing={() => this.update_password('update_password')} />
							</View>
						</View>
						: null
					}

					{state.user.header.social ? null :
						<View style={Styles.containerInput}>
							<View style={{flex: 1}}>
								<Text style={Styles.text}>Change Password</Text>
							</View>

							<Text style={Styles.text}>  : </Text>
							<View style={{flex: 3, alignItems: 'flex-start'}}>
								<Switch
				          onValueChange={(value) => this.setState({switch: value})}
				          value={this.state.switch} />
			         </View>
						</View>
					}

					<View style={{justifyContent: 'center', alignItems: 'center', padding: 10}}>
						{this.state.switch ?
							(this.state.oldPasswordBorder == 'white' && this.state.newPasswordBorder == 'white' && this.state.confirmPasswordBorder == 'white') ?
							<TouchableOpacity
								style={{width: 150, height: 50, borderRadius: 10, backgroundColor: '#a540e4', justifyContent: 'center', alignItems: 'center'}}
								onPress={() => this.update_password('update_password')}>
								<Text style={Styles.text}>Submit</Text>
							</TouchableOpacity> :

							<View
								style={{width: 150, height: 50, borderRadius: 10, backgroundColor: 'rgba(255, 255, 255, .5)', justifyContent: 'center', alignItems: 'center'}}>
								<Text style={Styles.text}>Submit</Text>
							</View>
							:
							(this.state.nameBorder == 'white' && this.state.birthdayBorder == 'white') ?
							<TouchableOpacity
								style={{width: 150, height: 50, borderRadius: 10, backgroundColor: '#a540e4', justifyContent: 'center', alignItems: 'center'}}
								onPress={() => this.update_cs('update_cs')}>
								<Text style={Styles.text}>Submit</Text>
							</TouchableOpacity> :

							<View
								style={{width: 150, height: 50, borderRadius: 10, backgroundColor: 'rgba(255, 255, 255, .5)', justifyContent: 'center', alignItems: 'center'}}>
								<Text style={Styles.text}>Submit</Text>
							</View>
						}
					</View>
				</ScrollView>
			</View>
		)
	}
}

var Styles = StyleSheet.create({
	containerInput: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	textInput: {
		flex: 3,
		color: 'white',
	},
	text: {
		color: 'white',
	},
})

module.exports = update;