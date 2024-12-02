import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import axios from 'axios';
import './css/ExpensePieChart.css';

// Register required Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const ExpensePieChart = () => {
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.get(
          'https://http2mysqlfunc1ccb1.azurewebsites.net/api/GetAllExpenses?code=Tms3OUFDbEszQR9cjF6iGEwe2MKUTwg91QQK-y_CS78rAzFuws22eQ%3D%3D'
        );
        setExpenses(response.data);
      } catch (err) {
        setError('Error fetching expenses. Please try again later.');
      }
    };

    fetchExpenses();
  }, []);

  const dataForPieChart = () => {
    const categoryTotals = expenses.reduce((totals, expense) => {
      totals[expense.Category] = (totals[expense.Category] || 0) + expense.Amount;
      return totals;
    }, {});

    return {
      labels: Object.keys(categoryTotals),
      datasets: [
        {
          data: Object.values(categoryTotals),
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF',
            '#FF9F40',
          ],
          hoverBackgroundColor: [
            '#FF6384CC',
            '#36A2EBCC',
            '#FFCE56CC',
            '#4BC0C0CC',
            '#9966FFCC',
            '#FF9F40CC',
          ],
        },
      ],
    };
  };

  return (
    <div className="pie-chart-container">
      <h2>Expense Distribution by Category</h2>
      {error && <p className="error-message">{error}</p>}
      {expenses.length > 0 ? (
        <div className="chart-wrapper">
          <Pie data={dataForPieChart()} />
        </div>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default ExpensePieChart;
