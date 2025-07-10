import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import AddTask from './AddTask';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import TaskStats from './TaskStats'; // Optional: pie chart stats
import './MainContent.css';

const MainContent = ({ tasks, activeView, onAdd, onToggle, onDelete }) => {
  const today = new Date().toISOString().split('T')[0];
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTaskData, setEditedTaskData] = useState({});

  useEffect(() => {
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const nowTime = now.toTimeString().slice(0, 5);
      const todayDate = now.toISOString().split('T')[0];

      const newTasks = tasks.map((task) => {
        if (
          task.dueDate === todayDate &&
          task.dueTime === nowTime &&
          !task.notified
        ) {
          if (Notification.permission === 'granted') {
            new Notification(`⏰ Reminder: ${task.task}`, {
              body: `Due at ${task.dueTime}`,
              icon: '/favicon.ico',
            });
          }
          return { ...task, notified: true };
        }
        return task;
      });

      localStorage.setItem('tasks', JSON.stringify(newTasks));
    }, 60000);

    return () => clearInterval(interval);
  }, [tasks]);

  const filteredTasks = tasks.filter((task) => {
    if (activeView === 'today') return task.dueDate === today;
    if (activeView === 'planned') return task.dueDate && task.dueDate > today;
    if (activeView === 'important') return task.important;
    return true;
  });

  const handleEditClick = (task) => {
    setEditingTaskId(task.id);
    setEditedTaskData({
      task: task.task,
      dueDate: task.dueDate || '',
      dueTime: task.dueTime || '',
      important: task.important || false,
    });
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditedTaskData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSaveEdit = (taskId) => {
    const updated = tasks.map((task) =>
      task.id === taskId
        ? { ...task, ...editedTaskData, notified: false }
        : task
    );
    localStorage.setItem('tasks', JSON.stringify(updated));
    toast.success('✅ Task updated successfully!');
    setEditingTaskId(null);
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
  };

  const formatDateTime = (date, time, end = false) => {
    const dt = new Date(`${date}T${time}`);
    if (end) dt.setMinutes(dt.getMinutes() + 30);
    return dt.toISOString().replace(/[-:]|\.\d{3}/g, '').slice(0, 15) + 'Z';
  };

  return (
    <motion.div
      className="main-content"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2>{activeView === 'today' ? 'My Day' : activeView.charAt(0).toUpperCase() + activeView.slice(1)}</h2>

      <AddTask onAdd={onAdd} />
      <TaskStats tasks={tasks} />

      {filteredTasks.length === 0 ? (
        <p>No tasks found for this view.</p>
      ) : (
        <ul className="task-list">
          {filteredTasks.map((task) => (
            <motion.li
              key={task.id}
              className={`task-item ${task.completed ? 'completed' : ''}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {editingTaskId === task.id ? (
                <div className="edit-task-form">
                  <input
                    type="text"
                    name="task"
                    value={editedTaskData.task}
                    onChange={handleEditChange}
                  />
                  <input
                    type="date"
                    name="dueDate"
                    value={editedTaskData.dueDate}
                    onChange={handleEditChange}
                  />
                  <input
                    type="time"
                    name="dueTime"
                    value={editedTaskData.dueTime}
                    onChange={handleEditChange}
                  />
                  <label>
                    <input
                      type="checkbox"
                      name="important"
                      checked={editedTaskData.important}
                      onChange={handleEditChange}
                    /> Important
                  </label>
                  <button onClick={() => handleSaveEdit(task.id)}>💾 Save</button>
                  <button onClick={handleCancelEdit}>❌ Cancel</button>
                </div>
              ) : (
                <div className="task-content">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => onToggle(task.id)}
                  />
                  <div>
                    <span className="task-text">{task.task}</span>
                    <div className="meta">
                      {task.dueDate && <span className="badge">📅 {task.dueDate}</span>}
                      {task.dueTime && <span className="badge">⏰ {task.dueTime}</span>}
                      {task.important && <span className="badge important">⭐ Important</span>}
                      {task.dueDate && task.dueTime && (
                        <a
                          href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(task.task)}&dates=${formatDateTime(task.dueDate, task.dueTime)}/${formatDateTime(task.dueDate, task.dueTime, true)}&details=Task+from+Smart+To-Do+App`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="calendar-link"
                        >
                          📅 Add to Calendar
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {editingTaskId !== task.id && (
                <div className="action-btns">
                  <button onClick={() => handleEditClick(task)}>✏️</button>
                  <button onClick={() => onDelete(task.id)}>❌</button>
                </div>
              )}
            </motion.li>
          ))}
        </ul>
      )}
    </motion.div>
  );
};

MainContent.propTypes = {
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      task: PropTypes.string.isRequired,
      completed: PropTypes.bool.isRequired,
      dueDate: PropTypes.string,
      dueTime: PropTypes.string,
      important: PropTypes.bool,
      notified: PropTypes.bool,
    })
  ).isRequired,
  activeView: PropTypes.string.isRequired,
  onAdd: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default MainContent;
