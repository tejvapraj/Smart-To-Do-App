import React from 'react';
import PropTypes from 'prop-types';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import './TaskStats.css';

const COLORS = ['#4CAF50', '#F44336']; // Completed, Pending

const TaskStats = ({ tasks }) => {
  const completed = tasks.filter((task) => task.completed).length;
  const pending = tasks.length - completed;

  const data = [
    { name: 'Completed', value: completed },
    { name: 'Pending', value: pending },
  ];

  return (
    <div className="task-stats">
      <h3>📊 Task Summary</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={COLORS[data.indexOf(entry) % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

// ✅ Fix: Prop validation
TaskStats.propTypes = {
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      task: PropTypes.string.isRequired,
      completed: PropTypes.bool.isRequired,
      dueDate: PropTypes.string,
      dueTime: PropTypes.string,
      important: PropTypes.bool,
    })
  ).isRequired,
};

export default TaskStats;
