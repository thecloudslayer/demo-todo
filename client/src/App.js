import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import { CheckLg, PlusLg, Trash } from "react-bootstrap-icons";

import aerospikeLogo from "./aerospike-logo.png";
import "./App.css";

function Todo({ todo, index, completeTodo, removeTodo }) {
  return (
    <div
      className="todo"
      style={{ textDecoration: todo.isCompleted ? "line-through" : "" }}
    >
      {todo.text}
      <div>
        <Button
          variant="outline-success"
          onClick={() => completeTodo(index)}
          style={{ marginRight: "15px" }}
        >
          <CheckLg size={20} />
        </Button>
        <Button variant="outline-danger" onClick={() => removeTodo(index)}>
          <Trash size={20} />
        </Button>
      </div>
    </div>
  );
}

function TodoForm({ addTodo }) {
  const [value, setValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value) return;
    addTodo(value);
    setValue("");
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex" }}>
      <input
        className="todo-input"
        onChange={(e) => setValue(e.target.value)}
        placeholder="Type item"
        type="text"
        value={value}
      />
      <Button variant="outline-dark" onClick={handleSubmit}>
        <PlusLg size={20} />
      </Button>
    </form>
  );
}

let callBackendAPI;
callBackendAPI = async () => {
  const response = await fetch("/todos");
  const body = await response.json();
  console.log("body", body);
  if (response.status !== 200) {
    throw Error(body.message);
  }
  return body.express;
};

function App() {
  const [todos, setTodos] = useState([
    {
      text: "Launch DBaaS",
      isCompleted: false,
    },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await callBackendAPI();
      let fetched = JSON.parse(data);

      setTodos(fetched);
    };

    const result = fetchData()
      // make sure to catch any error
      .catch(console.error);

    // what will be logged to the console?
    console.log("result", result);
    console.log("todos", todos);
  }, []);

  const addTodo = (text) => {
    const newTodos = [...todos, { text }];
    setTodos(newTodos);

    const data = { isCompleted: false, text: text };

    fetch("/addtodo", {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
        url: `http://localhost:5001`,
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const completeTodo = (index) => {
    const newTodos = [...todos];
    newTodos[index].isCompleted = true;
    setTodos(newTodos);

    const data = newTodos[index];

    let index2 = todos.indexOf(newTodos[index]);

    let makeDataReady = { index: index2, data: data };

    fetch("/updatetodo", {
      method: "PUT", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
        url: `http://localhost:5001`,
      },
      body: JSON.stringify(makeDataReady),
    })
      .then((response) => response.json())
      .then((makeDataReady) => {
        console.log("Success:", makeDataReady);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const removeTodo = (index) => {
    const newTodos = [...todos];
    newTodos.splice(index, 1);
    setTodos(newTodos);

    const data = newTodos[index];

    let index2 = todos.indexOf(newTodos[index]);

    let makeDataReady = { index: index2, data: data };

    fetch("/deletetodo", {
      method: "PUT", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
        url: `http://localhost:5001`,
      },
      body: JSON.stringify(makeDataReady),
    })
      .then((response) => response.json())
      .then((makeDataReady) => {
        console.log("Success:", makeDataReady);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div className="app">
      <img
        src={aerospikeLogo}
        width="350px"
        height="30px"
        className="aerospike-logo"
      />
      <div className="todo-list">
        {todos.map((todo, index) => (
          <Todo
            key={index}
            index={index}
            todo={todo}
            completeTodo={completeTodo}
            removeTodo={removeTodo}
          />
        ))}
        <TodoForm addTodo={addTodo} />
      </div>
    </div>
  );
}

export default App;
