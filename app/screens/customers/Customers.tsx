// src/screens/customers/Customers.tsx
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { runQuery } from '../../db/db';

export default function Customers() {
    const navigation = useNavigation<any>();
    const [customers, setCustomers] = useState<any[]>([]);

    const load = async () => {
        const rows = await runQuery('SELECT * FROM customers');
        setCustomers(rows);
    };

    useEffect(() => { load(); }, []);

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
            <View style={{ marginBottom: 12 }}>
                <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('AddCustomer')}>
                    <Text style={styles.addBtnText}>+ Add Customer</Text>
                </TouchableOpacity>
            </View>

            <FlatList data={customers} keyExtractor={(c) => String(c.id)} renderItem={({ item }) => (
                <View style={styles.card}>
                    <View style={styles.left}>
                        <MaterialIcons name="person" size={28} color="#0a7ea4" style={{ marginRight: 12 }} />
                        <View>
                            <Text style={styles.title}>{item.name}</Text>
                            <Text style={styles.subtitle}>{item.phone}{item.email ? ` • ${item.email}` : ''}</Text>
                        </View>
                    </View>

                    <View style={styles.actions}>
                        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('AddCustomer', { id: item.id })}>
                            <MaterialIcons name="edit" size={18} color="#0a7ea4" />
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.iconBtn, { marginTop: 8 }]} onPress={() => remove(item.id)}>
                            <MaterialIcons name="delete" size={18} color="#c00" />
                        </TouchableOpacity>
                    </View>
                </View>
            )} />
        </View>
    );
}

const styles = StyleSheet.create({
    label: { marginTop: 8, fontWeight: '600' },
    input: { borderWidth: 1, borderColor: '#ddd', padding: 8, borderRadius: 6, marginVertical: 6 },
    row: { flexDirection: 'row', justifyContent: 'space-between', padding: 10, borderBottomWidth: 1, borderColor: '#eee' },

    addBtn: { backgroundColor: '#0a7ea4', padding: 10, borderRadius: 8, alignItems: 'center' },
    addBtnText: { color: '#fff', fontWeight: '700' },

    card: { backgroundColor: '#fff', borderRadius: 10, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: '#f0f0f0', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    left: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    title: { fontWeight: '800', fontSize: 16 },
    subtitle: { color: '#666', marginTop: 2 },
    actions: { alignItems: 'center', width: 56 },
    iconBtn: { width: 36, height: 36, borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.04)' }
});
