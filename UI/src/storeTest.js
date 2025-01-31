import { createStore } from 'redux';

const todos = (state = [], action) => {
    switch (action.type) {
      case 'ADD_TODO':
        console.log("Aswin inside store");
        return [
          ...state,
          {
            id: action.id,
            text: action.text,
            completed: false
          }
        ]
      case 'TOGGLE_TODO':
        return state.map(todo =>
          (todo.id === action.id)
            ? {...todo, completed: !todo.completed}
            : todo
        )
      default:
        return state
    }
  }

export const store = createStore(todos);