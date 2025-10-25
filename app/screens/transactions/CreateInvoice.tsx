// src/screens/transactions/CreateInvoice.tsx
import { MaterialIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { Alert, FlatList, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { runQuery } from '../../db/db';
import { calcInvoiceTotals, VAT_RATE } from '../../utils/invoice';

export default function CreateInvoice({ navigation }: any) {
    const [customers, setCustomers] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [items, setItems] = useState<any[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<number | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
    const [qty, setQty] = useState('1');
    const [price, setPrice] = useState('0');
    const [invoiceItems, setInvoiceItems] = useState<any[]>([]);
    const [paid, setPaid] = useState('0');
    const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));

    const load = async () => {
        const c = await runQuery('SELECT * FROM customers');
        setCustomers(c);
        const cat = await runQuery('SELECT * FROM categories');
        setCategories(cat);
        const it = await runQuery('SELECT items.*, categories.name as cat_name FROM items LEFT JOIN categories ON categories.id = items.category_id');
        setItems(it);
    };

    useEffect(() => { load(); }, []);

    useEffect(() => {
        if (selectedItemId !== null && selectedItemId !== undefined) {
            const it = items.find(i => Number(i.id) === Number(selectedItemId));
            if (it) {
                setPrice(String(it.price));
            }
        }
    }, [selectedItemId, items]);

    const addLine = () => {
        if (selectedItemId === null || selectedItemId === undefined) { Alert.alert('Validation', 'Select item'); return; }
        const q = parseInt(qty || '1');
        const p = parseFloat(price || '0');
        const itData = items.find(i => Number(i.id) === Number(selectedItemId));
        if (!itData) return;
        const amount = +(q * p);
        const line = { item_id: Number(selectedItemId), qty: q, price: p, amount };
        setInvoiceItems(prev => [...prev, { ...line, name: itData.name }]);
        setQty('1');
    };

    const removeLine = (idx: number) => {
        setInvoiceItems(prev => prev.filter((_, i) => i !== idx));
    };

    const genInvoiceNo = async () => {
        const existing = await runQuery('SELECT COUNT(*) as c FROM invoices') as any;
        const c = existing[0]?.c ?? 0;
        const no = `INV-${(c + 1).toString().padStart(6, '0')}`;
        return no;
    };

    const save = async () => {
        if (!invoiceItems.length) { Alert.alert('Validation', 'Add at least one item'); return; }
        const paidVal = parseFloat(paid || '0');
        const { subtotal, vat, total, due } = calcInvoiceTotals(invoiceItems.map(it => ({ qty: it.qty, price: it.price })), paidVal);
        const invoiceNo = await genInvoiceNo();
        // insert invoice
        await runQuery('INSERT INTO invoices (invoice_no, customer_id, date, subtotal, vat, total, paid, due) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [invoiceNo, selectedCustomer, date, subtotal, vat, total, paidVal, due]);

        // get invoice id
        const rows = await runQuery('SELECT id FROM invoices WHERE invoice_no = ?', [invoiceNo]);
        const invoiceId = rows[0].id;

        // insert items and update item quantities (reduce stock)
        for (const it of invoiceItems) {
            await runQuery('INSERT INTO invoice_items (invoice_id, item_id, qty, price, amount) VALUES (?, ?, ?, ?, ?)', [invoiceId, it.item_id, it.qty, it.price, it.amount]);
            // update item quantity
            await runQuery('UPDATE items SET quantity = quantity - ? WHERE id = ?', [it.qty, it.item_id]);
        }

        Alert.alert('Saved', 'Invoice saved successfully');
        navigation.navigate('InvoiceList');
    };

    const totals = calcInvoiceTotals(invoiceItems.map(it => ({ qty: it.qty, price: it.price })), parseFloat(paid || '0'));

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
            <ScrollView style={{ padding: 12, marginBottom: 50 }}>
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Customer & Date</Text>

                    <View style={styles.pickerWrap}>
                        <MaterialIcons name="person" size={20} color="#0a7ea4" style={{ marginRight: 8 }} />
                        <Picker
                            selectedValue={selectedCustomer}
                            onValueChange={(v) => setSelectedCustomer(v === null ? null : Number(v))}
                            style={styles.picker}
                        >
                            <Picker.Item label="Walk-in / Select" value={null} />
                            {customers.map(c => (
                                <Picker.Item key={c.id} label={`${c.name} (${c.phone})`} value={Number(c.id)} />
                            ))}
                        </Picker>
                    </View>

                    <Text style={styles.cardLabel}>Date:</Text>
                    <TextInput value={date} onChangeText={setDate} style={styles.inputLarge} />
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Add Category</Text>

                    <View style={styles.pickerWrap}>
                        <MaterialIcons name="category" size={20} color="#0a7ea4" style={{ marginRight: 8 }} />
                        <Picker
                            selectedValue={selectedCategory}
                            onValueChange={(v) => setSelectedCategory(v === null ? null : Number(v))}
                            style={styles.picker}
                        >
                            <Picker.Item label="All categories" value={null} />
                            {categories.map(c => (
                                <Picker.Item key={c.id} label={c.name} value={Number(c.id)} />
                            ))}
                        </Picker>
                    </View>
                    <Text style={styles.cardTitle}>Add Items</Text>

                    <View style={styles.pickerWrap}>
                        <MaterialIcons name="inventory" size={20} color="#0a7ea4" style={{ marginRight: 8 }} />
                        <Picker
                            selectedValue={selectedItemId}
                            onValueChange={(v) => setSelectedItemId(v === null ? null : Number(v))}
                            style={styles.picker}
                        >
                            <Picker.Item label="Select item" value={null} />
                            {items
                                .filter(it => !selectedCategory || Number(it.category_id) === Number(selectedCategory))
                                .map(it => (
                                    <Picker.Item key={it.id} label={`${it.name} (Stock:${it.quantity})`} value={Number(it.id)} />
                                ))}
                        </Picker>
                    </View>

                    <View style={styles.row}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.cardLabel}>Qty:</Text>
                            <TextInput style={styles.inputLarge} value={qty} onChangeText={setQty} keyboardType="numeric" placeholder="Qty" />
                        </View>
                        <View style={{ width: 12 }} />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.cardLabel}>Price:</Text>
                            <TextInput style={styles.inputLarge} value={price} onChangeText={setPrice} keyboardType="numeric" placeholder="Price" />
                        </View>
                    </View>

                    <TouchableOpacity style={styles.addBtn} onPress={addLine}>
                        <Text style={styles.addBtnText}>Add Line</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Selected Items</Text>
                    <FlatList
                        data={invoiceItems}
                        keyExtractor={(_, i) => String(i)}
                        renderItem={({ item, index }) => (
                            <View style={styles.itemCard}>
                                <View style={styles.itemContent}>
                                    <Text style={styles.itemTitle}>{item.name}</Text>
                                    <Text style={styles.itemSubtitle}>{item.qty} × {item.price} = {item.amount}</Text>
                                </View>
                                <TouchableOpacity style={[styles.iconBtn, { backgroundColor: 'rgba(204,0,0,0.1)' }]} onPress={() => removeLine(index)}>
                                    <MaterialIcons name="delete" size={18} color="#c00" />
                                </TouchableOpacity>
                            </View>
                        )}
                    />

                    <View style={[styles.totalsCard, { marginTop: 12 }]}>
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Subtotal:</Text>
                            <Text style={styles.totalValue}>{totals.subtotal}</Text>
                        </View>
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>VAT ({VAT_RATE * 100}%):</Text>
                            <Text style={styles.totalValue}>{totals.vat}</Text>
                        </View>
                        <View style={[styles.totalRow, { marginTop: 8 }]}>
                            <Text style={styles.totalLabel}>Total:</Text>
                            <Text style={[styles.totalValue, { fontWeight: '800', color: '#2ECC71' }]}>{totals.total}</Text>
                        </View>
                    </View>

                    <View style={{ marginTop: 12 }}>
                        <Text style={styles.cardLabel}>Amount Paid:</Text>
                        <TextInput value={paid} onChangeText={setPaid} style={styles.inputLarge} keyboardType="numeric" />
                    </View>

                    <View style={[styles.totalsCard, { marginTop: 12 }]}>
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Due:</Text>
                            <Text style={[styles.totalValue, { color: totals.due > 0 ? '#c00' : '#2ECC71' }]}>{totals.due}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.rowBtns}>
                    <TouchableOpacity style={[styles.bigBtn, { backgroundColor: '#2ECC71' }]} onPress={save}>
                        <Text style={styles.bigBtnText}>Save Invoice</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    input: { borderWidth: 1, borderColor: '#ddd', padding: 8, borderRadius: 6, marginVertical: 6 },
    row: { flexDirection: 'row' },

    card: { backgroundColor: '#fff', borderRadius: 12, padding: 18, marginBottom: 16, borderWidth: 1, borderColor: '#f0f0f0' },
    cardTitle: { fontWeight: '800', fontSize: 16, marginBottom: 12 },
    cardLabel: { fontWeight: '700', marginTop: 8 },
    pickerWrap: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#eee', borderRadius: 8, paddingHorizontal: 8, paddingVertical: Platform.OS === 'ios' ? 6 : 0, marginBottom: 12 },
    picker: { flex: 1 },
    inputLarge: { borderWidth: 1, borderColor: '#eee', padding: 12, borderRadius: 10, marginTop: 8, backgroundColor: '#fafafa' },

    addBtn: { backgroundColor: '#0a7ea4', padding: 10, borderRadius: 8, alignItems: 'center', marginTop: 12 },
    addBtnText: { color: '#fff', fontWeight: '700' },

    itemCard: { backgroundColor: '#fafafa', borderRadius: 8, padding: 12, marginBottom: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    itemContent: { flex: 1 },
    itemTitle: { fontWeight: '700', fontSize: 15 },
    itemSubtitle: { color: '#666', marginTop: 2 },
    iconBtn: { width: 36, height: 36, borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.04)' },

    totalsCard: { backgroundColor: '#fafafa', borderRadius: 8, padding: 12 },
    totalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
    totalLabel: { color: '#666' },
    totalValue: { fontWeight: '700' },

    rowBtns: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
    bigBtn: { flex: 1, paddingVertical: 14, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginHorizontal: 6 },
    bigBtnText: { color: '#fff', fontWeight: '800', fontSize: 16 }
});
