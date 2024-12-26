import React, { useContext, useMemo, useRef, useState } from "react";
import { SortableTask } from "./sortableTask.jsx";
import { AddThings } from "./addThings.jsx";
import { Context } from "../store/appContext.jsx";
import { useSortable, SortableContext } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Trash2 } from "lucide-react";

export function SortableList({ list }) {
  const { actions } = useContext(Context);
  const titleRef = useRef();
  const [editMode, setEditMode] = useState(false);

  const taskId = useMemo(() => {
    return list.tasks?.map((task) => task.id);
  }, [list.tasks]);

  const deleteList = async (id) => {
    await actions.deleteList(id);
  };

  const changeTitleList = async (event, listId) => {
    if (event.key !== "Enter") return;
    setEditMode(false);
    const title = titleRef.current.value;

    await actions.changeListTitle(title, listId);
  };

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: list.id,
    data: {
      list,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <li className="list-item dragging" ref={setNodeRef} style={style}></li>
    );
  }
  return (
    <li className="list-item" ref={setNodeRef} style={style}>
      <div
        className="list-header"
        {...attributes}
        {...listeners}
        onClick={() => setEditMode(true)}
      >
        {editMode ? (
          <input
            ref={titleRef}
            autoFocus
            onBlur={() => setEditMode(false)}
            onKeyDown={(event) => changeTitleList(event, list.id)}
            className="input-edit"
          />
        ) : (
          <h5 className="list-title">{list.title}</h5>
        )}
        <div className="dropdown">
          <button
            type="button"
            onClick={() => deleteList(list.id)}
            className="delete-button"
          >
            <Trash2 />
          </button>
        </div>
      </div>

      <SortableContext items={taskId}>
        {list.tasks.map((task) => (
          <SortableTask task={task} key={task.id} listId={list.id} />
        ))}
      </SortableContext>
      <div style={{ marginTop: "20px" }}>
        <AddThings textItem="Task" id={list.id} />
      </div>
    </li>
  );
}
