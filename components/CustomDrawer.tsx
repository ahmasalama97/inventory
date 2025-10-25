import { Colors } from '@/constants/theme';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function CustomDrawer(props: any) {
    const colorScheme = 'light';
    const theme = Colors[colorScheme];

    return (
        <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
            <View style={styles.header}>
                <Text style={styles.name}>Inventory App</Text>
                <Text style={styles.email}>user@example.com</Text>
            </View>

            <View style={styles.menu}>
                <DrawerItemList {...props} />
            </View>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.logout} onPress={() => props.navigation.navigate('Login')}>
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
                <Text style={styles.footerText}>v1.0.0</Text>
            </View>
        </DrawerContentScrollView>
    );
}

const styles = StyleSheet.create({
    header: {
        padding: 20,
        paddingTop: 40,
        alignItems: 'center',
        justifyContent: 'center'
    },
    name: {
        color: '#000',
        fontWeight: '700',
        fontSize: 18
    },
    email: {
        color: '#a9a9a9',
        fontSize: 12,
        marginTop: 4
    },
    menu: {
        flex: 1,
        paddingTop: 10,
        backgroundColor: '#fff'
    },
    footer: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#eee'
    },
    logout: {
        paddingVertical: 12,
        paddingHorizontal: 8,
        backgroundColor: '#f44',
        borderRadius: 6,
        alignItems: 'center'
    },
    logoutText: {
        color: '#fff',
        fontWeight: '600'
    },
    footerText: {
        marginTop: 8,
        textAlign: 'center',
        color: '#666'
    }
});
