// src/screens/items/AddItem.tsx
import { MaterialIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { runQuery } from '../../db/db';
import { RootStackParamList } from '../../navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'AddItem'> & { route?: any };

export default function AddItem({ navigation, route }: Props) {
    const id = route?.params?.id;
    const [name, setName] = useState('');
    const [categoryId, setCategoryId] = useState<number | null>(null);
    const [price, setPrice] = useState('0');
    const [quantity, setQuantity] = useState('0');
    const [categories, setCategories] = useState<any[]>([]);

    const loadCategories = async () => {
        const rows = await runQuery('SELECT * FROM categories');
        setCategories(rows);
    };

    const loadItem = async () => {
        if (!id) return;
        const rows = await runQuery('SELECT * FROM items WHERE id = ?', [id]);
        if (rows.length) {
            const it = rows[0];
            setName(it.name);
            setCategoryId(it.category_id);
            setPrice(String(it.price));
            setQuantity(String(it.quantity));
        }
    };

    useEffect(() => {
        loadCategories();
        loadItem();
    }, []);

    // dimensions are optional UI-only fields for now
    const [lengthVal, setLengthVal] = useState('');
    const [widthVal, setWidthVal] = useState('');

    const save = async () => {
        if (!name) {
            Alert.alert('Validation', 'Name required');
            return;
        }
        const p = parseFloat(price) || 0;
        const q = parseInt(quantity || '0');

        if (id) {
            await runQuery('UPDATE items SET name=?, category_id=?, price=?, quantity=? WHERE id=?', [name, categoryId, p, q, id]);
        } else {
            await runQuery('INSERT INTO items (name, category_id, price, quantity) VALUES (?, ?, ?, ?)', [name, categoryId, p, q]);
        }
        // dimensions currently not stored in DB - can be extended later
        navigation.goBack();
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={{ padding: 16 }}>
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Select Category:</Text>
                    <View style={styles.pickerWrap}>
                        <MaterialIcons name="category" size={20} color="#0a7ea4" style={{ marginRight: 8 }} />
                        <Picker
                            selectedValue={categoryId}
                            onValueChange={(v) => setCategoryId(v === null ? null : Number(v))}
                            style={styles.picker}
                        >
                            <Picker.Item label="Select category" value={null} />
                            {categories.map(c => (
                                <Picker.Item key={c.id} label={c.name} value={Number(c.id)} />
                            ))}
                        </Picker>
                    </View>

                    <Text style={styles.cardLabel}>Item Name:</Text>
                    <TextInput value={name} onChangeText={setName} placeholder="MacBook, Xbox etc" style={styles.inputLarge} />

                    <Text style={styles.cardLabel}>Price:</Text>
                    <TextInput value={price} onChangeText={setPrice} placeholder="Price" keyboardType="numeric" style={styles.inputLarge} />

                    <Text style={styles.cardLabel}>Qty:</Text>
                    <TextInput value={quantity} onChangeText={setQuantity} placeholder="Qty" keyboardType="numeric" style={styles.inputLarge} />

                </View>

                <View style={styles.rowBtns}>
                    <TouchableOpacity style={[styles.bigBtn, { backgroundColor: '#2ECC71' }]} onPress={save}>
                        <Text style={styles.bigBtnText}>Add Item</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    label: { marginTop: 8, fontWeight: '600' },
    input: { borderWidth: 1, borderColor: '#ddd', padding: 10, borderRadius: 6, marginTop: 6 },

    card: { backgroundColor: '#fff', borderRadius: 12, padding: 18, marginBottom: 16, borderWidth: 1, borderColor: '#f0f0f0' },
    cardTitle: { fontWeight: '800', fontSize: 16, marginBottom: 12 },
    pickerWrap: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#eee', borderRadius: 8, paddingHorizontal: 8, paddingVertical: Platform.OS === 'ios' ? 6 : 0, marginBottom: 12 },
    picker: { flex: 1 },
    cardLabel: { fontWeight: '700', marginTop: 8 },
    inputLarge: { borderWidth: 1, borderColor: '#eee', padding: 12, borderRadius: 10, marginTop: 8, backgroundColor: '#fafafa' },

    rowBtns: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
    bigBtn: { flex: 1, paddingVertical: 14, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginHorizontal: 6 },
    bigBtnText: { color: '#fff', fontWeight: '800', fontSize: 16 }
});
