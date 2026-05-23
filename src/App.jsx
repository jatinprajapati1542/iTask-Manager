import { useEffect, useState } from 'react';
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
      <div className="p-0 m-0 bg-gray-100 w-screen h-screen absolute">

        <nav className='h-11 rounded-2xl bg-gray-700 w-2/4 mx-auto relative top-2'>
          <div className=" logo text-white flex items-end justify-center gap-5 cursor-pointer hover:font-bold transition-all">
            <span className='font-bold text-3xl'>iTask</span>
            <span className='italic '>- Plan Your Day, Own Your Life</span>
          </div>
        </nav>
        <div className="Container w-2/4 mx-auto my-5 bg-gray-500 p-5 rounded-2xl">
          <div className="mb-2 mx-2">
            <p className="text-white text-xl font-semibold">Add Task</p>
          </div>
          <div className='mb-3'>
            <form className='flex gap-2'>
              <input
                className='w-full px-4 rounded-2xl border border-gray-300 bg-gray-200 text-gray-800 placeholder-gray-400 shadow-sm outline-none focus:ring-2 focus:ring-gray-400 focus:border-blue-300 transition duration-200'
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
                className="cursor-pointer bg-gray-700 rounded-2xl px-5 py-1 text-white hover:font-bold "
              >
                Add
              </button>
            </form>
          </div>

          <div className="flex items-center gap-2">
            <CiBoxList color='white' size={20} />
            <font className=" text-white font-semibold">Your Tasks</font>
          </div>

          {/* Silde Button */}
          <div className="relative flex my-2 w-72 p-1 bg-slate-800 rounded-2xl overflow-hidden">

            <div className={` absolute top-1 left-1 w-[48%] h-[85%] rounded-xl  transition-transform duration-300 ease-in-out ${active === "complete" ? "translate-x-full  bg-green-900" : "bg-red-900"}`} />



            <button
              onClick={showPending}
              className={`relative z-10 w-1/2 font-semibold transition-colors duration-300 ${active === "pending" ? "text-white" : "text-black"}`}
            >
              pending
            </button>
            <button
              onClick={showComplete}
              className={`relative z-10 w-1/2 py-1 font-semibold transition-colors duration-300 ${active === "complete" ? "text-white" : "text-black"}`}
            >
              completed
            </button>
          </div>

          <hr className="" />

          {tasks.length === 0 ? (<div className='m-5'>No Tasks to Dispay</div>) : (<div className="Tasklist overflow-y-scroll h-100">
            {tasks
              .filter(item =>
                item && (changestatus ? item.isCompleted : !item.isCompleted)
              )
              .map(item => {
                return (
                  <>

                    <div className=" min-h-11 px-2 Task flex items-center justify-between gap-3" key={item.id}>

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
                            className='w-100 px-4 rounded-2xl border border-gray-300 bg-gray-200 text-gray-800 placeholder-gray-400 shadow-sm outline-none focus:ring-2 focus:ring-gray-400 focus:border-blue-300 transition duration-200'
                          />
                        ) : (
                          <div className={item.isCompleted ? "line-through" : ""}>
                            {item.task}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-3">
                        {editID === item.id ? (
                          <button
                            onClick={handleUpdate}
                            className="cursor-pointer bg-gray-700 rounded-2xl  px-5 mx-1 text-white hover:font-bold "
                          >
                            Save
                          </button>
                        ) : (
                          <button
                            onClick={(e) => handleEdit(item.id, item.task)}
                            className="cursor-pointer bg-gray-700 p-2 py-1 text-sm rounded-md mx-1 text-white hover:font-bold "
                          >
                            <FaEdit />
                          </button>
                        )}
                        <button
                          onClick={(e) => handleDelete(e, item.id)}
                          className="cursor-pointer bg-gray-700 p-2 py-1 text-sm rounded-md mx-1 text-white hover:font-bold "
                        >
                          <AiFillDelete />
                        </button>
                      </div>
                    </div>
                    <hr className="" />
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