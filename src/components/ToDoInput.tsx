import { FormEvent, useState } from "react";
import { RiAddCircleLine } from "react-icons/ri";
import { BsCheckAll } from "react-icons/bs";
import { api } from "~/utils/api";
import toast from "react-hot-toast";

export default function ToDoInput() {
  const [text, setText] = useState("");

  const todoContext = api.useContext().toDo;
  const { mutateAsync: createTodo } = api.toDo.addTodo.useMutation({
    onSuccess: () => {
      setText("");
      todoContext.getAllToDos.invalidate();
    },
    onError: () => {
      toast.error("Error...");
      return;
    },
  });

  const { mutate: deleteTodoCompleted } =
    api.toDo.deleteToDoCompleted.useMutation({
      onSuccess: () => {
        todoContext.getAllToDos.invalidate();
      },
    });

  const clearCompleted = () => {
    deleteTodoCompleted();
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    createTodo({ text });
  };
  return (
    <>
      <form onSubmit={(e) => handleSubmit(e)}>
        <div className="flex flex-row  items-center mr-4 w-full">
          <input
            type="text"
            className="bg-white rounded-md outline-none  p-2 "
            required
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button type="submit">
            <RiAddCircleLine className="w-8 h-8 ml-4 text-white" />
          </button>
          <button type="button" onClick={clearCompleted}>
            <BsCheckAll className="w-8 h-8 ml-2 text-white" />
          </button>
        </div>
      </form>
    </>
  );
}
