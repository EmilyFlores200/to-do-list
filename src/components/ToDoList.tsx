import { useState } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { api } from "~/utils/api";
import ToDoItem from "./ToDoItem";
import { ToDo } from "@prisma/client";
export default function ToDoList() {
  const [parent] = useAutoAnimate();
  const {
    data: todosList,
    isLoading,
    isError,
  } = api.toDo.getAllToDos.useQuery();

  const todos = todosList as ToDo[];
  //console.log(todos);

  if (isLoading) return <div>To Do List is loading</div>;
  return (
    <>
      <div ref={parent} className="flex flex-col gap-2 items-start w-full">
        {todos.length ? (
          todos?.map((todo) => <ToDoItem key={todo.id} todoItem={todo} />)
        ) : (
          <h3 className="text-md text-white align-middle self-center">
            No to do today{" "}
          </h3>
        )}
      </div>
    </>
  );
}
