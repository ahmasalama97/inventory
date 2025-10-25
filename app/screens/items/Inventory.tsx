// src/screens/items/Inventory.tsx
import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { runQuery } from '../../db/db';

export default function Inventory() {
    const [items, setItems] = useState<any[]>([]);

    const load = async () => {
        const rows = await runQuery('SELECT items.*, categories.name as category_name FROM items LEFT JOIN categories ON categories.id = items.category_id');
        setItems(rows);
    };

    useEffect(() => { load(); }, []);

    return (
        <View style={{ padding: 12 }}>
            <Text style={{ fontWeight: '700', fontSize: 18, marginBottom: 12 }}>Inventory</Text>

            <FlatList
                data={items}
                keyExtractor={(i) => String(i.id)}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <View style={styles.cardLeft}>
                            <MaterialIcons name="inventory" size={28} color="#0a7ea4" style={{ marginRight: 12 }} />
                            <View>
                                <Text style={styles.title}>{item.name}</Text>
                                <Text style={styles.subtitle}>{item.category_name ?? '-'}</Text>
                            </View>
                        </View>

                        <View style={styles.cardRight}>
                            <Text style={styles.qty}>Qty: {item.quantity}</Text>
                        </View>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    row: { flexDirection: 'row', justifyContent: 'space-between', padding: 10, borderBottomWidth: 1, borderColor: '#eee' },
    card: { backgroundColor: '#fff', borderRadius: 10, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: '#f0f0f0', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    cardLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    title: { fontWeight: '800', fontSize: 16 },
    subtitle: { color: '#666', marginTop: 2 },
    cardRight: { alignItems: 'flex-end', marginLeft: 12 },
    qty: { fontWeight: '600', fontSize: 16 },
    smallBtn: { marginTop: 8, padding: 6 }
});
