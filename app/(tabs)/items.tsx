// src/screens/items/ItemList.tsx
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { Alert, Button, FlatList, StyleSheet, Text, View } from 'react-native';
import { runQuery } from '../db/db';
import { RootStackParamList } from '../navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'ItemList'>;

export default function ItemList({ navigation }: Props) {
  const [items, setItems] = useState<any[]>([]);

  const load = async () => {
    const rows = await runQuery('SELECT items.*, categories.name as category_name FROM items LEFT JOIN categories ON categories.id = items.category_id');
    setItems(rows);
  };

  useEffect(() => {
    const unsub = navigation.addListener('focus', load);
    load();
    return unsub;
  }, [navigation]);

  const remove = (id: number) => {
    Alert.alert('Delete', 'Delete this item?', [
      { text: 'Cancel' }, {
        text: 'Delete', style: 'destructive', onPress: async () => {
          await runQuery('DELETE FROM items WHERE id = ?', [id]);
          load();
        }
      }
    ]);
  };

  return (
    <View style={{ flex: 1, padding: 12 }}>
      <Button title="Add Item" onPress={() => navigation.navigate('AddItem')} />
      <FlatList
        data={items}
        keyExtractor={(i) => String(i.id)}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View>
              <Text style={styles.title}>{item.name}</Text>
              <Text>Category: {item.category_name ?? '-'}</Text>
              <Text>Price: {item.price} | Qty: {item.quantity}</Text>
            </View>
            <View style={styles.actions}>
              <Button title="Edit" onPress={() => navigation.navigate('AddItem', { id: item.id })} />
              <View style={{ height: 8 }} />
              <Button title="Delete" color="#c00" onPress={() => remove(item.id)} />
            </View>
          </View>
        )}
      />
      <View style={{ height: 20 }} />
      <Button title="Manage Categories" onPress={() => navigation.navigate('Categories')} />
      <View style={{ height: 12 }} />
      <Button title="Inventory" onPress={() => navigation.navigate('Inventory')} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, borderBottomWidth: 1, borderColor: '#eee' },
  title: { fontWeight: '700' },
  actions: { width: 120, alignItems: 'flex-end' }
});
