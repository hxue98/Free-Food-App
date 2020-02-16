import React, { useEffect, useReducer } from 'react'
import { StyleSheet, Text, View, Button } from 'react-native';
import API, { graphqlOperation } from '@aws-amplify/api'
import PubSub from '@aws-amplify/pubsub';
//import { createTodo } from './src/graphql/mutations';

import CommentInputComponent from './src/components/Comment/CommentInputComponent';

import config from './aws-exports'
API.configure(config)             // Configure Amplify
PubSub.configure(config)

// async function createNewTodo() {
//   const todo = { name: "Use AppSync" , description: "Realtime and Offline"}
//   await API.graphql(graphqlOperation(createTodo, { input: todo }))
// }

export default function App() {
  // const [state, dispatch] = useReducer(reducer, initialState)

  // useEffect(() => {
  //   getData()
  // }, [])

  // async function getData() {
  //   const todoData = await API.graphql(graphqlOperation(listTodos))
  //   dispatch({type:'QUERY', todos: todoData.data.listTodos.items});
  // }

  return (
    <View style={styles.container}>
      <CommentInputComponent />
    </View>
  );
}

const styles = StyleSheet.create({
   container: {
     backgroundColor: '#ddeeff',
     alignItems: 'center',
     justifyContent: 'center',
     flex: 1
   }
 });

//  // other imports
// import { listTodos } from './src/graphql/queries';

// const initialState = {todos:[]};
// const reducer = (state, action) =>{
//   switch(action.type){
//     case 'QUERY':
//       return {...state, todos:action.todos}
//     case 'SUBSCRIPTION':
//       return {...state, todos:[...state.todos, action.todo]}
//     default:
//       return state
//   }
// };