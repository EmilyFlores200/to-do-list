//import { ToDo } from "~/utils/model/todoType";
import { AiOutlineCheckSquare } from "react-icons/ai";
import { BsTrash } from "react-icons/bs";
import { AiFillCloseCircle } from "react-icons/ai";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import { ToDo } from "@prisma/client";

function ToDoItem({ todoItem }: { todoItem: ToDo }) {
  const [status, setStatus] = useState(todoItem.isCompleted);

  const todoContext = api.useContext().toDo;
  const { mutate } = api.toDo.deleteToDoById.useMutation({
    onSuccess: () => {
      setStatus(!status);
      todoContext.getAllToDos.invalidate();
    },
    onError: () => {
      console.log("Error");
    },
  });

  const { mutate: update } = api.toDo.toggleToDo.useMutation({
    onSuccess: () => {
      todoContext.getAllToDos.invalidate();
    },
    onError: () => {
      console.log("Error");
    },
  });

  const taskDelete = async () => {
    const { id } = todoItem;
    mutate(id);
  };

  const TaskCompleted = () => {
    const { isCompleted, id } = todoItem;

    update({ id, isCompleted: !status });
    setStatus(!status);
  };

  return (
    <>
      <span className=" flex flex-row  items-center   justify-between bg-transparent  border-fuchsia-300 border-2 rounded-md w-full  ">
        {status ? (
          <>
            <AiFillCloseCircle
              className="m-2 w-6 h-6 text-violet-500 cursor-pointer"
              onClick={TaskCompleted}
            />
            <div className="text-md text-purple-600 p-1 line-through">
              {todoItem?.text}
            </div>
          </>
        ) : (
          <>
            <AiOutlineCheckSquare
              className="m-2 w-6 h-6 text-violet-500 cursor-pointer"
              onClick={TaskCompleted}
            />
            <div className="text-md text-purple-600 p-1">{todoItem?.text}</div>
          </>
        )}
        <BsTrash className="m-2 w-6 h-6 text-violet-500" onClick={taskDelete} />
      </span>
    </>
  );
}

export default ToDoItem;
