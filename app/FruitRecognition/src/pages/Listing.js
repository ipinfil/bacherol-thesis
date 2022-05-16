import { View, SafeAreaView, FlatList, Text } from 'react-native';

export default function Listing({ navigation, route }) {
    const renderItem = ({ item }) => (
        <View style={{
            display: 'flex',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            height: 80,
            backgroundColor: '#fff',
            borderBottomWidth: 1,
            borderBottomColor: '#ddd',
            flexDirection: 'row',
        }}>
            <Text style={{ fontSize: 20, flex: 3, paddingStart: 30 }}>{item.id}</Text>
            <Text style={{ fontSize: 18, paddingEnd: 30 }}>{item.value}</Text>
        </View>
    );

    return (
        <SafeAreaView>
            <FlatList data={route.params.data} renderItem={renderItem} keyExtractor={item => item.id} />
        </SafeAreaView>
    );
}