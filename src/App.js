import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MainContent from "./components/MainContent";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  const [activeView, setActiveView] = useState("today");

  // 🔔 Request Notification Permission (once)
  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  // 💾 Save tasks to localStorage on any update
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = (newTask) => {
    setTasks([...tasks, newTask]);
  };

  const handleToggleTask = (taskId) => {
    const updated = tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updated);
  };

  const handleDeleteTask = (taskId) => {
    const updated = tasks.filter((task) => task.id !== taskId);
    setTasks(updated);
  };

  const handleUpdateTasks = (updatedTasks) => {
    setTasks(updatedTasks);
  };

  return (
    <div className="app-layout">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <MainContent
        tasks={tasks}
        activeView={activeView}
        onAdd={handleAddTask}
        onToggle={handleToggleTask}
        onDelete={handleDeleteTask}
        onUpdate={handleUpdateTasks}
      />
      <ToastContainer position="top-right" autoClose={7000} />
    </div>
  );
}

export default App;
