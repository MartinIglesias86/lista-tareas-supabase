import Head from "next/head";
import { useState, useEffect } from "react";
import { supabase } from "../client";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  //creo una nueva variable de estado para almacenar los detalles de la tarea
  const [task, setTask] = useState({
    Name: "",
    Activity: "",
    StartDate: "",
    EndDate: "",
  })
  const { Name, Activity, StartDate, EndDate } = task;

  //funcion para obtener las tareas
  async function getTasks() {
    const { data } = await supabase.from("tasks").select()
    setTasks(data)
    setLoading(false)
  }

  //creo una funcion que maneja la creacion de nuevas tareas
  async function addTask() {
    await supabase
      .from("tasks") //aca seleccionamos la tabla
      .insert([
        {
          Name,
          Activity,
          StartDate,
          EndDate,
        }
      ])  //Ahora insertamos la nueva tarea
      .single()
    setTask({
      Name: "",
      Activity: "",
      StartDate: "",
      EndDate: "",
    })
    getTasks()  //aca resetamos los detalles de la tarea y limpiamos el formulario
  }

  //corremos la funcion getTasks cuando se monta el componente
  useEffect(() => {
    getTasks()
  }, [])

  async function deleteTask(id) {
    await supabase.from("tasks").delete().eq("id", id)
    getTasks()
  }

  if (loading)
    return (
      <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary mt-36 " />
      </div>
    )

  return (
    <div className="py-2 flex flex-col items-center justify-center">
      <div>
        <Head>
          <title>Lista de tareas</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className="px-20 flex flex-col flex-1 w-full items-center justify-center text-center">
          <h1 className="mt-20 text-4xl font-semibold">
            <a className="text-blue-600" href="/">
              Aplicación de tareas realizada con <span className="font-bold">Next.js, Tailwind y Supabase</span>.
            </a>
          </h1>

          <div className="items-center justify-around max-w-4xl mt-6 sm:w-full">
            <div className="m-auto p-8 mt-6 border w-96 rounded-xl hover:text-blue-600 focus:text-blue-600">
              <div className="w-full max-w-sm">
                <form className="bg-secondary rounded px-8 pt-6 pb-8 mb-4">
                  <div className="mb-4">
                    <label
                      className="block text-primary text-sm font-bold mb-2"
                      htmlFor="taskName"
                    >
                      Nombre de la tarea
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-primary leading-tight focus:outline-none focus:shadow-outline"
                      id="taskName"
                      type="text"
                      value={Name.toString()}
                      onChange={(e) => setTask({ ...task, Name: e.target.value })}
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      className="block text-primary text-sm font-bold mb-2"
                      htmlFor="taskActivity"
                    >
                      Descripción de la tarea
                    </label>

                    <textarea
                      className="form-textarea mt-1 block shadow appearance-none border rounded w-full py-2 px-3 text-primary leading-tight focus:outline-none focus:shadow-outline"
                      rows="3"
                      placeholder="Descripción de la tarea"
                      value={Activity.toString()}
                      onChange={(e) => setTask({ ...task, Activity: e.target.value })}
                    ></textarea>
                  </div>

                  <div className="mb-4">
                    <label
                      className="block text-primary text-sm font-bold mb-2"
                      htmlFor="startDate"
                    >
                      Fecha de inicio
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-primary leading-tight focus:outline-none focus:shadow-outline"
                      id="startDate"
                      type="date"
                      value={StartDate.toString()}
                      onChange={(e) => setTask({ ...task, StartDate: e.target.value })}
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      className="block text-primary text-sm font-bold mb-2"
                      htmlFor="endDate"
                    >
                      Fecha de finalización
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-primary leading-tight focus:outline-none focus:shadow-outline"
                      id="endDate"
                      type="date"
                      value={EndDate.toString()}
                      onChange={(e) => setTask({ ...task, EndDate: e.target.value })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      type="button"
                      onClick={addTask}
                    >
                      Agregar tarea
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="p-2 mt-6 w-96 rounded-xl focus:text-blue-600">
              <table className="shadow-lg bg-white">
                <tbody>
                  <tr>
                    <th className="bg-blue-400 border text-left px-4 py-4">
                      ID
                    </th>
                    <th className="bg-blue-400 border text-left px-8 py-4">
                      Nombre
                    </th>
                    <th className="bg-blue-400 border text-left px-8 py-4">
                      Descripción
                    </th>
                    <th className="bg-blue-400 border text-left px-14 py-4">
                      Inicio
                    </th>
                    <th className="bg-blue-400 border text-left px-16 py-4">
                      Fin
                    </th>

                    <th className="bg-blue-400 border text-left px-4 py-4">
                      Acciones
                    </th>
                  </tr>
                  {task &&
                    tasks.map((task, index) => (
                      <tr key={task.id}>
                        <td className="border px-4 py-4">{index + 1}</td>
                        <td className="border px-4 py-4">{task.Name}</td>
                        <td className="border px-8 py-4">{task.Activity}</td>
                        <td className="border px-8 py-4">{task.StartDate}</td>
                        <td className="border px-8 py-4">{task.EndDate}</td>
                        <td className="border px-8 py-4">
                          {" "}
                          <button
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="button"
                            onClick={() => deleteTask(task.id)}
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
