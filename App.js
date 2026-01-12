import React,{useEffect,useState} from 'react';
import { FlatList, StatusBar, Text, TextInput, View} from 'react-native';

const App = () => {
    const [myData, setMyData] = useState([]);

    //Add fetch() - Exercise 1A
    const myurl = "https://onlinecardappwebservice-cz5e.onrender.com/allcards"
    useEffect(()=>{
        fetch(myurl)
            .then((response) => {
                return response.json();
            })
            .then((myJson)=>{
                setMyData(myJson);
            });
    },[]);

    const renderItem = ({item, index}) => {
        return (
            <View>
                <Text style={{borderWidth:1}}>{item.card_name}</Text>
            </View>
        );
    };

    return (
        <View>
            <StatusBar/>
            <Text>Search:</Text>
            <TextInput style={{borderWidth:1}}/>
            <FlatList data={myData} renderItem={renderItem} />
        </View>
    );
}

export default App;