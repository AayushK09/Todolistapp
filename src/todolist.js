import React, { useState, useEffect } from 'react';
import './todolist.css';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [editText, setEditText] = useState('');
  const [draggedIndex, setDraggedIndex] = useState(null);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleAddTodo = () => {
    if (inputValue.trim() !== '') {
      setTodos([...todos, { text: inputValue, completed: false }]);
      setInputValue('');
    }
  };

  const handleEditTodo = (index) => {
    setEditIndex(index);
    setEditText(todos[index].text);
  };

  const handleUpdateTodo = (index) => {
    const newTodos = [...todos];
    newTodos[index].text = editText;
    setTodos(newTodos);
    setEditIndex(null);
    setEditText('');
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleAddTodo();
    } else if (event.key === 'Delete') {
      if (event.ctrlKey) {
        setTodos([]); // Delete all items from the todo list
      } else {
        // Delete only one item if Delete key is pressed without Ctrl
        if (todos.length > 0) {
          const lastIndex = todos.length - 1;
          const newTodos = todos.slice(0, lastIndex);
          setTodos(newTodos);
        }
      }
    }
  };
  

  const handleDeleteTodo = (index) => {
    const newTodos = [...todos];
    newTodos.splice(index, 1);
    setTodos(newTodos);
  };

  const handleToggleTodo = (index) => {
    const newTodos = [...todos];
    newTodos[index].completed = !newTodos[index].completed;
    setTodos(newTodos);
  };

  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const targetIndex = event.target.getAttribute('data-index');
    const newTodos = [...todos];
    const draggedTodo = newTodos[draggedIndex];
    newTodos.splice(draggedIndex, 1);
    newTodos.splice(targetIndex, 0, draggedTodo);
    setTodos(newTodos);
    setDraggedIndex(null);
  };

  const handleDoubleClick = (index) => {
    handleEditTodo(index);
  };

  const handleInputBlur = (index) => {
    handleUpdateTodo(index);
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]); // Empty dependency array ensures this effect runs only once on mount

  return (
    <div className="todo-list">
      <h1>To-Do List</h1>
      <div>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Enter your to-do"
        />
        <button onClick={handleAddTodo}>Add</button>
      </div>
      <ul>
        {todos.map((todo, index) => (
          <li
            key={index}
            data-index={index}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={draggedIndex === index ? 'dragged' : ''}
          >
            <div
              className="todo-container"
              onClick={() => handleToggleTodo(index)}
              onDoubleClick={() => handleDoubleClick(index)}
            >
              {editIndex === index ? (
                <input
                  type="text"
                  value={editText}
                  onChange={(event) => setEditText(event.target.value)}
                  onBlur={() => handleInputBlur(index)}
                  onKeyPress={(event) => {
                    if (event.key === 'Enter') {
                      handleUpdateTodo(index);
                    }
                  }}
                  autoFocus
                />
              ) : (
                <span className={todo.completed ? 'todo-item completed' : 'todo-item'}>
                  {todo.text}
                </span>
              )}
            </div>
            <button onClick={() => handleDeleteTodo(index)} className="delete-button">
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;