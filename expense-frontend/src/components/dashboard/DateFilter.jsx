const DateFilter = ({ month, year, onMonthChange, onYearChange }) => {
  return (
    <div className="date-filter">
      <select value={month} onChange={(e) => onMonthChange(e.target.value)}>
        <option value="">All Months</option>
        {Array.from({ length: 12 }).map((_, i) => (
          <option key={i} value={i}>
            {new Date(0, i).toLocaleString("default", { month: "long" })}
          </option>
        ))}
      </select>

      <select value={year} onChange={(e) => onYearChange(e.target.value)}>
        <option value="">All Years</option>
        {[2023, 2024, 2025, 2026].map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DateFilter;
