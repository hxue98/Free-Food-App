import React, {Component} from 'react';
import {
  Alert,
  View,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import API, {graphqlOperation} from '@aws-amplify/api';
import lambda from '../../api';
import CreateEvents from '../Events/CreateEvents';
import LocationDetailComponent from '../LocationDetail/LocationDetailComponent';
import {GOOGLE_API_KEY} from '../../../config';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-community/async-storage';

export default class MapComponent extends Component {
  constructor(props) {
    props.navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={styles.logout}
          onPress={async () => {
            Alert.alert('Log out', 'Are you sure to log out?', [
              {text: 'Cancel'},
              {
                text: 'OK',
                onPress: async () => {
                  await AsyncStorage.removeItem('@token');
                  this.props.navigation.replace('Login');
                },
              },
            ]);
          }}>
          <Image
            style={styles.logoutImage}
            source={require('../../res/images/logout.png')}
          />
        </TouchableOpacity>
      ),
    });
    super(props);
    this.state = {
      initLocation: null,
      region: null,
      events: [],
      locationFetchCompolete: false,
      queryComplete: false,
      search: '',
      eventDetail: null,
    };
  }

  getCurrentLocation() {
    Geolocation.getCurrentPosition(
      position => {
        const region = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.00822 * 2.5,
          longitudeDelta: 0.00401 * 2.5,
          key: 123456,
        };

        this.setState({
          initLocation: region,
          region: region,
          locationFetchCompolete: true,
        });
      },
      error => {
        console.error(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  }

  async componentDidMount() {
    this.getCurrentLocation();

    const request = {
        operation: 'GETEVENTS'
    };
    const response = await lambda(request);
    this.setState({events: response.events, queryComplete: true});
  }
  onRegionChange(region) {
    this.setState({region});
  }
  setRegion(details) {
    this.setState({
      region: {
        latitude: details.geometry.location.lat,
        longitude: details.geometry.location.lng,
        latitudeDelta: 0.00822 * 2.5,
        longitudeDelta: 0.00401 * 2.5,
        key: 123456,
      },
    });
  }

  showDetail(event) {
    if (this.state.eventDetail) {
      this.setState({
        eventDetail: null,
      });
    }
    this.setState({
      eventDetail: {...event},
    });
  }

  hideDetail() {
    this.setState({
      eventDetail: null,
    });
  }

  navigateToComment = eventId => {
    this.props.navigation.navigate('Comments', {eventId: eventId});
  };

  render() {
    const component =
      this.state.locationFetchCompolete && this.state.queryComplete ? (
        <View style={styles.container}>
          <MapView
            provider={PROVIDER_GOOGLE}
            initialRegion={this.state.initLocation}
            region={this.state.region}
            onRegionChangeComplete={region => this.onRegionChange(region)}
            style={styles.map}
            onPress={() => this.hideDetail()}>
            {this.state.events.map(event => (
              <Marker
                coordinate={{
                  latitude: event.latitude,
                  longitude: event.longitude,
                }}
                key={event.eventId}
                onPress={() => this.showDetail(event)}
              />
            ))}
            <Marker
              coordinate={this.state.initLocation}
              pinColor="blue"
              onPress={() => this.hideDetail()}
            />
          </MapView>
          <View style={styles.searchContainer}>
            <GooglePlacesAutocomplete
              placeholder="Search Location"
              minLength={2} // minimum length of text to search
              autoFocus={false}
              returnKeyType={'search'}
              listViewDisplayed="true" // true/false/undefined
              fetchDetails={true}
              renderDescription={row => row.description} // custom description render
              onPress={(data, details) => {
                this.setRegion(details);
              }}
              ref={c => (this.googlePlacesAutocomplete = c)}
              query={{
                key: GOOGLE_API_KEY,
                language: 'en',
              }}
              styles={{
                container: {
                  backgroundColor: '#ffffffd3',
                },
                textInputContainer: {
                  width: '100%',
                },
                description: {
                  fontWeight: 'bold',
                },
                predefinedPlacesDescription: {
                  color: '#1faadb',
                },
              }}
            />
            <TouchableOpacity
              onPress={() => this.googlePlacesAutocomplete.setAddressText('')}
              style={styles.cancelSearch}>
              <Image
                style={styles.cancelSearchImage}
                source={require('../../res/images/clear-search-24.png')}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.addBtn}>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('CreateEvents', {currentLocation: this.state.initLocation})}>
              <Image
                style={styles.addImage}
                source={require('../../res/images/add-50.png')}
              />
            </TouchableOpacity>
          </View>
          {this.state.eventDetail !== null && (
            <Animatable.View
              style={styles.detail}
              animation="fadeInUp"
              duration={500}>
              <LocationDetailComponent
                eventId={this.state.eventDetail.eventId}
                time={
                  new Date(
                    this.state.eventDetail.startTime,
                  ).toLocaleDateString() +
                  '                 ' +
                  new Date(this.state.eventDetail.startTime)
                    .toLocaleTimeString()
                    .substring(0, 5) +
                  ' - ' +
                  new Date(this.state.eventDetail.endTime)
                    .toLocaleTimeString()
                    .substring(0, 5)
                }
                description={this.state.eventDetail.description}
                address={this.state.eventDetail.address}
                navigateToComment={this.navigateToComment}
              />
            </Animatable.View>
          )}
        </View>
      ) : (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );

    return <View>{component}</View>;
  }
}

const window = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    height: window.height,
    width: window.width,
  },
  loading: {
    height: window.height,
    width: window.width,
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  search: {
    flexDirection: 'row',
    marginTop: 10,
    backgroundColor: '#ffffffcf',
    borderColor: '#a6a6a6',
    borderWidth: 0.5,
    width: '90%',
    alignSelf: 'center',
  },
  input: {
    height: 45,
    width: '90%',
    fontSize: 17,
  },
  btn: {
    height: 30,
    width: 30,
    marginTop: 7,
  },
  detail: {
    width: '90%',
    backgroundColor: '#dbd9cedf',
    alignSelf: 'center',
    position: 'absolute',
    bottom: '15%',
    borderRadius: 11,
  },
  addBtn: {
    right: 25,
    position: 'absolute',
    bottom: '15%',
  },
  addImage: {
    height: 50,
    width: 50,
  },
  searchContainer: {
    flexDirection: 'row',
    width: window.width,
  },
  cancelSearch: {
    marginTop: 9,
    right: 10,
    position: 'absolute',
    backgroundColor: 'white'
  },
  cancelSearchImage: {
    width: 25,
    height: 25,
    opacity: 0.2,
  },
  logout: {
    right: 10,
  },
  logoutImage: {
    width: 40,
    height: 40,
  },
});
