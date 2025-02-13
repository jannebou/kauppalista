import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';

const baseUrl =
  'https://mysterious-tick-jannebou-79e39dbc.koyeb.app/api/mobiili';

const App = () => {
  const [list, setList] = useState([]);
  const [newItem, setNewItem] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios
      .get(baseUrl)
      .then((response) => setList(response.data))
      .catch((error) => console.error('Error fetching data:', error));
  };

  const addItem = () => {
    if (newItem === '') {
      Alert.alert('Virhe', 'Syötä tuote');
      return;
    }

    const newItemObject = { item: newItem };

    axios
      .post(baseUrl, newItemObject)
      .then((response) => {
        setNewItem('');
        setList([...list, response.data]);
        fetchData();
      })
      .catch((error) => Alert.alert('Palvelin virhe', error));
  };

  const removeItem = (id) => {
    axios
      .delete(`${baseUrl}/${id}`)
      .then(() => fetchData())
      .catch((error) => Alert.alert('Palvelin virhe', error));
  };

  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Text style={styles.header}>🛒Kauppalista</Text>
        <Button color="dodgerblue" title="Päivitä" onPress={fetchData} />
      </View>

      <TextInput
        style={styles.input}
        placeholder="Ostettava tuote"
        placeholderTextColor="lightgray"
        value={newItem}
        onChangeText={setNewItem}
        onSubmitEditing={addItem}
      />

      <Button color="dodgerblue" title="Lisää" onPress={addItem} />

      <FlatList
        data={list}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text style={styles.item}> {item.item} </Text>
            <Button
              color="#ff08de"
              title="Poista"
              onPress={() => removeItem(item.id)}
            />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingLeft: '10%',
    paddingRight: '10%',
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  title: {
    paddingTop: 30,
    fontSize: 30,
    fontWeight: 'bold',
    // textAlign: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    fontSize: 20,
    marginBottom: 10,
    borderRadius: 10,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  item: {
    fontSize: 18,
    fontFamily: 'Arial',
    textAlignVertical: 'center',
  },
});

export default App;
