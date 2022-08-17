import './App.css';

import { useState, useEffect } from "react"
import { IoTrashOutline, IoCheckboxSharp, IoCheckboxOutline,  } from "react-icons/io5" 

const API = "http://localhost:5000"

function App() {
  const [title, setTitle] = useState("")
  const [time, setTime] = useState("")
  const [todo, setTodos] = useState([])
  const [loading, setLoading] = useState(false)

  // hook acionado quando a pagiana carregua
  useEffect( () => {
    const loadData = async() => {
      setLoading(true)

      const res = await fetch(API + "/todo")
      .then((res) =>  res.json())
      .then((data) => data)
      .catch((erro) => console.log(erro))

    setLoading(false)

    setTodos(res)
    }

    loadData()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const todo = {
      id: Math.random(),
      title,
      time,
      done: false
    }
  

    await fetch(API + "/todo", {
      method: "POST",
      body: JSON.stringify(todo),
      headers: { "Content-Type": "application/json",}
    })
    setTodos((prevState) => [...prevState, todo])

    // limpar os campos
    setTitle("")
    setTime("")
}

const handleDelete = async(id) => {
  await fetch(API + "/todo/" + id, {
    method: "DELETE",
  })

  setTodos((prevState) => prevState.filter((todo) => todo.id !== id))
}

const handleEdit = async(i) => {
  i.done = !i.done

  const data = await fetch(API + "/todo/" + i.id, {
    method: "PUT",
    body: JSON.stringify(i),
    headers: { "Content-Type": "application/json"}
})

setTodos((prevState) =>
  prevState.map((t) => (t.id === data.id ? (t = data) : t))
 )
}



if (loading) {
  return <p>Carregando...</p>
}

  return (
    <div className="App">
        <div className='todo-header'>
          <h1>React Todo</h1>
        </div>
        <div className='form-todo'>
          <h2>Insira a sua próxima tarefa</h2>
          <form onSubmit={handleSubmit}>
            <div className='form-control'>
              <label htmlFor='title'>O que você vai fazer: </label>
              <input
                type="text"
                name="title"
                placeholder='Títolo da tarefa'
                onChange={(e) => setTitle(e.target.value)}
                value={title  || ""}
                required 
                />
            </div>
            <div className='form-control'>
              <label htmlFor='time'>Duração: </label>
              <input
                type="text"
                name="time"
                placeholder='Tempo estimado (em horas)'
                onChange={(e) => setTime(e.target.value)}
                value={time  || ""}
                required 
                />
            </div>
            <input type="submit" value="Criar tarefa" />
          </form>
        </div>
        <div className='list-todo'>
          <p>Lista de  tarefe</p>
          {todo.length === 0 && <p>Não há tarefas!</p>}
          {todo.map((i) =>
          <div className='todo' key={i.id}>
            <h3 className={i.done ? "todo-done" : ""}>{i.title}</h3>
            <p>Duração: {i.time}</p>
            <div className='action'>
              <span onClick={() => handleEdit(i)}>
                {!i.done ? <IoCheckboxOutline /> : <IoCheckboxSharp /> }
              </span>
              <IoTrashOutline onClick={() => handleDelete(i.id)} />
            </div>
          </div>
          )}
        </div>
    </div>
  );
}

export default App;
