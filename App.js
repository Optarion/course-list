import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  ScrollView,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  Button } from 'react-native';

import ListItem from './components/listItem';
import ResetButton from './components/resetButton';

export default class App extends React.PureComponent {
  state = {
    inputValue: '',
    items: new Map(),
    boughtItems: new Map()
  };

  onChangeText = inputValue => this.setState({inputValue})

  onSubmitItem = () => {
    this.setState(state => {
      const {items: prevItems, inputValue} = state;
      const items = new Map(prevItems);
      const id = Math.round(Math.random()*10000000).toString(); // give a proper id
      items.set(id, {id, title: inputValue});
      return {items};
    })
  }

  onPressItem = (id) => {
    return this.setState(state => {
      const boughtItems = new Map(state.boughtItems);
      boughtItems.set(id, !boughtItems.get(id));
      return {boughtItems}
    })
  }

  onChangeQuantity = (id, type) => {
    return this.setState(state => {
      const changeAmount = type === 'increment' ? 1 : -1;
      const items = new Map(state.items);
      const itemToIncrement = items.get(id);
      const itemNewQuantity = itemToIncrement.quantity
        ? itemToIncrement.quantity + changeAmount
        : 2;
      items.set(id, {id, title: itemToIncrement.title, quantity: itemNewQuantity > 1 ? itemNewQuantity : 1})
      return {items}
    })
  }

  renderListItem = ({item}) => (
    <ListItem
      id={item.id}
      title={item.title}
      quantity={item.quantity}
      isBought={this.state.boughtItems.get(item.id)}
      onPressItem={this.onPressItem}
      onChangeQuantity={this.onChangeQuantity}
    />
  );

  keyExtractor = (item, index) => item.id;

  onResetList = () => this.setState({items: new Map(), boughtItems: new Map()});

  render() {
    return (
      <View style={appStyles.container}>
        <View style={inputStyles.container}>
          <TextInput
            style={{height: 40}}
            placeholder="Type your item"
            onChangeText={this.onChangeText}
            onSubmitEditing={this.onSubmitItem}
          />
        </View>
        <FlatList
          data={[...this.state.items.values()]}
          extraData={this.state}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderListItem}
        />
        <ResetButton 
          onResetList={this.onResetList}
          />
      </View>
    );
  }
}

const appStyles = StyleSheet.create({
  container: {
    marginTop: 20,
    flex: 1,
    backgroundColor: '#fff',
    textAlign: 'center'
  },
});

const inputStyles = StyleSheet.create({
  container: {
    paddingLeft: 10,
    paddingRight: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'lightgrey',
    borderStyle: 'solid',
    margin: 10
  },
});
