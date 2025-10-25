import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { runQuery } from '../../db/db';
import { RootStackParamList } from '../../navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'AddCustomer'> & { route?: any };

export default function AddCustomer({ navigation, route }: Props) {
    const id = route?.params?.id;
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');

    const load = async () => {
        if (!id) return;
        const rows = await runQuery('SELECT * FROM customers WHERE id = ?', [id]);
        if (rows.length) {
            const c = rows[0];
            setName(c.name);
            setPhone(c.phone);
            setEmail(c.email ?? '');
        }
    };

    useEffect(() => { load(); }, []);

    const save = async () => {
        if (!name || !phone) { Alert.alert('Validation', 'Name & phone required'); return; }
        if (id) {
            await runQuery('UPDATE customers SET name=?, phone=?, email=? WHERE id=?', [name, phone, email || null, id]);
        } else {
            await runQuery('INSERT INTO customers (name, phone, email) VALUES (?, ?, ?)', [name, phone, email || null]);
        }
        navigation.navigate('Customers');
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={{ padding: 16 }}>
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>{id ? 'Edit Customer' : 'Add Customer'}</Text>

                    <Text style={styles.cardLabel}>Name:</Text>
                    <TextInput value={name} onChangeText={setName} placeholder="Full name" style={styles.inputLarge} />

                    <Text style={styles.cardLabel}>Phone:</Text>
                    <TextInput value={phone} onChangeText={setPhone} placeholder="Phone" keyboardType="phone-pad" style={styles.inputLarge} />

                    <Text style={styles.cardLabel}>Email (optional):</Text>
                    <TextInput value={email} onChangeText={setEmail} placeholder="Email" keyboardType="email-address" style={styles.inputLarge} />
                </View>

                <View style={styles.rowBtns}>
                    <TouchableOpacity style={[styles.bigBtn, { backgroundColor: '#2ECC71' }]} onPress={save}>
                        <Text style={styles.bigBtnText}>{id ? 'Update Customer' : 'Add Customer'}</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    card: { backgroundColor: '#fff', borderRadius: 12, padding: 18, marginBottom: 16, borderWidth: 1, borderColor: '#f0f0f0' },
    cardTitle: { fontWeight: '800', fontSize: 16, marginBottom: 12 },
    cardLabel: { fontWeight: '700', marginTop: 8 },
    inputLarge: { borderWidth: 1, borderColor: '#eee', padding: 12, borderRadius: 10, marginTop: 8, backgroundColor: '#fafafa' },

    rowBtns: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
    bigBtn: { flex: 1, paddingVertical: 14, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginHorizontal: 6 },
    bigBtnText: { color: '#fff', fontWeight: '800', fontSize: 16 }
});
