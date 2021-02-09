import React, {useState, useEffect} from 'react';

import { useUser } from '../lib/hooks';
import Layout from './layout';
import TodoForm from './todoForm';
import {useHistory} from "react-router-dom"
import {definitions} from '../utils/config.json'
import { Card, Spacer, Loading, Row } from '@geist-ui/react'

const Home = (props) => {
  const user = useUser();
  const idx = props.idx ? props.idx : null
  const [todos, setTodos] = useState([]);
  const history = useHistory();
  
  useEffect(() => {
    async function fetch(){
        try{
            if(idx){
                const [todoList] = await Promise.all([
                idx.get(definitions.todo, idx.id)]);
                console.log(todoList); 
                todoList ? setTodos(todoList.documents) : setTodos([])  
            }
        }catch(err){
            console.log(err)
        }
    }
    fetch()
}, [idx])

    const addTodo = async (todo) => {
      const newTodos = [...todos, todo];
      setTodos(newTodos)
      console.log(newTodos)
      await idx.set(definitions.todo, {
          documents: newTodos
      })
      console.log("done")
    }


  return (
    <Layout>
      {user ? (  
        <>
          <TodoForm addTodo={addTodo}/>
          {
                        todos ? (
                            <div>
                            {todos.map((todo, index) => {
                                return(
                                  <>
                                  <Card key={index}>
                                    <p>{todo}</p>
                                  </Card>
                                  <Spacer key={index} x={1} />
                                  </>
                                )
                            })}
                            </div>
                        ) : (
                          <>
                            <Loading>Loading</Loading>
                          </>
                        )
                    }
        </>

      ) :
      (
        <div>You're not logged in!</div>
      
      )}
    </Layout>
  );
};

export default Home;