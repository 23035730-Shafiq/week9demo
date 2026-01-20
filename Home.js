import React, { useEffect, useState } from 'react';
import { StatusBar, Button, FlatList, Text, View, Image, TextInput } from 'react-native';

let originalData = [];

const BASE_URL = "https://week9demo.onrender.com/"; // <-- CHANGE THIS
const GET_URL = `${BASE_URL}payments`;

const Home = ({ navigation }) => {
    const [myData, setMyData] = useState([]);

    const loadData = () => {
        fetch(GET_URL)
            .then((response) => response.json())
            .then((myJson) => {
                setMyData(myJson);
                originalData = myJson;
            })
            .catch((err) => console.log(err));
    };

    useEffect(() => {
        loadData();
    }, []);

    const FilterData = (text) => {
        if (text !== '') {
            const t = text.toLowerCase();
            const filtered = originalData.filter((item) =>
                String(item.payment_method).toLowerCase().includes(t) ||
                String(item.payment_status).toLowerCase().includes(t) ||
                String(item.amount).toLowerCase().includes(t) ||
                String(item.paymentid).toLowerCase().includes(t)
            );
            setMyData(filtered);
        } else {
            setMyData(originalData);
        }
    };

    const renderItem = ({ item }) => {
        return (
            <View style={{ flexDirection: "row", alignItems: "center", borderWidth: 1, padding: 8, marginBottom: 8 }}>
                <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: "bold" }}>ID: {item.paymentid}</Text>
                    <Text>Amount: {item.amount}</Text>
                    <Text>Status: {item.payment_status}</Text>
                    <Text>Method: {item.payment_method}</Text>

                    <View style={{ marginTop: 6 }}>
                        <Button
                            title="Edit"
                            onPress={() => navigation.navigate("Edit", { payment: item, refresh: loadData })}
                        />
                    </View>
                </View>

                <View style={{ flex: 1 }}>
                    <Image
                        source={{ uri: item.image_url }}
                        style={{ width: 150, height: 120 }}
                    />
                </View>
            </View>
        );
    };

    return (
        <View style={{ flex: 1 }}>
            <StatusBar translucent={false} />
            <Text style={{ fontWeight: "bold", margin: 10 }}>Search (id/amount/status/method):</Text>

            <TextInput
                style={{ borderWidth: 1, marginHorizontal: 10, marginBottom: 10, padding: 8 }}
                onChangeText={(text) => FilterData(text)}
                placeholder="e.g. visa, completed, 12.99, 1"
            />

            <View style={{ marginHorizontal: 10, marginBottom: 10 }}>
                <Button title="Add Payment" onPress={() => navigation.navigate("Add", { refresh: loadData })} />
            </View>

            <FlatList
                style={{ margin: 10 }}
                data={myData}
                keyExtractor={(item) => String(item.paymentid)}
                renderItem={renderItem}
            />
        </View>
    );
};

export default Home;
