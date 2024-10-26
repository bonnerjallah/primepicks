import { CartesianGrid, Legend, PieChart, Pie, ResponsiveContainer, Tooltip, Cell } from "recharts";

const BudgetChart = () => {
    const data = [
        { name: "Marketing", Allocated: 2000, Spent: 1000, Remaining: 5000 },
        { name: "Operations", Allocated: 1000, Spent: 5000, Remaining: 5000 },
        { name: "Salaries", Allocated: 50000, Spent: 8000, Remaining: 2000 },
        { name: "R&D", Allocated: 15000, Spent: 12000, Remaining: 3000 },
        { name: "Miscellaneous", Allocated: 5000, Spent: 4000, Remaining: 1000 },
    ];

    const pieData = [
        { name: "Allocated", value: data.reduce((acc, item) => acc + item.Allocated, 0), color: "#f1b555" },
        { name: "Spent", value: data.reduce((acc, item) => acc + item.Spent, 0), color: "#6a040f" },
        { name: "Remaining", value: data.reduce((acc, item) => acc + item.Remaining, 0), color: "#1b065e" },
    ];
    
    // Customize the tooltip to format the values
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip" style={{ backgroundColor: "#ffffff", padding: "5px", border: "1px solid #ccc" }}>
                    <p>{`${payload[0].name}: $${payload[0].value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</p>
                </div>
            );
        }
        return null;
    };
    

    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={25}                    
                    label
                >
                    {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    );
    
}

export default BudgetChart;
