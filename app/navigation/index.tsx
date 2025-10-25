// src/navigation/index.tsx
import CustomDrawer from '@/components/CustomDrawer';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AddCustomer from 'app/screens/customers/AddCustomer';
import Customers from 'app/screens/customers/Customers';
import Dashboard from 'app/screens/Dashboard';
import AddItem from 'app/screens/items/AddItem';
import Categories from 'app/screens/items/Categories';
import Inventory from 'app/screens/items/Inventory';
import ItemList from 'app/screens/items/ItemList';
import LoginScreen from 'app/screens/LoginScreen';
import CreateInvoice from 'app/screens/transactions/CreateInvoice';
import InvoiceList from 'app/screens/transactions/InvoiceList';

export type DrawerParamList = {
    Dashboard: undefined;
    ItemList: undefined;
    Categories: undefined;
    Inventory: undefined;
    Customers: undefined;
    InvoiceList: undefined;
};

export type RootStackParamList = DrawerParamList & {
    Login: undefined;
    Main: undefined;
    AddItem: { id?: number } | undefined;
    AddCustomer: { id?: number } | undefined;
    CreateInvoice: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator<DrawerParamList>();

function MainDrawer() {
    return (
        <Drawer.Navigator
            initialRouteName="Dashboard"
            drawerContent={(props: any) => <CustomDrawer {...props} />}
            screenOptions={{ headerShown: true }}
        >
            <Drawer.Screen name="Dashboard" component={Dashboard} />
            <Drawer.Screen name="ItemList" component={ItemList} options={{ title: 'Items' }} />
            <Drawer.Screen name="Categories" component={Categories} />
            <Drawer.Screen name="Inventory" component={Inventory} />
            <Drawer.Screen name="Customers" component={Customers} />
            <Drawer.Screen name="InvoiceList" component={InvoiceList} options={{ title: 'Invoices' }} />
        </Drawer.Navigator>
    );
}

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Main" component={MainDrawer} options={{ headerShown: false }} />

                {/* Add/Edit screens - accessed via buttons, not drawer */}
                <Stack.Screen
                    name="AddItem"
                    component={AddItem}
                    options={{
                        title: 'Add / Edit Item',
                        headerShown: true,
                        headerLeft: () => null,
                        presentation: 'modal'
                    }}
                />
                <Stack.Screen
                    name="AddCustomer"
                    component={AddCustomer}
                    options={{
                        title: 'Add / Edit Customer',
                        headerShown: true,
                        headerLeft: () => null,
                        presentation: 'modal'
                    }}
                />
                <Stack.Screen
                    name="CreateInvoice"
                    component={CreateInvoice}
                    options={{
                        title: 'Create Invoice',
                        headerShown: true,
                        headerLeft: () => null,
                        presentation: 'modal'
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
