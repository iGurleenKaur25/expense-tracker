const RecentTransactions = ({ expenses }) => {
  const recent = [...expenses]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <div className="table-card">
      <h3>Recent Transactions</h3>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Category</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {recent.map((e, i) => (
            <tr key={i}>
              <td>{new Date(e.date).toLocaleDateString()}</td>
              <td>{e.category}</td>
              <td>₹{e.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentTransactions;