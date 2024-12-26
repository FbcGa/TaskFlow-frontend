const getState = ({ getStore, getActions, setStore }) => {
  return {
    store: {
      message: "holaaaaaaaa",
      demo: [
        {
          title: "FIRST",
          background: "white",
          initial: "white",
        },
        {
          title: "SECOND",
          background: "white",
          initial: "white",
        },
      ],
      user: [],
      list: [],
    },
    actions: {
      // Use getActions to call a function within a fuction
      exampleFunction: () => {
        getActions().changeColor(0, "green");
      },

      getMessage: async () => {
        try {
          // fetching data from the backend
          const resp = await fetch(
            import.meta.env.VITE_BACKEND_URL + "/api/hello"
          );
          const data = await resp.json();
          setStore({ message: data.message });
          // don't forget to return something, that is how the async resolves
          return data;
        } catch (error) {
          console.log("Error loading message from backend", error);
        }
      },
      changeColor: (index, color) => {
        //get the store
        const store = getStore();

        //we have to loop the entire demo array to look for the respective index
        //and change its color
        const demo = store.demo.map((elm, i) => {
          if (i === index) elm.background = color;
          return elm;
        });

        //reset the global store
        setStore({ demo: demo });
      },
      register: async (email, password) => {
        const resp = await fetch(
          import.meta.env.VITE_BACKEND_URL + "/api/register",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          }
        );
        if (!resp.ok) {
          return false;
        }
        const data = await resp.json();
        setStore({ user: data.user });
        localStorage.setItem("token", data.auth);
        return data;
      },
      login: async (email, password) => {
        const resp = await fetch(
          import.meta.env.VITE_BACKEND_URL + "/api/login",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          }
        );

        if (!resp.ok) {
          return false;
        }
        const data = await resp.json();

        setStore({ user: data.user });
        localStorage.setItem("token", data.auth);
        return data;
      },
      //functions list
      allList: async () => {
        const token = localStorage.getItem("token");
        const resp = await fetch(
          import.meta.env.VITE_BACKEND_URL + "/api/list",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!resp.ok) {
          return false;
        }
        const data = await resp.json();
        setStore({ list: data.lists });
      },
      addList: async (title) => {
        const store = getStore();
        const token = localStorage.getItem("token");
        const resp = await fetch(
          import.meta.env.VITE_BACKEND_URL + "/api/list",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ title }),
          }
        );
        if (resp.status === 401) {
          return null;
        }
        if (!resp.ok) {
          return false;
        }

        const data = await resp.json();
        setStore({
          list: [
            ...store.list,
            {
              ...data.list,
            },
          ],
        });
        return data;
      },
      deleteList: async (id) => {
        const token = localStorage.getItem("token");
        const store = getStore();
        const resp = await fetch(
          import.meta.env.VITE_BACKEND_URL + "/api/list/delete",
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ id }),
          }
        );
        if (!resp.ok) {
          return false;
        }
        const data = await resp.json();
        const filterList = store.list.filter((list) => list.id !== id);
        setStore({ list: filterList });
        return data;
      },
      changeListTitle: async (title, listId) => {
        const store = getStore();
        const token = localStorage.getItem("token");

        const resp = await fetch(
          import.meta.env.VITE_BACKEND_URL + "/api/list/change",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ title, list_id: listId }),
          }
        );

        if (!resp.ok) {
          console.error("Failed to update list title");
          return false;
        }

        const data = await resp.json();

        const updatedLists = store.list.map((list) =>
          list.id === listId ? { ...list, title: data.list.title } : list
        );

        setStore({ list: updatedLists });
      },

      addTask: async (text, listId) => {
        const store = getStore();
        const token = localStorage.getItem("token");
        const resp = await fetch(
          import.meta.env.VITE_BACKEND_URL + "/api/task",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ text: text, list_id: listId }),
          }
        );
        if (!resp.ok) {
          return false;
        }
        const data = await resp.json();

        const newTask = store.list.map((list) =>
          list.id === data.task.list_id
            ? { ...list, tasks: [...list.tasks, { ...data.task }] }
            : list
        );
        setStore({ list: newTask });
        return data;
      },
      deleteTask: async (id, listId) => {
        const token = localStorage.getItem("token");
        const store = getStore();
        const resp = await fetch(
          import.meta.env.VITE_BACKEND_URL + "/api/task/delete",
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ id, listId }),
          }
        );
        if (!resp.ok) {
          return false;
        }
        const data = await resp.json();
        const deleteTask = store.list.map((list) => {
          if (list.id === listId) {
            return {
              ...list,
              tasks: list.tasks.filter((task) => task.id !== id),
            };
          }
          return list;
        });
        setStore({ list: deleteTask });
        return data;
      },
      updateTaskTitle: async (taskId, listId, newTitle) => {
        const store = getStore();
        const token = localStorage.getItem("token");

        const resp = await fetch(
          import.meta.env.VITE_BACKEND_URL + "/api/task/change",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ taskId, listId, newTitle }),
          }
        );

        if (!resp.ok) {
          console.error("Failed to update task title");
          return false;
        }

        const data = await resp.json();

        const updatedLists = store.list.map((list) => {
          if (list.id === data.list.list_id) {
            return {
              ...list,
              tasks: list.tasks.map((task) =>
                task.id === data.list.id ? data.list : task
              ),
            };
          }
          return list;
        });

        setStore({ list: updatedLists });
      },

      /*----sort list---------------*/
      sortLists: async (newOrder) => {
        setStore({ list: newOrder });
        const token = localStorage.getItem("token");
        const listOrder = newOrder.map((list) => list.id);

        try {
          const resp = await fetch(
            import.meta.env.VITE_BACKEND_URL + "/api/list/reorder",
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ new_order: listOrder }),
            }
          );

          if (!resp.ok) {
            console.error("Error al reordenar las listas en el backend");
            return false;
          }
        } catch (error) {
          console.error("Error al reordenar listas:", error);
        }
      },
      sortTaskWithinList: async (listId, updatedTasks) => {
        const token = localStorage.getItem("token");

        try {
          const resp = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/tasks/reorder`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                list_id: listId,
                ordered_task_ids: updatedTasks.map((task) => task.id),
              }),
            }
          );

          if (!resp.ok) {
            console.error("Error al reordenar las tareas en el backend");
            return;
          }

          // Actualizar el estado local después de la confirmación del backend
          const store = getStore();
          const updatedLists = structuredClone(store.list);
          const targetList = updatedLists.find((list) => list.id === listId);

          if (targetList) {
            targetList.tasks = updatedTasks; // Reemplazar con la versión reordenada
            setStore({ list: updatedLists });
          }
        } catch (error) {
          console.error("Error al reordenar tareas:", error);
        }
      },
      moveTaskToAnotherList: async (
        fromListId,
        toListId,
        updatedFromTasks,
        updatedToTasks
      ) => {
        const token = localStorage.getItem("token");

        try {
          const resp = await fetch(
            import.meta.env.VITE_BACKEND_URL + "/api/task/move",
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                fromListId,
                toListId,
                updatedFromTasks,
                updatedToTasks,
              }),
            }
          );

          if (!resp.ok) {
            console.error("Error al mover la tarea en el backend");
            return;
          }

          const data = await resp.json();
          setStore({ list: data.updatedLists });
        } catch (error) {
          console.error("Error al mover la tarea:", error);
        }
      },
    },
  };
};

export default getState;
