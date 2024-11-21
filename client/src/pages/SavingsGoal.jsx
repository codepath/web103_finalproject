import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import goalService from "../services/SavingsGoal";
import "../css/SavingsGoal.css";

const SavingsGoal = () => {
  const user_id = Number(useParams().user_id);
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState({
    user_id: user_id,
    goal_name: "",
    target_amount: "",
    current_amount: "",
    deadline: "",
  });
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await goalService.getGoals(user_id);
        setGoals(response.data);
      } catch (error) {
        console.error("Error fetching goals:", error);
      }
    };

    fetchGoals();
  }, [newGoal, user_id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewGoal({ ...newGoal, [name]: value });
  };

  const handleAddGoal = async () => {
    try {
      newGoal.user_id = user_id;
      newGoal.deadline = new Date(newGoal.deadline).toISOString();
      const addedGoal = await goalService.addGoal(newGoal);
      setGoals([...goals, addedGoal]);
      setNewGoal({
        user_id: user_id,
        goal_name: "",
        target_amount: "",
        current_amount: "",
        deadline: "",
      });
    } catch (error) {
      console.error("Error adding goal:", error);
    }
  };

  const calculateProgress = () => {
    const totalAmount = goals.reduce(
      (acc, goal) => acc + parseFloat(goal.target_amount),
      0
    );
    const currentAmount = goals.reduce(
      (acc, goal) => acc + parseFloat(goal.current_amount || 0),
      0
    );
    setProgress((currentAmount / totalAmount) * 100);
  };

  useEffect(() => {
    calculateProgress();
  }, [goals]);

  const [isEditing, setIsEditing] = useState(false);
  const [editGoalId, setEditGoalId] = useState(null);

  const handleEditGoal = (id) => {
    const goalToEdit = goals.find((goal) => goal.id === id);
    setNewGoal({
      ...goalToEdit,
      deadline: new Date(goalToEdit.deadline).toISOString().split("T")[0],
    });
    setIsEditing(true);
    setEditGoalId(id);
  };

  const handleUpdateGoal = async () => {
    try {
      const updatedGoal = {
        ...newGoal,
        deadline: new Date(newGoal.deadline).toISOString(),
      };
      await goalService.updateGoal(editGoalId, updatedGoal);
      setGoals(
        goals.map((goal) => (goal.id === editGoalId ? updatedGoal : goal))
      );
      setNewGoal({
        user_id: user_id,
        goal_name: "",
        target_amount: "",
        current_amount: "",
        deadline: "",
      });
      setIsEditing(false);
      setEditGoalId(null);
    } catch (error) {
      console.error("Error updating goal:", error);
    }
  };

  const handleDeleteGoal = async (id) => {
    try {
        await goalService.deleteGoal(id);
        setGoals(goals.filter((goal) => goal.id !== id));
    } catch (error) {
        console.error("Error deleting goal:", error);
    }
};

  return (
    <>
      {isNaN(user_id) ? (
        <div>
          <h1>Please Login to access this page</h1>
        </div>
      ) : (
        <div>
          <h1>Savings Goals</h1>
          <div>
            <input
              type="text"
              name="goal_name"
              placeholder="Goal Name"
              value={newGoal.goal_name}
              onChange={handleInputChange}
            />
            <input
              type="number"
              name="target_amount"
              placeholder="Target Amount"
              value={newGoal.target_amount}
              onChange={handleInputChange}
            />
            <input
              type="number"
              name="current_amount"
              placeholder="Current Amount"
              value={newGoal.current_amount}
              onChange={handleInputChange}
            />
            <input
              type="date"
              name="deadline"
              placeholder="Deadline"
              value={newGoal.deadline}
              onChange={handleInputChange}
            />
            {isEditing ? (
              <button className="update-goal" onClick={handleUpdateGoal}>
                Update Goal
              </button>
            ) : (
              <button className="add-goal" onClick={handleAddGoal}>
                Add Goal
              </button>
            )}
          </div>
          <div>
            <h2>Progress</h2>
            <div style={{ width: "100%", backgroundColor: "#e0e0e0" }}>
              <div
                style={{
                  width: `${progress}%`,
                  backgroundColor: "#76c7c0",
                  height: "24px",
                }}
              ></div>
            </div>
          </div>
          <div>
            <h2>Goals</h2>
            <table>
              <thead>
                <tr>
                  <th>Goal Name</th>
                  <th>Target Amount</th>
                  <th>Current Amount</th>
                  <th>Deadline</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {goals?.map((goal) => (
                  <tr key={goal.id}>
                    <td>{goal.goal_name}</td>
                    <td>${goal.target_amount}</td>
                    <td>${goal.current_amount}</td>
                    <td>{new Date(goal.deadline).toLocaleDateString()}</td>
                    <td>
                      <button onClick={() => handleEditGoal(goal.id)}>
                        Edit
                      </button>
                      <button
                        className="delete-button"
                        onClick={() => handleDeleteGoal(goal.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

export default SavingsGoal;
