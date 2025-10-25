// src/screens/items/Categories.tsx
import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { runQuery } from '../../db/db';

export default function Categories() {
    const [name, setName] = useState('');
    const [categories, setCategories] = useState<any[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingName, setEditingName] = useState('');

    const load = async () => {
        const rows = await runQuery('SELECT * FROM categories');
        setCategories(rows);
    };

    useEffect(() => { load(); }, []);

    const add = async () => {
        if (!name.trim()) return;
        await runQuery('INSERT INTO categories (name) VALUES (?)', [name.trim()]);
        setName('');
        load();
    };

    const startEdit = (id: number, currentName: string) => {
        setEditingId(id);
        setEditingName(currentName);
    };

    const saveEdit = async () => {
        if (!editingName.trim() || editingId === null) return;
        await runQuery('UPDATE categories SET name = ? WHERE id = ?', [editingName.trim(), editingId]);
        setEditingId(null);
        setEditingName('');
        load();
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditingName('');
    };

    const del = (id: number) => {
        Alert.alert('Delete', 'Delete this category?', [
            { text: 'Cancel' },
            {
                text: 'Delete', style: 'destructive', onPress: async () => {
                    await runQuery('DELETE FROM categories WHERE id = ?', [id]);
                    load();
                }
            }
        ]);
    };

    return (
        <View style={{ padding: 12 }}>
            <View style={styles.formRow}>
                <TextInput value={name} onChangeText={setName} placeholder="Category name" style={styles.input} />
                <TouchableOpacity style={styles.saveBtn} onPress={add}>
                    <MaterialIcons name="add" size={20} color="#fff" />
                </TouchableOpacity>
            </View>

            <FlatList data={categories} keyExtractor={(c) => String(c.id)} renderItem={({ item }) => (
                <View style={styles.catCard}>
                    <View style={styles.catContent}>
                        {editingId === item.id ? (
                            <TextInput value={editingName} onChangeText={setEditingName} style={styles.inputInline} />
                        ) : (
                            <Text style={styles.catTitle}>{item.name}</Text>
                        )}
                    </View>

                    <View style={styles.catActions}>
                        {editingId === item.id ? (
                            <>
                                <TouchableOpacity style={styles.iconBtn} onPress={saveEdit}>
                                    <MaterialIcons name="check" size={20} color="#0a7ea4" />
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.iconBtn, { marginTop: 8 }]} onPress={cancelEdit}>
                                    <MaterialIcons name="close" size={20} color="#666" />
                                </TouchableOpacity>
                            </>
                        ) : (
                            <>
                                <TouchableOpacity style={styles.iconBtn} onPress={() => startEdit(item.id, item.name)}>
                                    <MaterialIcons name="edit" size={20} color="#0a7ea4" />
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.iconBtn, { marginTop: 8 }]} onPress={() => del(item.id)}>
                                    <MaterialIcons name="delete" size={20} color="#c00" />
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </View>
            )} />
        </View>
    );
}

const styles = StyleSheet.create({
    label: { fontWeight: '700' },
    input: { borderWidth: 1, borderColor: '#ddd', padding: 8, marginVertical: 8, borderRadius: 6, flex: 1 },
    row: { flexDirection: 'row', justifyContent: 'space-between', padding: 10, borderBottomWidth: 1, borderColor: '#eee' },

    addBtn: { backgroundColor: '#0a7ea4', padding: 10, borderRadius: 8, alignItems: 'center', marginBottom: 12 },
    addBtnText: { color: '#fff', fontWeight: '700' },

    formRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    saveBtn: { marginLeft: 8, backgroundColor: '#0a7ea4', padding: 10, borderRadius: 8 },

    catCard: { backgroundColor: '#fff', borderRadius: 10, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: '#eee', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    catContent: { flex: 1 },
    catTitle: { fontWeight: '700', fontSize: 16 },
    catActions: { width: 56, alignItems: 'center', justifyContent: 'center' },
    iconBtn: { width: 36, height: 36, borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.04)' },
    inputInline: { borderWidth: 1, borderColor: '#eee', padding: 8, borderRadius: 8 }
});
