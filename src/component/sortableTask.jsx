import React, { useContext, useRef, useState } from "react";
import { Context } from "../store/appContext.jsx";
import {useSortable} from '@dnd-kit/sortable';
import { CSS } from "@dnd-kit/utilities";
import { Trash2 } from "lucide-react";

export function SortableTask({ task, listId }) {
  const { actions } = useContext(Context);
  const [editMode, setEditMode] = useState(false);
  const refTask = useRef();

  const deleteTask = async (id, listId) => {
    await actions.deleteTask(id, listId);
  };

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      task,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const changeTitleTask = async (e) => {
    if (e.key !== "Enter") return;
    setEditMode(false);
    const titleTask = refTask.current.value;
    await actions.updateTaskTitle(task.id, listId, titleTask);
  };

  if (editMode) {
    return (
      <div
        className="flex justify-between items-center p-2 border border-gray-600 rounded-md bg-gray-800 text-gray-100 shadow-md transition-all hover:border-cyan-400"
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
      >
        <input
          type="text"
          onKeyDown={changeTitleTask}
          autoFocus
          onBlur={() => setEditMode(false)}
          ref={refTask}
        />

        <button
          type="button"
          onClick={() => deleteTask(task.id, listId)}
          className="task-delete-button"
        >
          <Trash2 size={16}/>
        </button>
      </div>
    );
  }

  if (isDragging)
    return (
      <div className="flex justify-between items-center p-2 border border-red-700 rounded-md bg-gray-800 text-gray-100 shadow-md transition-all hover:border-cyan-400 h-16" ref={setNodeRef} style={style}></div>
    );

  return (
    <div
      className="flex justify-between items-center p-2 border border-gray-600 rounded-md bg-gray-800 text-gray-100 shadow-md transition-all hover:border-cyan-400"
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => setEditMode(true)}
    >
      <p className="flex-grow text-base overflow-x-hidden">{task.text}</p>

      <button
        type="button"
        onClick={() => deleteTask(task.id, listId)}
        className="bg-gray-800 border-none text-gray-400 cursor-pointer p-2 rounded-md transition-colors hover:bg-red-600 hover:text-white"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
