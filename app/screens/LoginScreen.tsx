// src/screens/LoginScreen.tsx
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { RootStackParamList } from '../navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const VALID_USER = { email: 'admin@example.com', password: 'password123' };

export default function LoginScreen({ navigation }: Props) {
    const [email, setEmail] = useState('admin@example.com');
    const [password, setPassword] = useState('password123');

    const login = () => {
        if (!/\S+@\S+\.\S+/.test(email)) {
            Alert.alert('Validation', 'Enter a valid email');
            return;
        }
        if (!password || password.length < 6) {
            Alert.alert('Validation', 'Password must be at least 6 characters');
            return;
        }
        // simple local check
        if (email === VALID_USER.email && password === VALID_USER.password) {
            // on successful login, replace stack with Main (drawer)
            navigation.replace('Main');
        } else {
            Alert.alert('Authentication failed', 'Wrong credentials (use admin@example.com / password123)');
        }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.hello}>Hello</Text>
                <Text style={styles.welcome}>Welcome!</Text>

                <View style={styles.form}>
                    <TextInput
                        value={email}
                        onChangeText={setEmail}
                        style={styles.input}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        placeholder="Email"
                        placeholderTextColor="#999"
                    />

                    <TextInput
                        value={password}
                        onChangeText={setPassword}
                        style={styles.input}
                        secureTextEntry
                        placeholder="Password"
                        placeholderTextColor="#999"
                    />

                    <TouchableOpacity style={styles.loginButton} onPress={login}>
                        <Text style={styles.loginButtonText}>Login</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#fff'
    },
    hello: {
        fontSize: 36,
        fontWeight: '700',
        color: '#0a7ea4',
        marginBottom: 4
    },
    welcome: {
        fontSize: 28,
        fontWeight: '600',
        color: '#333',
        marginBottom: 32
    },
    form: {
        width: '100%'
    },
    input: {
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        fontSize: 16
    },
    loginButton: {
        backgroundColor: '#0a7ea4',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginTop: 8
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600'
    },
});
