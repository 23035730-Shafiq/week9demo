import React, { useState } from 'react';
import { StatusBar, View, Button, Text, TextInput, Alert } from 'react-native';

const BASE_URL = "https://week9demo.onrender.com/"; // <-- CHANGE THIS

const Edit = ({ navigation, route }) => {
    const payment = route?.params?.payment;

    const [amount, setAmount] = useState(payment ? String(payment.amount) : "");
    const [paymentStatus, setPaymentStatus] = useState(payment ? payment.payment_status : "");
    const [paymentMethod, setPaymentMethod] = useState(payment ? payment.payment_method : "");
    const [imageUrl, setImageUrl] = useState(payment ? payment.image_url : "");

    if (!payment) {
        return (
            <View style={{ padding: 12 }}>
                <Text>No payment data received.</Text>
            </View>
        );
    }

    const PUT_URL = `${BASE_URL}/payments/${payment.paymentid}`;
    const DELETE_URL = `${BASE_URL}/payments/${payment.paymentid}`;

    const onUpdate = () => {
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

        fetch(PUT_URL, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        })
            .then((res) => res.json())
            .then((json) => {
                Alert.alert("Success", json.message || "Payment updated");
                if (route?.params?.refresh) route.params.refresh();
                navigation.navigate("Home");
            })
            .catch((err) => {
                console.log(err);
                Alert.alert("Error", "Failed to update payment");
            });
    };

    const onDelete = () => {
        Alert.alert("Confirm", "Delete this payment?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete",
                style: "destructive",
                onPress: () => {
                    fetch(DELETE_URL, { method: "DELETE" })
                        .then((res) => res.json())
                        .then((json) => {
                            Alert.alert("Success", json.message || "Payment deleted");
                            if (route?.params?.refresh) route.params.refresh();
                            navigation.navigate("Home");
                        })
                        .catch((err) => {
                            console.log(err);
                            Alert.alert("Error", "Failed to delete payment");
                        });
                },
            },
        ]);
    };

    return (
        <View style={{ padding: 12 }}>
            <StatusBar />
            <Text>Payment ID: {payment.paymentid}</Text>

            <Text style={{ marginTop: 10 }}>Amount:</Text>
            <TextInput
                style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
            />

            <Text>Status:</Text>
            <TextInput
                style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
                value={paymentStatus}
                onChangeText={setPaymentStatus}
            />

            <Text>Method:</Text>
            <TextInput
                style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
                value={paymentMethod}
                onChangeText={setPaymentMethod}
            />

            <Text>Image URL:</Text>
            <TextInput
                style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
                value={imageUrl}
                onChangeText={setImageUrl}
            />

            <Button title="Update" onPress={onUpdate} />
            <View style={{ height: 10 }} />
            <Button title="Delete" onPress={onDelete} />
        </View>
    );
};

export default Edit;
