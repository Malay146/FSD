import React, { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

function Home() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [editIndex, setEditIndex] = useState(null);

  const handleAddTask = () => {
    if (input.trim() === "") return;

    if (editIndex !== null) {
      const updatedTasks = [...tasks];
      updatedTasks[editIndex] = input;
      setTasks(updatedTasks);
      setEditIndex(null);
    } else {
      setTasks([...tasks, input]);
    }
    setInput("");
  };

  const handleEdit = (index) => {
    setInput(tasks[index]);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const updated = tasks.filter((_, i) => i !== index);
    setTasks(updated);
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center font-[Montserrat] text-white">
      <div className="flex flex-col justify-center items-center border-[0.75rem] rounded-lg border-[#8758ff] bg-[#1a1a40] p-7">
        <h1 className="text-4xl font-bold">Get things Done</h1>
        <div className="border-2 border-[#8758ff] mt-6 mb-4 w-[25rem] flex justify-between">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="What is the task today?"
            className="bg-[#1a1a40] border-[#8758ff] py-2 px-2 w-[75%]"
          />
          <button
            onClick={handleAddTask}
            className="bg-[#8758ff] px-3 py-2 w-[25%]"
          >
            {editIndex !== null ? "Update" : "Add Task"}
          </button>
        </div>

        <div className="Content">
          {tasks.map((task, index) => (
            <div
              key={index}
              className="flex justify-between bg-[#8758ff] w-[25rem] py-2 m-4 rounded-md"
            >
              <p className="my-1 mx-4 ">{task}</p>
              <div className="flex gap-2 justify-center items-center px-3 text-xl">
                <button onClick={() => handleEdit(index)}>
                  <FaEdit />
                </button>
                <button onClick={() => handleDelete(index)}>
                  <MdDelete />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
