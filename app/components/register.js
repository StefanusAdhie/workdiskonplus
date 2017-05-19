import React, { Component } from 'react';

import {
	ScrollView,
	View,
	Text,
	TextInput,
	TouchableOpacity,
	DatePickerAndroid,
	StyleSheet,
	Alert,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import PickerNew from 'react-native-picker';


function createDateData(){
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
};


export class register extends Component {
  constructor(props) {
  	super(props);
		this.state = {
			fullname: null,
			birthday: null,
			email: null,
			phone_number: null,
			password: null,
			confirmPassword: null,

			nameBorder: 'red',
			birthdayBorder: 'red',
			emailBorder: 'red',
			passwordBorder: 'red',
			confirmPasswordBorder: 'red',
		}
  }

  _showDatePicker() {
    PickerNew.init({
      pickerData: createDateData(),
      selectedValue: [new Date().getFullYear().toString(), (new Date().getMonth() + 1).toString(), new Date().getDate().toString()],
      onPickerConfirm: pickedValue => {
      	var a = new Date(Number(pickedValue[0]), Number(pickedValue[1])-1, Number(pickedValue[2]));
        console.log('date', pickedValue);
        this.setState({birthdayBorder: 'white', birthday: new Date(a).toDateString(), birthdayISO: new Date(a)});
      },
      onPickerCancel: pickedValue => {
        console.log('date', pickedValue);
      },
      onPickerSelect: pickedValue => {
      	var a = new Date(Number(pickedValue[0]), Number(pickedValue[1])-1, Number(pickedValue[2]));
        console.log('date', pickedValue, a);
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
				console.log(year, month, day);
				this.setState({birthdayBorder: 'white', birthday: new Date(year, month, day).toDateString(), birthdayISO: new Date(year, month, day)});
			}
		} catch ({code, message}) {
			this.setState({birthdayBorder: 'red'});
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
	password(text) {
		this.setState({password: text})
		if(text.length <= 7 || text.length >= 20) {
			this.setState({passwordBorder: 'red'})
		} else {
			this.setState({passwordBorder: 'white'})
		};
	}

	confirmPassword(text) {
		this.setState({confirmPassword: text})
		if(this.state.password == text) {
			this.setState({confirmPasswordBorder: 'white'})
		} else {
			this.setState({confirmPasswordBorder: 'red'})
		};
	}
	
	submit(title) {
		if((this.state.nameBorder && this.state.birthdayBorder && this.state.emailBorder && this.state.passwordBorder && this.state.confirmPasswordBorder) == 'white') {
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
              email: this.state.email,
              password: this.state.password,
              auth: {
                type: 1
              }
            }
          }
        }
      };
			this.props.navigator.pop();
      this.props.socket.emit('registered_account', header);
		} else {
			Alert.alert(
				null,
				'please complete your form',
				[
					{text: 'OK'},
				]
			);
		};
	}

	render() {
		const { state, actions } = this.props;
		return (
			<View style={{marginTop: 55}}>

				<ScrollView style={{padding: 10}} keyboardShouldPersistTaps={true}>
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
							onFocus={() => PickerNew.hide()}
							onChangeText={(text) => this.validName(text)}
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
							onSubmitEditing={() => {this.refs['phone_number'].focus()}} />
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
							onFocus={() => PickerNew.hide()}
							onChangeText={(text) => this.validNumber(text)}
							returnKeyType='next'
							onSubmitEditing={() => this.refs['email'].focus()} />
					</View>

					<View style={Styles.containerInput}>
						<View style={{flex: 1}}>
							<Text style={Styles.text}>Email</Text>
						</View>

						<Text style={Styles.text}>* : </Text>
						<TextInput
							ref='email'
							underlineColorAndroid={this.state.emailBorder}
							style={Styles.textInput}
							placeholderTextColor='white'
							keyboardType="email-address"
							onChangeText={(text) => this.validEmail(text)}
							returnKeyType='next'
							onSubmitEditing={() => this.refs['password'].focus()} />
					</View>

					<View style={Styles.containerInput}>
						<View style={{flex: 1}}>
							<Text style={Styles.text}>Password</Text>
						</View>

						<Text style={Styles.text}>* : </Text>
						<TextInput
							ref='password'
							underlineColorAndroid={this.state.passwordBorder}
							style={Styles.textInput}
							placeholderTextColor='white'
							secureTextEntry={true}
							onChangeText={(text) => this.password(text)}
							returnKeyType='next'
							onSubmitEditing={() => this.refs['confirmPassword'].focus()} />
					</View>

					<View style={Styles.containerInput}>
						<View style={{flex: 1}}>
							<Text style={Styles.text}>Confirm Password</Text>
						</View>

						<Text style={Styles.text}>* : </Text>
						<TextInput
							ref='confirmPassword'
							underlineColorAndroid={this.state.confirmPasswordBorder}
							style={Styles.textInput}
							placeholderTextColor='white'
							secureTextEntry={true}
							onChangeText={(text) => this.confirmPassword(text)}
							returnKeyType='done'
							onSubmitEditing={() => this.submit('Sign Up')} />
					</View>

					<View style={{justifyContent: 'center', alignItems: 'center', padding: 10}}>
						{
							(this.state.nameBorder == 'white' && this.state.birthdayBorder == 'white' && this.state.emailBorder == 'white' && this.state.passwordBorder == 'white' && this.state.confirmPasswordBorder == 'white') ?
							<TouchableOpacity
								style={{width: 150, height: 50, borderRadius: 10, backgroundColor: '#a540e4', justifyContent: 'center', alignItems: 'center'}}
								onPress={() => this.submit('Sign Up')}>
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

module.exports = register;