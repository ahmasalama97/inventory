// src/screens/customers/Customers.tsx
import { useEffect, useState } from 'react';
import { Alert, Button, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { runQuery } from '../db/db';

export default function Customers() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  const load = async () => {
    const rows = await runQuery('SELECT * FROM customers');
    setCustomers(rows);
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!name || !phone) { Alert.alert('Validation', 'Name & phone required'); return; }
    if (editingId) {
      await runQuery('UPDATE customers SET name=?, phone=?, email=? WHERE id=?', [name, phone, email || null, editingId]);
    } else {
      await runQuery('INSERT INTO customers (name, phone, email) VALUES (?, ?, ?)', [name, phone, email || null]);
    }
    setName(''); setPhone(''); setEmail(''); setEditingId(null);
    load();
  };

  const edit = (c: any) => { setName(c.name); setPhone(c.phone); setEmail(c.email ?? ''); setEditingId(c.id); };

  const remove = (id: number) => {
    Alert.alert('Delete', 'Delete this customer?', [
      { text: 'Cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: async () => {
          await runQuery('DELETE FROM customers WHERE id = ?', [id]);
          load();
        }
      }
    ]);
  };

  return (
    <View style={{ padding: 12 }}>
      <Text style={styles.label}>Name</Text>
      <TextInput value={name} onChangeText={setName} style={styles.input} />
      <Text style={styles.label}>Phone</Text>
      <TextInput value={phone} onChangeText={setPhone} style={styles.input} keyboardType="phone-pad" />
      <Text style={styles.label}>Email (optional)</Text>
      <TextInput value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" />
      <Button title={editingId ? "Update Customer" : "Add Customer"} onPress={save} />

      <FlatList data={customers} keyExtractor={(c) => String(c.id)} renderItem={({ item }) => (
        <View style={styles.row}>
          <View>
            <Text style={{ fontWeight: '600' }}>{item.name}</Text>
            <Text>{item.phone}</Text>
          </View>
          <View>
            <Button title="Edit" onPress={() => edit(item)} />
            <View style={{ height: 8 }} />
            <Button title="Delete" color="#c00" onPress={() => remove(item.id)} />
          </View>
        </View>
      )} />
    </View>
  );
}

const styles = StyleSheet.create({
  label: { marginTop: 8, fontWeight: '600' },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 8, borderRadius: 6, marginVertical: 6 },
  row: { flexDirection: 'row', justifyContent: 'space-between', padding: 10, borderBottomWidth: 1, borderColor: '#eee' }
});
