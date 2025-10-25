// src/screens/Dashboard.tsx
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import { runQuery } from '../db/db';
import { RootStackParamList } from '../navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Dashboard'>;

export default function Dashboard({ navigation }: Props) {
  const [counts, setCounts] = useState({ items: 0, invoices: 0, customers: 0 });

  const loadCounts = async () => {
    const items = await runQuery('SELECT COUNT(*) as c FROM items') as any;
    const invoices = await runQuery('SELECT COUNT(*) as c FROM invoices') as any;
    const customers = await runQuery('SELECT COUNT(*) as c FROM customers') as any;
    setCounts({
      items: items[0]?.c ?? 0,
      invoices: invoices[0]?.c ?? 0,
      customers: customers[0]?.c ?? 0
    });
  };

  useEffect(() => {
    const unsub = navigation.addListener('focus', () => {
      loadCounts();
    });
    loadCounts();
    return unsub;
  }, [navigation]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.h1}>Dashboard</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Items</Text>
        <Text style={styles.cardValue}>{counts.items}</Text>
        <Button title="View Items" onPress={() => navigation.navigate('ItemList')} />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Invoices</Text>
        <Text style={styles.cardValue}>{counts.invoices}</Text>
        <Button title="View Invoices" onPress={() => navigation.navigate('InvoiceList')} />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Customers</Text>
        <Text style={styles.cardValue}>{counts.customers}</Text>
        <Button title="Manage Customers" onPress={() => navigation.navigate('Customers')} />
      </View>

      <View style={{ marginTop: 24 }}>
        <Button title="Create Invoice" onPress={() => navigation.navigate('CreateInvoice')} />
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  h1: { fontSize: 26, fontWeight: '700', marginBottom: 16 },
  card: { padding: 14, borderWidth: 1, borderColor: '#eee', borderRadius: 8, marginBottom: 12 },
  cardTitle: { fontWeight: '600' },
  cardValue: { fontSize: 22, fontWeight: '700', marginVertical: 6 }
});
