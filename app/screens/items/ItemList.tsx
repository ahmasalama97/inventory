// src/screens/items/ItemList.tsx
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { runQuery } from '../../db/db';
import { RootStackParamList } from '../../navigation';

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
            <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('AddItem')}>
                <Text style={styles.addBtnText}>+ Add Item</Text>
            </TouchableOpacity>

            <FlatList
                data={items}
                keyExtractor={(i) => String(i.id)}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <View style={styles.cardContent}>
                            <View style={styles.cardHeader}>
                                <Text style={styles.title}>{item.name}</Text>
                                <Text style={styles.category}>{item.category_name ?? '-'}</Text>
                            </View>

                            <View style={styles.cardMeta}>
                                <View style={styles.metaItem}>
                                    <MaterialCommunityIcons name="currency-usd" size={18} color="#333" />
                                    <Text style={styles.metaText}> {item.price}</Text>
                                </View>
                                <View style={styles.metaItem}>
                                    <MaterialIcons name="inventory" size={18} color="#333" />
                                    <Text style={styles.metaText}> {item.quantity}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.cardActions}>
                            <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('AddItem', { id: item.id })}>
                                <MaterialIcons name="edit" size={20} color="#0a7ea4" />
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.iconBtn, { marginTop: 8 }]} onPress={() => remove(item.id)}>
                                <MaterialIcons name="delete" size={20} color="#c00" />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />

            <View style={{ height: 20 }} />
            <TouchableOpacity style={styles.manageBtn} onPress={() => navigation.navigate('Categories')}>
                <Text style={styles.addBtnText}>Manage Categories</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.manageBtn} onPress={() => navigation.navigate('Inventory')}>
                <Text style={styles.addBtnText}>Inventory</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, borderBottomWidth: 1, borderColor: '#eee' },
    title: { fontWeight: '700' },
    actions: { width: 120, alignItems: 'flex-end' },

    addBtn: { backgroundColor: '#018601', padding: 10, borderRadius: 8, alignItems: 'center', marginBottom: 12 },
    manageBtn: { backgroundColor: '#0a7ea4', padding: 10, borderRadius: 8, alignItems: 'center', marginBottom: 12 },
    addBtnText: { color: '#fff', fontWeight: '700' },

    card: { backgroundColor: '#fff', borderRadius: 10, padding: 12, marginBottom: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: '#eee' },
    cardContent: { flex: 1, paddingRight: 12 },
    cardHeader: { marginBottom: 8 },
    category: { color: '#6b7a80', fontSize: 12, marginTop: 4 },

    cardMeta: { flexDirection: 'row', gap: 12 },
    metaItem: { flexDirection: 'row', alignItems: 'center', marginRight: 12 },
    metaText: { marginLeft: 6, fontWeight: '600' },

    cardActions: { width: 56, alignItems: 'center', justifyContent: 'center', flexDirection: 'column' },
    iconBtn: { width: 36, height: 36, borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.04)' },

    link: { paddingVertical: 10 },
    linkText: { color: '#0a7ea4', fontWeight: '600' }
});
