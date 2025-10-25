// src/components/InputRow.tsx
import { StyleSheet, Text, TextInput, View } from 'react-native';

type Props = {
    label: string;
    value: string;
    onChangeText: (t: string) => void;
    placeholder?: string;
    keyboardType?: any;
};

export default function InputRow({ label, value, onChangeText, placeholder, keyboardType }: Props) {
    return (
        <View style={styles.row}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                style={styles.input}
                keyboardType={keyboardType}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    row: { marginVertical: 8 },
    label: { fontWeight: '600', marginBottom: 6 },
    input: { borderWidth: 1, borderColor: '#ddd', padding: 10, borderRadius: 6 }
});
