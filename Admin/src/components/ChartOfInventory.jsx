import { Bar, BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";
import { useProducts } from "./ProductsContext";

const ChartOfInventory = () => {
    const { allProducts } = useProducts(); 

    // Map `allProducts` to create the data array for chart rendering
    const data = [
        { name: "Men", "Max Quantity": 50, Quantity: allProducts.filter(p => p.category?.toLowerCase().includes("men's clothing")).length },
        { name: "Women", "Max Quantity": 50, Quantity: allProducts.filter(p => p.category?.toLowerCase().includes("women's")).length },
        { name: "Watch", "Max Quantity": 50, Quantity: allProducts.filter(p => p.category?.toLowerCase().includes("watch")).length },
        { name: "Bags", "Max Quantity": 50, Quantity: allProducts.filter(p => p.category?.toLowerCase().includes("handbag")).length },
        { name: "Shoes", "Max Quantity": 50, Quantity: allProducts.filter(p => p.category?.toLowerCase().includes("shoes")).length }
    ];

    const barColors = ["#ffaf87", "#485696", "#ef476f", "#1b065e", "#4b92c8"];

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip cursor={{ fill: "transparent" }} />
                <Bar dataKey="Max Quantity"  fill="#254d32">
                </Bar>
                <Bar dataKey="Quantity">
                    {data.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}

export default ChartOfInventory