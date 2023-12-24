import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import "./App.css";
import Card from "./comp/Card";
import { useEffect, useState } from "react";

function App() {
  useEffect(() => {
    fetch("http://localhost:5000/todo-tasks")
      .then((res) => res.json())
      .then((data) => setTasks(data));
  }, []);
  useEffect(() => {
    fetch("http://localhost:5000/ongoing-tasks")
      .then((res) => res.json())
      .then((data) => setOngoing(data));
  }, []);
  useEffect(() => {
    fetch("http://localhost:5000/completed-tasks")
      .then((res) => res.json())
      .then((data) => setCompleted(data));
  }, []);

  const [tasks, setTasks] = useState([]);
  const [ongoing, setOngoing] = useState([]);
  const [completed, setCompleted] = useState([]);

  const handleDragNDrop = (results) => {
    const { source, destination } = results;
    console.log(results);
    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }
    let moved;
    let todo = [...tasks];
    let ongoingTask = [...ongoing];
    let completedTask = [...completed];
    // Source Logic
    if (source.droppableId === "1") {
      moved = todo[source.index];
      todo.splice(source.index, 1);
    } else if (source.droppableId === "2") {
      moved = ongoingTask[source.index];
      ongoingTask.splice(source.index, 1);
    } else {
      moved = completedTask[source.index];
      completedTask.splice(source.index, 1);
    }
    // Destination Logic
    if (destination.droppableId === "1") {
      todo.splice(destination.index, 0, moved);
    } else if (destination.droppableId === "2") {
      ongoingTask.splice(destination.index, 0, moved);
    } else {
      completedTask.splice(destination.index, 0, moved);
    }
    setTasks(todo);
    setOngoing(ongoingTask);
    setCompleted(completedTask);
    fetch("http://localhost:5000/update-tasks", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ todo, ongoingTask, completedTask }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      });
  };

  return (
    <DragDropContext onDragEnd={handleDragNDrop}>
      <div className="grid grid-cols-3 gap-6">
        <Droppable droppableId="1" type="group">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="bg-gray-100 border border-gray-200 p-5 min-h-60 pb-10"
            >
              <h1 className="text-xl font-semibold pb-3 border-b border-gray-300 mb-5">
                To Do
              </h1>{" "}
              <div className="space-y-3">
                {tasks.map((task, i) => (
                  <Draggable draggableId={task._id} key={task._id} index={i}>
                    {(provided) => (
                      <div
                        {...provided.dragHandleProps}
                        {...provided.draggableProps}
                        ref={provided.innerRef}
                      >
                        <Card task={task} />
                      </div>
                    )}
                  </Draggable>
                ))}
              </div>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        <Droppable droppableId="2" type="group">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="bg-gray-100 border border-gray-200 p-5 min-h-60 pb-10"
            >
              <h1 className="text-xl font-semibold pb-3 border-b border-gray-300 mb-5">
                Ongoing
              </h1>{" "}
              <div className="space-y-3">
                {ongoing.map((task, i) => (
                  <Draggable draggableId={task._id} key={task._id} index={i}>
                    {(provided) => (
                      <div
                        {...provided.dragHandleProps}
                        {...provided.draggableProps}
                        ref={provided.innerRef}
                      >
                        <Card task={task} />
                      </div>
                    )}
                  </Draggable>
                ))}
              </div>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        <Droppable droppableId="3" type="group">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="bg-gray-100 border border-gray-200 p-5 min-h-60 pb-10"
            >
              <h1 className="text-xl font-semibold pb-3 border-b border-gray-300 mb-5">
                Completed
              </h1>
              <div className="space-y-3">
                {completed.map((task, i) => (
                  <Draggable draggableId={task._id} key={task._id} index={i}>
                    {(provided) => (
                      <div
                        {...provided.dragHandleProps}
                        {...provided.draggableProps}
                        ref={provided.innerRef}
                      >
                        <Card task={task} />
                      </div>
                    )}
                  </Draggable>
                ))}
              </div>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </DragDropContext>
  );
}

export default App;
