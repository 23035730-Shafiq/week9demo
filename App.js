import React, { useEffect, useState } from 'react';
import { FlatList, StatusBar, Text, TextInput, View, StyleSheet } from 'react-native';

// store original data for filtering
let originalData = [];

const App = () => {
    const [myData, setMyData] = useState([]);

    const myurl = "https://week9demo.onrender.com/payments";

    useEffect(() => {
        fetch(myurl)
            .then((response) => response.json())
            .then((myJson) => {
                if (originalData.length < 1) {
                    setMyData(myJson);
                    originalData = myJson;
                }
            })
            .catch((err) => console.log(err));
    }, []);

    // Filter by payment_method OR payment_status
    const FilterData = (text) => {
        const t = text.trim().toLowerCase();

        if (t !== '') {
            const filtered = originalData.filter((item) =>
                String(item.payment_method).toLowerCase().includes(t) ||
                String(item.payment_status).toLowerCase().includes(t)
            );
            setMyData(filtered);
        } else {
            setMyData(originalData);
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.row}>
            <Text style={styles.title}>
                {item.payment_method.toUpperCase()}
            </Text>

            <Image
                source={{ uri: item.image_url }}
                style={styles.image}
                resizeMode="contain"
            />
        </View>
    );



    return (
        <View style={{ flex: 1, padding: 12 }}>
            <StatusBar />
            <Text>Search (method/status):</Text>
            <TextInput
                style={styles.input}
                placeholder="e.g. visa or completed"
                onChangeText={(text) => FilterData(text)}
            />

            <FlatList
                data={myData}
                renderItem={renderItem}
                keyExtractor={(item) => item.paymentid.toString()}
            />
        </View>
    );
};

export default App;

const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        padding: 8,
        marginTop: 6,
        marginBottom: 10,
    },
    row: {
        flexDirection: 'row',
        borderWidth: 1,
        padding: 10,
        marginVertical: 6,
    },
    title: {
        fontWeight: 'bold',
        marginBottom: 4,
    },
    info: {
        flex: 1,
        paddingRight: 10,
    },

    card: {
        justifyContent: 'center',
        alignItems: 'center',
    },

    image: {
        width: 80,
        height: 50,
    },

});
