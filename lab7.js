import React, { useState, useEffect } 
from 'react';
import {SafeAreaView,View,Text,TextInput,FlatList,TouchableOpacity,Image,StyleSheet,
ActivityIndicator,ScrollView,} 
from 'react-native';
import { NavigationContainer } 
from '@react-navigation/native';
import { createStackNavigator } 
from '@react-navigation/stack';

const Stack = createStackNavigator();
const API_URL = 'https://66fcb8cdc3a184a84d17c56e.mockapi.io/donut'; 
const mockApiData = {
  Donut: [
    {
      id: '1',
      name: 'Tasty Donut',
      price: '$10.00',
      description: 'Spicy tasty donut family',
      image: 'https://snack-code-uploads.s3.us-west-1.amazonaws.com/~asset/123754dea04991debf0bf6c787556bd3',
    },
    {
      id: '4',
      name: 'Tasty Donut',
      price: '$10.00',
      description: 'Spicy tasty donut family',
      image: 'https://snack-code-uploads.s3.us-west-1.amazonaws.com/~asset/03537bb182da43b7bebaed63f7d062ec',
    },
  ],
  'Pink Donut': [
    {
      id: '2',
      name: 'Pink Donut',
      price: '$20.00',
      description: 'Spicy tasty donut family',
      image: 'https://snack-code-uploads.s3.us-west-1.amazonaws.com/~asset/998bf2e064e5170a94b4f84f62846433',
    },
  ],
  Floating: [
    {
      id: '3',
      name: 'Floating Donut',
      price: '$30.00',
      description: 'Spicy tasty donut family',
      image: 'https://snack-code-uploads.s3.us-west-1.amazonaws.com/~asset/997c8ac1112915ec85b4b59a55a15a18',
    },
  ],
};

const fetchData = (category) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockApiData[category] || []);
    }, 1000); 
  });
};

const DonutList = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState('Donut');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchData(selectedCategory)
      .then((fetchedData) => {
        setData(fetchedData);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch data');
        setLoading(false);
      });
  }, [selectedCategory]);

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('DonutDetail', { donut: item })}>
      <View style={styles.itemContainer}>
        <Image source={{ uri: item.image }} style={styles.itemImage} />
        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemDescription}>{item.description}</Text>
          <Text style={styles.itemPrice}>{item.price}</Text>
        </View>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.welcomeText}>Welcome, Jala!</Text>
        <Text style={styles.headerText}>Choose your Best food</Text>
        <TextInput style={styles.searchBox} placeholder="Search food" />

        <View style={styles.categoryContainer}>
          {['Donut', 'Pink Donut', 'Floating'].map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.selectedCategoryButton,
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={styles.categoryText}>{category}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <FlatList
            data={data}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const DonutDetail = ({ route }) => {
  const { donut } = route.params;
   const [quantity, setQuantity] = useState(1);

   const incrementQuantity = () => {
    setQuantity(prevQuantity => prevQuantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prevQuantity => prevQuantity - 1);
    }
  };

  return (
    <ScrollView style={styles.detailContainer}>
      <Image source={{ uri: donut.image }} style={styles.donutImage} />
      <Text style={styles.donutName}>{donut.name}</Text>
      <Text style={styles.donutDescription}>{donut.description}</Text>
      <Text style={styles.donutPrice}>{donut.price}</Text>

      {/* Delivery info */}
      <View style={styles.deliveryInfo}>
        <Text style={styles.deliveryText}>Delivery in</Text>
        <Text style={styles.deliveryTime}>30 min</Text>
      </View>

      {/* Quantity controls */}
      <View style={styles.quantityContainer}>
        <TouchableOpacity style={styles.quantityButton} onPress={decrementQuantity}>
          <Text style={styles.quantityButtonText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantityText}>{quantity}</Text>
        <TouchableOpacity style={styles.quantityButton} onPress={incrementQuantity}>
          <Text style={styles.quantityButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Restaurant Info */}
      <Text style={styles.restaurantInfoTitle}>Restaurants info</Text>
      <Text style={styles.restaurantInfoText}>
        Order a Large Pizza but the size is the equivalent of a medium/small from other places at the same price range.
      </Text>

      {/* Add to cart button */}
      <TouchableOpacity style={styles.addToCartButton}>
        <Text style={styles.addToCartButtonText}>Add to cart</Text>
      </TouchableOpacity>
    </ScrollView>

  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="DonutList">
        <Stack.Screen name="DonutList" component={DonutList} options={{ title: 'Best Food' }} />
        <Stack.Screen name="DonutDetail" component={DonutDetail} options={{ title: 'Detail' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 8, 
    backgroundColor: '#fff',
  },
  welcomeText: {
    fontSize: 14, 
    marginBottom: 4,
  },
  headerText: {
    fontSize: 20, 
    fontWeight: 'bold',
    marginBottom: 10,
  },
  searchBox: {
    height: 36, 
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 10,
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12, 
  },
  categoryButton: {
    padding: 8, 
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f5f5f5',
  },
  selectedCategoryButton: {
    backgroundColor: '#ffc107',
  },
  categoryText: {
    fontSize: 14, 
  },
  list: {
    paddingBottom: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8, 
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    marginBottom: 10, 
  },
  itemImage: {
    width: 60, 
    height: 60, 
    borderRadius: 8,
    marginRight: 8, 
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16, 
    fontWeight: 'bold',
  },
  itemDescription: {
    fontSize: 12, 
    color: '#888',
  },
  itemPrice: {
    fontSize: 14, 
    color: '#333',
  },
  addButton: {
    width: 36, 
    height: 36, 
    borderRadius: 18,
    backgroundColor: '#ffc107',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: 20, 
    color: '#fff',
  },
  detailContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  donutImage: {
    width: '100%',
    height: 250, 
    borderRadius: 12,
    marginBottom: 16,
  },
  donutName: {
    fontSize: 24, 
    fontWeight: 'bold',
  },
  donutDescription: {
    fontSize: 14, 
    color: '#666',
    marginBottom: 16,
  },
  donutPrice: {
    fontSize: 20, 
    fontWeight: 'bold',
    color: '#333',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
    detailContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  donutImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    marginBottom: 16,
  },
  donutName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  donutDescription: {
    fontSize: 10,
    color: '#666',
    marginBottom: 16,
  },
  donutPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  deliveryText: {
    fontSize: 10,
    color: '#666',
    marginRight: 8,
  },
  deliveryTime: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffc107',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButtonText: {
    fontSize:10,
    color: '#fff',
  },
  quantityText: {
    fontSize: 10,
    marginHorizontal: 10,
  },
  restaurantInfoTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  restaurantInfoText: {
    fontSize: 10,
    color: '#666',
    marginBottom: 16,
  },
  addToCartButton: {
    width: '100%',
    height: 50,
    borderRadius: 8,
    backgroundColor: '#ffc107',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  addToCartButtonText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
  },
});
