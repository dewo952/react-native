import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
} from "react-native";
import axios from "axios";
import { FontAwesome } from "@expo/vector-icons";

const App = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const apiURL = `http://13.233.95.158:5000/api_get_my_events/-1`;
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDQ2N2NhYmZkZTY3NTFkNWZiODU5ZWMiLCJpYXQiOjE2OTI1NDYzNzUsImV4cCI6MTY5NDcwNjM3NX0.auSVj0DyLKzkqI6hVlMytemm8fYWYx5rRXzA8QsmZL4";

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      // Show top 7 post on app loading and as user scroll downs to end load more
      const response = await axios.get(apiURL, config);
      if (page === 1) {
        setData(response.data.data.slice(0, 7));
      } else {
        setData((prevData) => [...prevData, ...response.data.data]);
      }

      setPage(page + 1);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Display Green Dot if event_type is "Online" else display Red Dot
  const renderOnlineStatus = (event) => (
    <View
      style={{
        backgroundColor: event.event_type === "Online" ? "green" : "red",
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 8,
      }}
    />
  );

  const renderItem = ({ item }) => (
    <View style={styles.postContainer}>
      <View style={styles.postHeader}>
        <Image
          source={{ uri: item.user_profile_image }}
          style={styles.userProfileImage}
        />
        <Text style={styles.username}>{item.user}</Text>
        {renderOnlineStatus(item)}
      </View>

      {/* Displaying Dummying image if event_image is empty */}
      {item.event_image ? (
        <Image source={{ uri: item.event_image }} style={styles.eventImage} />
      ) : (
        <Image
          source={{ uri: "https://picsum.photos/id/237/200/300" }}
          style={styles.eventImage}
        />
      )}

      <View style={styles.interactionBar}>
        <FontAwesome name="heart" size={20} color="red" />
        <Text style={styles.likes}>{item.likes} likes</Text>
      </View>
      <Text style={styles.caption}>{item.event_name}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Loading...</Text>
      ) : error ? (
        <Text>Error fetching data: {error.message}</Text>
      ) : (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          onEndReached={fetchEvents}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loadingMore && (
              <Text style={styles.loadingMore}>Loading more...</Text>
            )
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  postContainer: {
    margin: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  userProfileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    fontWeight: "bold",
    flex: 1,
  },
  location: {
    fontSize: 14,
    color: "#666",
  },

  eventImage: {
    width: "100%",
    height: 300,
  },
  interactionBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  likes: {
    marginLeft: 10,
  },
  caption: {
    padding: 10,
  },
  description: {
    paddingLeft: 8,
    marginBottom: 10,
    fontSize: 14,
    color: "#555",
  },
  loadingMore: {
    textAlign: "center",
    padding: 10,
  },
});

export default App;
