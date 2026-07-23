import { useEffect, useState, useRef } from 'react';
import { FaEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { CiBoxList } from "react-icons/ci";
import { v4 as uuidv4 } from 'uuid';


function App() {

  const [task, setTask] = useState("")
  const [tasks, setTasks] = useState([])
  const [changestatus, setchangeStatus] = useState(false)
  const [editID, setEditID] = useState(null)
  const [editText, setEditText] = useState("")
  const [active, setActive] = useState("pending")
  const editRef = useRef()

  useEffect(() => {
    let Data = localStorage.getItem("tasks")
    if (Data) {
      let tasks = JSON.parse(localStorage.getItem("tasks"))
      setTasks(tasks)
    }
  }, [])

  const save = (newtask) => {
    localStorage.setItem("tasks", JSON.stringify(newtask))
  }

  const handleChange = (e) => {
    setTask(e.target.value)
  }

  const showComplete = () => {
    setchangeStatus(true)
    setActive("complete")
  }

  const showPending = () => {
    setchangeStatus(false)
    setActive("pending")
  }

  const handleAdd = (e) => {
    e.preventDefault()
    if (task.trim() === "") return;

    let newtask = [...tasks, { id: uuidv4(), task, isCompleted: false }]
    setTasks(newtask)
    setTask("")
    save(newtask)
  }

  const handleCheck = (e) => {
    let id = e.target.id
    let index = tasks.findIndex(item => {
      return item.id === id
    })
    let newTasks = [...tasks]
    newTasks[index].isCompleted = !newTasks[index].isCompleted
    setTasks(newTasks)
    save(newTasks)
  }

  const handleEdit = (id, task) => {
    setEditID(id)
    setEditText(task)
  }

  const handleUpdate = () => {
    let updatedTask = tasks.map(item => {
      return item.id === editID ?
        { ...item, task: editText }
        : item
    })
    setTasks(updatedTask)
    setEditID(null)
    setEditText("")
    save(updatedTask)
  }


  const handleDelete = (e, id) => {
    let newTasks = tasks.filter(item => {
      return item.id !== id
    })
    setTasks(newTasks)
    save(newTasks)
  }

  return (
    <>
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 py-5">

        <nav className='w-2/4 mx-auto rounded-2xl bg-white shadow-lg border border-gray-200 py-3'>
          <div className="flex items-end justify-center gap-3 cursor-pointer transition-all duration-300 hover:scale-105">
            <span className='text-3xl font-bold text-indigo-600'>iTask</span>
            <span className='italic text-gray-500 '>- Plan Your Day, Own Your Life</span>
          </div>
        </nav>
        <div className="w-2/4 mx-auto mt-6 rounded-3xl bg-white p-6 shadow-xl border border-gray-200">
          <div className="mb-2 mx-2">
            <p className="text-2xl font-bold text-gray-800">Add Task</p>
          </div>
          <div className='mb-3'>
            <form className='flex gap-2'>
              <input
                className='w-full rounded-xl border border-gray-300 bg-white px-4 py-1 text-gray-700 placeholder:text-gray-700 outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100'
                // className='w-full px-4 rounded-2xl border border-gray-300 bg-gray-200 text-gray-800 placeholder-gray-400 shadow-sm outline-none focus:ring-2 focus:ring-gray-400 focus:border-blue-300 transition duration-200'
                value={task}
                placeholder='Enter Your Task'
                onChange={handleChange}
                type="text"
                name="Task"
              />
              <button
                type='submit'
                onClick={handleAdd}
                disabled={task.length < 4}
              className="rounded-xl bg-indigo-600 px-6 py-1 font-semibold text-white shadow-md transition-all duration-300 hover:bg-indigo-700 hover:shadow-lg disabled:cursor-not-allowed disabled:bg-indigo-300"
              // className="cursor-pointer bg-gray-700 rounded-2xl px-5 py-1 text-white hover:font-bold "
              >
                Add
              </button>
            </form>
          </div>

          <div className="flex items-center gap-2 mt-5">
            <CiBoxList color='#4f46e5' size={22} />
            <font className="text-lg font-semibold text-gray-700">Your Tasks</font>
          </div>

          {/* Silde Button */}
          <div
            className="relative my-4 flex w-72 rounded-3xl bg-gray-200 p-1 shadow-inner"
          //  className="relative flex my-2 w-72 p-1 bg-slate-800 rounded-2xl overflow-hidden"
          >

            <div
              className={`absolute left-1 top-1 h-[85%] w-[48%] rounded-3xl transition-all duration-300 ${active === "complete" ? "translate-x-full bg-green-600" : "bg-red-600"}`}
              // className={` absolute top-1 left-1 w-[48%] h-[85%] rounded-xl  transition-transform duration-300 ease-in-out ${active === "complete" ? "translate-x-full  bg-green-900" : "bg-red-900"}`}
            />



            <button
              onClick={showPending}
              className={`relative z-10 w-1/2 rounded-3xl py-1 font-semibold transition-colors duration-300 ${active === "pending" ? "text-white" : "text-gray-600"}`}
              // className={`relative z-10 w-1/2 font-semibold transition-colors duration-300 ${active === "pending" ? "text-white" : "text-black"}`}
            >
              pending
            </button>
            <button
              onClick={showComplete}
              className={`relative z-10 w-1/2 py-1 rounded-3xl  font-semibold transition-colors duration-300 ${active === "complete" ? "text-white" : "text-black"}`}
            >
              completed
            </button>
          </div>

          <hr className="border-gray-300 my-3" />

          {tasks.length === 0 ? (<div className='mt-10 text-center text-lg font-medium text-gray-400'>No Tasks to Dispay</div>) : (<div className="h-96 overflow-y-auto rounded-xl">
            {tasks
              .filter(item =>
                item && (changestatus ? item.isCompleted : !item.isCompleted)
              )
              .map(item => {
                return (
                  <>

                    <div 
                    className="my-3 flex items-center justify-between rounded-xl border-gray-200 bg-gray-50 p-4 transition-all duration-300 hover:bg-white hover:shadow-md" key={item.id}
                    // className=" min-h-11 px-2 Task flex items-center justify-between gap-3" key={item.id}
                    >

                      <div className='right flex gap-3'>
                        <div>
                          <input
                            type="checkbox"
                            id={item.id}
                            onChange={handleCheck}
                            checked={item.isCompleted}
                          />
                        </div>
                        {editID === item.id ? (
                          <input
                            type="text"
                            value={editText}
                            onChange={(e) => {
                              setEditText(e.target.value)
                            }}
                            autoFocus
                            className='w-96 rounded-xl border border-gray-300 px-4 py-1 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100'
                            // className='w-100 px-4 rounded-2xl border border-gray-300 bg-gray-200 text-gray-800 placeholder-gray-400 shadow-sm outline-none focus:ring-2 focus:ring-gray-400 focus:border-blue-300 transition duration-200'
                          />
                        ) : (
                          <div className={item.isCompleted ? "text-gray-400 line-through" : "text-gray-700 font-medium"}>
                            {item.task}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-3">
                        {editID === item.id ? (
                          <button
                            onClick={handleUpdate}
                            className="rounded-lg bg-green-500 px-5 py-1 font-medium text-white transition-all hover:bg-green-600"
                            // className="cursor-pointer bg-gray-700 rounded-2xl  px-5 mx-1 text-white hover:font-bold "
                          >
                            Save
                          </button>
                        ) : (
                          <button
                            onClick={(e) => handleEdit(item.id, item.task)}
                            className="rounded-lg text-blue-500 px-2 py-1 transition-all hover:text-blue-600 hover:scale-105"
                            // className="cursor-pointer bg-gray-700 p-2 py-1 text-sm rounded-md mx-1 text-white hover:font-bold "
                          >
                            <FaEdit className=''/>
                          </button>
                        )}
                        <button
                          onClick={(e) => handleDelete(e, item.id)}
                          className="rounded-lg text-red-500 transition-all hover:text-red-600 hover:scale-105"
                        >
                          <AiFillDelete />
                        </button>
                      </div>
                    </div>
                  
                  </>
                )
              })}
          </div>)}

        </div>
      </div>
    </>
  )
}

export default App