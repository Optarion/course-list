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


class ListItem extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    title: PropTypes.string,
    quantity: PropTypes.number,
    isBought: PropTypes.bool,
    onPressItem: PropTypes.func,
    onChangeQuantity: PropTypes.func,
  }

  render() {
    const {id, title, quantity, isBought, onPressItem, onChangeQuantity} = this.props;
    const color = isBought ? 'lightgrey' : 'black';
    const textDecorationLine = isBought ? 'line-through' : 'none';
    const hasMoreQuantity = quantity && quantity > 1;
    return (
      <View style={listItemStyles.container}>
        <TouchableOpacity onPress={() => {onPressItem(id)}}>
          <View style={listItemStyles.label}>
            <Text style={{textDecorationLine, color}}>{title}</Text>
            {hasMoreQuantity && (
              <Text style={{fontSize:10, textDecorationLine, color}}>{`x${quantity}`}</Text>
            )}
          </View>
        </TouchableOpacity>
        <View style={listItemStyles.buttons}>
          <TouchableOpacity style={{...listItemStyles.touchableButton, marginLeft: 0}} onPress={() => {onChangeQuantity(id, 'increment')}} >
            <Text style={listItemStyles.button}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{...listItemStyles.touchableButton, marginLeft: 5}} onPress={() => {onChangeQuantity(id, 'decrement')}} >
            <Text style={listItemStyles.button}>-</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const listItemStyles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#F5F5F5',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '100%'
  },
  label: {
    // Manage ellipsed title
  },
  buttons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  button: {
    fontSize: 24,
    color: 'blue',
    paddingLeft: 10,
    paddingRight: 10
  }
});
