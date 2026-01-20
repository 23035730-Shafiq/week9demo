import React, { useState } from 'react';
import { StatusBar, View, Button, Text, TextInput, Alert } from 'react-native';

const BASE_URL = "https://week9demo.onrender.com/"; // <-- CHANGE THIS
const POST_URL = `${BASE_URL}/payments`;

const Add = ({ navigation, route }) => {
    const [amount, setAmount] = useState("");
    const [paymentStatus, setPaymentStatus] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    const onAdd = () => {
        if (amount === "" || paymentStatus === "" || paymentMethod === "" || imageUrl === "") {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        const body = {
            amount: Number(amount),
            payment_status: paymentStatus,
            payment_method: paymentMethod,
            image_url: imageUrl,
        };

        fetch(POST_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        })
            .then((res) => res.json())
            .then((json) => {
                Alert.alert("Success", json.message || "Payment added");
                if (route?.params?.refresh) route.params.refresh();
                navigation.navigate("Home");
            })
            .catch((err) => {
                console.log(err);
                Alert.alert("Error", "Failed to add payment");
            });
    };

    return (
        <View style={{ padding: 12 }}>
            <StatusBar />
            <Text>Amount:</Text>
            <TextInput style={{ borderWidth: 1, marginBottom: 10, padding: 8 }} keyboardType="numeric" onChangeText={setAmount} />

            <Text>Payment Status (e.g. completed/failed):</Text>
            <TextInput style={{ borderWidth: 1, marginBottom: 10, padding: 8 }} onChangeText={setPaymentStatus} />

            <Text>Payment Method (e.g. visa/mastercard):</Text>
            <TextInput style={{ borderWidth: 1, marginBottom: 10, padding: 8 }} onChangeText={setPaymentMethod} />

            <Text>Image URL:</Text>
            <TextInput style={{ borderWidth: 1, marginBottom: 10, padding: 8 }} onChangeText={setImageUrl} />

            <Button title="Add" onPress={onAdd} />
        </View>
    );
};

export default Add;
