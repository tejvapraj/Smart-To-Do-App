import React from 'react';
import PropTypes from 'prop-types';

const TaskItem = ({ task, onToggle, onDelete }) => {
  return (
    <div className={`task-item ${task.completed ? 'done' : ''}`}>
      <div>
        <strong>{task.task}</strong>  
        <span>🕒 {new Date(task.dueDate).toLocaleString()}</span>
      </div>
      <div>
        <button onClick={() => onToggle(task.id)}>
          ✅ {task.completed ? 'Undo' : 'Done'}
        </button>
        <button onClick={() => onDelete(task.id)} style={{ color: 'red' }}>
          ❌ Delete
        </button>
      </div>
    </div>
  );
};

export default TaskItem;

TaskItem.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.number.isRequired,
    task: PropTypes.string.isRequired,
    dueDate: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired,
  }),
  onToggle: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
