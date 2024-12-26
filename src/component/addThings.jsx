import React, { useState, useRef, useContext } from "react";
import { Context } from "../store/appContext.jsx";
import { Plus } from "lucide-react";

export function AddThings({ textItem, id }) {
  const { actions } = useContext(Context);
  const [item, setItem] = useState(false);
  const addRef = useRef();

  const handleAddItem = async () => {
    const inputValue = addRef.current?.value.trim();
    if (!inputValue) return;

    if (id) {
      await actions.addTask(inputValue, id);
    } else {
      await actions.addList(inputValue);
    }

    addRef.current.value = "";
    setItem(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAddItem();
    }
  };

  return (
    <section className="mt-4">
      {item ? (
        <div
          className="border border-gray-300 rounded-md shadow-sm p-2"
          onClick={handleAddItem}
        >
          <textarea
            className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            ref={addRef}
            placeholder={`Write a new ${textItem}`}
            onKeyDown={handleKeyDown}
            autoFocus
            onBlur={() => setItem(false)}
          ></textarea>
        </div>
      ) : (
        <button
          className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          onClick={() => setItem(true)}
        >
          <Plus className="w-4 h-4" />
          <span>Add</span>
        </button>
      )}
    </section>
  );
}
