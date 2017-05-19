import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';

/* react native icon */
import Icon from 'react-native-vector-icons/MaterialIcons';


const FacebookTabBar = React.createClass({
  tabIcons: [],

  propTypes: {
    goToPage: React.PropTypes.func,
    activeTab: React.PropTypes.number,
    tabs: React.PropTypes.array,
  },

  componentDidMount() {
    this._listener = this.props.scrollValue.addListener(this.setAnimationValue);
  },

  setAnimationValue({ value, }) {
    this.tabIcons.forEach((icon, i) => {
      const progress = (value - i >= 0 && value - i <= 1) ? value - i : 1;
      /* custom for show hide tab */
      if(icon == null) {

      } else {
        icon.setNativeProps({
          style: {
            color: this.iconColor(progress),
          },
        });
      }
      /* */
    });
  },

  //color between rgb(59,89,152) and rgb(204,204,204)
  iconColor(progress) {
    const red = 255 + (77 - 255) * progress;
    const green = 255 + (77 - 255) * progress;
    const blue = 255 + (77 - 255) * progress;
    return `rgb(${red}, ${green}, ${blue})`;
  },

  render() {
    return <View style={[Styles.tabs, this.props.style, ]}>
      {this.props.tabs.map((tab, i) => {
        return <TouchableOpacity key={tab} onPress={() => this.props.goToPage(i)} style={this.props.activeTab === i ? Styles.tabActive : Styles.tab}>
            <Icon
              name={tab}
              size={30}
              color={this.props.activeTab === i ? 'rgb(255,255,255)' : 'rgb(77,77,77)'}
              ref={(icon) => { this.tabIcons[i] = icon; }}
            />
        </TouchableOpacity>;
      })}
    </View>;
  },
});

var Styles = StyleSheet.create({
  tabActive: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 10,

    borderBottomWidth: 2,
    borderColor: 'white',
  },
  tabs: {
    height: 45,
    flexDirection: 'row',
    paddingTop: 5,
    borderWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomColor: 'rgba(0,0,0,0.05)',

    /* custom */
    backgroundColor: 'rgba(0, 0, 0, .5)',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 10,
  },
});

export default FacebookTabBar;