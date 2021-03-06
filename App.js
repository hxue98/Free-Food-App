import React, {Component} from 'react';
import {YellowBox} from 'react-native';
import API from '@aws-amplify/api';
import PubSub from '@aws-amplify/pubsub';
import config from './aws-exports';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {Provider} from 'react-redux';
import CommentComponent from './src/components/Comment/CommentComponent';
import LocationDetailComponent from './src/components/LocationDetail/LocationDetailComponent';
import MapsComponent from './src/components/Maps/MapsComponent';
import RegisterComponent from './src/components/Login/RegisterComponent';
import LoadingComponent from './src/components/Loading/LoadingComponent';
import LoginComponent from './src/components/Login/LoginComponent';
import CreateEvents from './src/components/Events/CreateEvents';
import MyAccount from './src/components/MyAccount/MyAccountComponent';
import MyEvents from './src/components/Events/MyEvents';
import EventDetail from './src/components/Events/EventDetailComponents';
import Settings from './src/components/MyAccount/Settings';
import Feedback from './src/components/Feedback/Feedback';
import store from './src/redux/store';
API.configure(config);
PubSub.configure(config);

const Stack = createStackNavigator();
YellowBox.ignoreWarnings(['Require cycle:']);

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Loading"
            component={LoadingComponent}
            options={{headerShown: false}}
          />
          <Stack.Screen name="Login" component={LoginComponent} />
          <Stack.Screen name="Register" component={RegisterComponent} />
          <Stack.Screen
            name="Maps"
            component={MapsComponent}
            options={{title: 'Free Food Map'}}
          />
          <Stack.Screen name="Detail" component={LocationDetailComponent} />
          <Stack.Screen name="Comments" component={CommentComponent} />
          <Stack.Screen name="CreateEvents"
            component={CreateEvents}
            options={{title: 'Create a new event'}}
          />
          <Stack.Screen name="MyAccount"
            component={MyAccount}
            options={{title: 'My Account'}}
          />
          <Stack.Screen name="MyEvents"
            component={MyEvents}
            options={{title: 'My Events'}}
          />
          <Stack.Screen name="EventDetail"
            component={EventDetail}
            options={{title: 'Event Detail'}}
          />
          <Stack.Screen name="Settings" component={Settings} />
          <Stack.Screen name="Feedback" component={Feedback} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
