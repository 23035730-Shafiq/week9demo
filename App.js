import React, { useEffect, useState } from 'react';
import { FlatList, StatusBar, Text, TextInput, View } from 'react-native';

const App = () => {
    const [myData, setMyData] = useState([]);

    const myurl = "https://week9demo.onrender.com/payments";

    useEffect(() => {
        fetch(myurl)
            .then(response => response.json())
            .then(json => setMyData(json))
            .catch(err => console.log(err));
    }, []);

    const renderItem = ({ item }) => (
        <View style={{ borderWidth: 1, padding: 8, marginBottom: 6 }}>
            <Text>Payment ID: {item.paymentid}</Text>
            <Text>Amount: {item.amount}</Text>
            <Text>Status: {item.payment_status}</Text>
            <Text>Method: {item.payment_method}</Text>
        </View>
    );

    return (
        <View style={{ padding: 12 }}>
            <StatusBar />
            <Text>Search:</Text>
            <TextInput style={{ borderWidth: 1, marginBottom: 10, padding: 6 }} />

            <FlatList
                data={myData}
                renderItem={renderItem}
                keyExtractor={(item) => item.paymentid.toString()}
            />
        </View>
    );
};

export default App;
