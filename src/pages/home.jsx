import React, { useContext, useMemo, useState } from "react";
import { Context } from "../store/appContext";
import { AddThings } from "../component/addThings.jsx";

import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  KeyboardSensor,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { SortableList } from "../component/sortableList.jsx";
import { createPortal } from "react-dom";

// Presentational Component for Task to use within DragOverlay
const TaskOverlay = ({ task }) => (
  <div className="task-overlay">
    {/* Render your task details here */}
    {task.text}
  </div>
);

export const Home = () => {
  const { store, actions } = useContext(Context);
  const [activeList, setActiveList] = useState(null);
  const [activeTask, setActiveTask] = useState(null);

  const ColumnList = useMemo(
    () => store.list.map((list) => list.id),
    [store.list]
  );

  const onDragStart = (event) => {
    const activeData = event.active.data.current;

    if (activeData?.list) {
      setActiveList(activeData.list);
    } else if (activeData?.task) {
      setActiveTask({
        ...activeData.task,
        listId: activeData.listId,
      });
    }
  };

  const onDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeListId = active.id;
    const overListId = over.id;

    if (activeListId !== overListId) {
      const oldListIndex = store.list.findIndex(
        (list) => list.id === activeListId
      );

      const newListIndex = store.list.findIndex(
        (list) => list.id === overListId
      );
      actions.sortLists(arrayMove(store.list, oldListIndex, newListIndex));
    }

    setActiveList(null);
    setActiveTask(null);
  };

  const onDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeTaskId = active.id;
    const overTaskId = over.id;

    if (activeTaskId === overTaskId) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    if (!activeData || !activeData.task) return;

    const copyTasks = structuredClone(store.list);

    const fromList = copyTasks.find(
      (list) => list.id === activeData.task.list_id
    );

    const toList = overData.list
      ? copyTasks.find((list) => list.id === overData.list.id)
      : copyTasks.find((list) => list.id === overData.task.list_id);

    if (!fromList || !toList) return;

    // Mover dentro de la misma lista
    if (fromList.id === toList.id) {
      const oldIndexTask = fromList.tasks.findIndex(
        (task) => task.id === activeTaskId
      );
      const newIndexTask = fromList.tasks.findIndex(
        (task) => task.id === overTaskId
      );

      const updatedTasks = arrayMove(
        fromList.tasks,
        oldIndexTask,
        newIndexTask
      );
      actions.sortTaskWithinList(fromList.id, updatedTasks);
    }

    // Mover a otra lista que tiene tareas
    else if (fromList.id !== toList.id && toList.tasks.length > 0) {
      const oldIndexTask = fromList.tasks.findIndex(
        (task) => task.id === activeTaskId
      );

      const newIndexTask = toList.tasks.findIndex(
        (task) => task.id === overTaskId
      );

      const [movedTask] = fromList.tasks.splice(oldIndexTask, 1);

      movedTask.list_id = toList.id;
      toList.tasks.splice(newIndexTask, 0, movedTask);

      fromList.tasks.forEach((task, index) => (task.position = index));
      toList.tasks.forEach((task, index) => (task.position = index));

      actions.moveTaskToAnotherList(
        fromList.id,
        toList.id,
        fromList.tasks,
        toList.tasks
      );
    }

    // Mover a una lista vacía
    else if (fromList.id !== toList.id && toList.tasks.length === 0) {
      const oldIndexTask = fromList.tasks.findIndex(
        (task) => task.id === activeTaskId
      );
      const [movedTask] = fromList.tasks.splice(oldIndexTask, 1);

      movedTask.list_id = toList.id;
      movedTask.position = 0;
      toList.tasks.push(movedTask);

      fromList.tasks.forEach((task, index) => (task.position = index));

      actions.moveTaskToAnotherList(
        fromList.id,
        toList.id,
        fromList.tasks,
        toList.tasks
      );
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 3 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  if (store.list.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-5 bg-gray-800 rounded-2xl shadow-lg max-w-sm text-center text-gray-100 mt-12 mx-auto">
        <p className="text-xl font-bold text-yellow-400 mb-4">
          No Lists Available
        </p>
        <AddThings textItem="List" />
      </div>
    );
  }

  return (
    <main className="block">
      <div className="max-w-md m-auto">
        <AddThings textItem="List" />
      </div>
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <section className="w-full flex gap-5 justify-center items-center p-5">
          <SortableContext items={ColumnList}>
            <ul className="w-full list-none grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 m-5">
              {store.list?.map((list) => (
                <SortableList list={list} key={list.id} />
              ))}
            </ul>
          </SortableContext>

          {createPortal(
            <DragOverlay>
              {activeList && <SortableList list={activeList} />}
              {activeTask && <TaskOverlay task={activeTask} />}
            </DragOverlay>,
            document.body
          )}
        </section>
      </DndContext>
    </main>
  );
};
