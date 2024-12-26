import React, { useState, useRef, useContext } from "react";
import { Context } from "../store/appContext";
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
    <section className="flex flex-col items-center mt-5 max-w-xl mx-auto">
      {item ? (
        <div className="w-full flex flex-col gap-2" onClick={handleAddItem}>
          <textarea
            className="w-full h-16 p-2 border border-green-500 rounded-md bg-gray-700 text-gray-100 resize-none focus:outline-none focus:border-green-500"
            ref={addRef}
            placeholder={`Write a new ${textItem}`}
            onKeyDown={handleKeyDown}
            autoFocus
            onBlur={() => setItem(false)}
          ></textarea>
        </div>
      ) : (
        <button className="bg-cyan-400 text-white p-2 rounded-md cursor-pointer transition-colors hover:bg-cyan-500" onClick={() => setItem(true)}>
          <Plus />
          <span>Add</span>
        </button>
      )}
    </section>
  );
}
