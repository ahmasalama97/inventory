// src/screens/Dashboard.tsx
import { Colors } from '@/constants/theme';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { runQuery } from '../db/db';
import { RootStackParamList } from '../navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Dashboard'>;

function DashboardCard({ title, value, accent, icon, trend, trendUp, onPress }: any) {
    return (
        <TouchableOpacity activeOpacity={0.9} style={[styles.metricCard]} onPress={onPress}>
            <View style={styles.metricLeft}>
                <Text style={styles.metricSmall}>{title}</Text>
                <Text style={styles.metricBig}>{value}</Text>
                <View style={styles.metricFoot}>
                    {/* {typeof trend === 'string' && (
                        <Text style={[styles.trend, trendUp ? styles.trendUp : styles.trendDown]}> {trend} </Text>
                    )} */}
                    {/* <Text style={styles.footNote}>Since last month</Text> */}
                </View>
            </View>
            <View style={[styles.metricIconWrap, { backgroundColor: accent || Colors.light.tint }]}>
                {icon}
            </View>
        </TouchableOpacity>
    );
}

export default function Dashboard({ navigation }: Props) {
    const [counts, setCounts] = useState({ items: 0, invoices: 0, customers: 0 });

    const loadCounts = async () => {
        const items = await runQuery('SELECT COUNT(*) as c FROM items') as any;
        const invoices = await runQuery('SELECT COUNT(*) as c FROM invoices') as any;
        const customers = await runQuery('SELECT COUNT(*) as c FROM customers') as any;
        setCounts({
            items: items[0]?.c ?? 0,
            invoices: invoices[0]?.c ?? 0,
            customers: customers[0]?.c ?? 0,
        });
    };

    useEffect(() => {
        const unsub = navigation.addListener('focus', () => {
            loadCounts();
        });
        loadCounts();
        return unsub;
    }, [navigation]);

    // Example metrics — mix of real data and illustrative figures for the design
    const metrics = [
        {
            id: 'items',
            title: 'ITEMS',
            value: `${counts.items}`,
            accent: '#ff6b6b',
            icon: <FontAwesome5 name="list" size={24} color="#fff" />,
            trend: '+12%',
            trendUp: true,
            onPress: () => { }
        },
        {
            id: 'customers',
            title: 'TOTAL CUSTOMERS',
            value: `${counts.customers}`,
            accent: '#00c853',
            icon: <MaterialIcons name="people" size={22} color="#fff" />,
            trend: '-16%',
            trendUp: false,
            onPress: () => navigation.navigate('Customers')
        },
        {
            id: 'Invoices',
            title: 'Invoices GENERATED',
            value: `${counts.invoices}`,
            accent: '#ffab00',
            icon: <MaterialIcons name="timeline" size={22} color="#fff" />,
            trend: null,
            trendUp: false,
            onPress: () => { }
        },
    ];

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.h1}>Dashboard</Text>

            <View style={styles.grid}>
                {metrics.map(m => (
                    <DashboardCard key={m.id} {...m} />
                ))}
            </View>

            <View style={{ height: 24 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { padding: 16 },
    h1: { fontSize: 26, fontWeight: '700', marginBottom: 16 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    metricCard: {
        width: '48%',
        minHeight: 120,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        // shadow
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOpacity: 0.06, shadowOffset: { width: 0, height: 6 }, shadowRadius: 12 },
            android: { elevation: 3 }
        })
    },
    metricLeft: { flex: 1, paddingRight: 8 },
    metricSmall: { fontSize: 12, fontWeight: '700', color: '#7b8a90' },
    metricBig: { fontSize: 20, fontWeight: '800', marginTop: 6 },
    metricFoot: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
    trend: { fontWeight: '700', marginRight: 8 },
    trendUp: { color: '#2ecc71' },
    trendDown: { color: '#ff1744' },
    footNote: { fontSize: 12, color: '#9aa6ab' },
    metricIconWrap: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' }
});
