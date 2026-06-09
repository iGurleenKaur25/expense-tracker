import API from "../../api/axiosInstance";

const ExpenseItem = ({ expense, onDelete, onEdit }) => {
  const handleDelete = async () => {
    try {
      await API.delete(`/expenses/${expense._id}`);
      onDelete(expense._id);
    } catch (error) {
      console.error("Delete failed", error);
      onDelete(expense._id);
    }
  };

  return (
    <div className="expense-item">
      <div>
        <strong>{expense.title}</strong>
        <p>{expense.category}</p>
      </div>

      <div>
        <p>₹{expense.amount}</p>
        <button onClick={() => onEdit(expense)}>Edit</button>
        <button onClick={handleDelete}>Delete</button>
      </div>
    </div>
  );
};

export default ExpenseItem;
