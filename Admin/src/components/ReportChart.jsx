import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";

const data = [
    {name: "Jan", "Groos Sale":10000, "Net Income":4948, "Total Expenses":10923},
    {name: "Feb", "Groos Sale":20120, "Net Income":12373, "Total Expenses":10293},
    {name: "Mar", "Groos Sale":15230, "Net Income":9483, "Total Expenses":10295},
    {name: "Apr", "Groos Sale":10231, "Net Income":9384, "Total Expenses":9394},
    {name: "May", "Groos Sale":3847, "Net Income":2536, "Total Expenses":982},
    {name: "Jun", "Groos Sale":10293, "Net Income":2784, "Total Expenses":232},
    {name: "Jul", "Groos Sale":23463, "Net Income":10283, "Total Expenses":2346},
    {name: "Aug", "Groos Sale":38283, "Net Income":13233, "Total Expenses":111},
    {name: "Sep", "Groos Sale":23245, "Net Income":19382, "Total Expenses":323},
    {name: "Oct", "Groos Sale":23090, "Net Income":12940, "Total Expenses":1246},
    {name: "Nov", "Groos Sale":10394, "Net Income":9834, "Total Expenses":123},
    {name: "Dec", "Groos Sale":8934, "Net Income":23456, "Total Expenses":2323}
]

const netIncome = data.map(elem => ({
    name: elem.name,
    "Gross Sale": elem["Groos Sale"],
    "Net Income": elem["Groos Sale"] - elem["Total Expenses"],
    "Total Expenses": elem["Total Expenses"]
}));

console.log(netIncome);


// Custom tooltip function
const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const month = payload[0].payload.name; // Get the month from the first item in the payload
        const dataForMonth = netIncome.find(item => item.name === month); // Find the corresponding data object by month

        if (dataForMonth) {
            return (
                <div className="custom-tooltip" style={{ backgroundColor: "white", border: "1px solid #ccc", padding: "10px", display: "flex", flexDirection: "column", rowGap: ".5rem" }}>
                    <p style={{ color: "black" }}>{`Month: ${dataForMonth.name}`}</p>
                    <p style={{ color: "blue" }}>{`Gross Sale: $${dataForMonth["Gross Sale"].toLocaleString("en-US", { minimumFractionDigits: 2 })}`}</p>
                    <p style={{ color: "green" }}>{`Net Income: $${dataForMonth["Net Income"].toLocaleString("en-US", { minimumFractionDigits: 2 })}`}</p>
                    <p style={{ color: "red" }}>{`Total Expenses: $${dataForMonth["Total Expenses"].toLocaleString("en-US", { minimumFractionDigits: 2 })}`}</p>
                </div>
            );
        }
    }
    return null; // Return null if not active
};


const ReportChart = () => {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
                <Line type="monotone" dataKey="Groos Sale" stroke="blue" strokeWidth={3} />
                <Line type="monotone" dataKey="Net Income" stroke="green" strokeWidth={3} />
                <Line type="monotone" dataKey="Total Expenses" stroke="red" strokeWidth={3} />
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />   
                <YAxis />
                <Tooltip content={<CustomTooltip />} />  
                <Legend />
            </LineChart>
        </ResponsiveContainer>
    )
}

export default ReportChart





