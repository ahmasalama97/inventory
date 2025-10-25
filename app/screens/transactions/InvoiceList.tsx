// src/screens/transactions/InvoiceList.tsx
import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { runQuery } from '../../db/db';

export default function InvoiceList({ navigation }: any) {
    const [invoices, setInvoices] = useState<any[]>([]);

    const load = async () => {
        const rows = await runQuery('SELECT invoices.*, customers.name as customer_name FROM invoices LEFT JOIN customers ON customers.id = invoices.customer_id ORDER BY invoices.id DESC');
        setInvoices(rows);
    };

    useEffect(() => {
        const unsub = navigation.addListener('focus', load);
        load();
        return unsub;
    }, [navigation]);

    const remove = (id: number) => {
        Alert.alert('Delete', 'Delete this invoice?', [
            { text: 'Cancel' },
            {
                text: 'Delete', style: 'destructive', onPress: async () => {
                    await runQuery('DELETE FROM invoice_items WHERE invoice_id = ?', [id]);
                    await runQuery('DELETE FROM invoices WHERE id = ?', [id]);
                    load();
                }
            }
        ]);
    };

    return (
        <View style={{ padding: 12 }}>
            <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('CreateInvoice')}>
                <Text style={styles.addBtnText}>+ Create Invoice</Text>
            </TouchableOpacity>

            <FlatList
                data={invoices}
                keyExtractor={(i) => String(i.id)}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <View style={styles.cardLeft}>
                            <MaterialIcons name="receipt" size={28} color="#0a7ea4" style={{ marginRight: 12 }} />
                            <View>
                                <Text style={styles.title}>{item.invoice_no}</Text>
                                <Text style={styles.subtitle}>{item.customer_name ?? 'Walk-in'} • {item.date}</Text>
                            </View>
                        </View>

                        <View style={styles.cardRight}>
                            <Text style={styles.amount}>{item.total}</Text>
                            <TouchableOpacity style={[styles.iconBtn, { backgroundColor: 'rgba(204,0,0,0.1)' }]} onPress={() => remove(item.id)}>
                                <MaterialIcons name="delete" size={18} color="#c00" />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    addBtn: { backgroundColor: '#0a7ea4', padding: 10, borderRadius: 8, alignItems: 'center', marginBottom: 12 },
    addBtnText: { color: '#fff', fontWeight: '700' },

    card: { backgroundColor: '#fff', borderRadius: 10, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: '#f0f0f0', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    cardLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    title: { fontWeight: '800', fontSize: 16 },
    subtitle: { color: '#666', marginTop: 2 },
    cardRight: { alignItems: 'flex-end' },
    amount: { fontWeight: '800', fontSize: 16, color: '#2ECC71', marginBottom: 8 },
    iconBtn: { width: 36, height: 36, borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.04)' }
});
