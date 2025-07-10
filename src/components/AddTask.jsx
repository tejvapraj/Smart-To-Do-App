import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './AddTask.css';

const AddTask = ({ onAdd }) => {
  const [task, setTask] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [important, setImportant] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!task.trim()) return;

    const newTask = {
      id: Date.now(),
      task,
      dueDate,
      dueTime,
      important,
      completed: false,
    };

    onAdd(newTask);
    setTask('');
    setDueDate('');
    setDueTime('');
    setImportant(false);
  };

  return (
    <form className="add-task-form" onSubmit={handleSubmit}>
      <div className="input-wrapper">
        <span>📝</span>
        <input
          type="text"
          placeholder="What needs to be done?"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
      </div>

      <div className="input-wrapper">
        <span>📅</span>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>

      <div className="input-wrapper">
        <span>⏰</span>
        <input
          type="time"
          value={dueTime}
          onChange={(e) => setDueTime(e.target.value)}
        />
      </div>

      <label className="checkbox">
        <input
          type="checkbox"
          checked={important}
          onChange={() => setImportant(!important)}
        />
        ⭐ Important
      </label>

      <button type="submit">➕ Add Task</button>
    </form>

  );
};

AddTask.propTypes = {
  onAdd: PropTypes.func.isRequired,
};

export default AddTask;
