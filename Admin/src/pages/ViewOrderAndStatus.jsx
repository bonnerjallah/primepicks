import vieworderstyle from "../styles/vieworderstyle.module.css"

const ViewOrderAndStatus = () => {
    return (
        <div className={vieworderstyle.mainContainer}>
            <h1>View Orders</h1>
            <div className={vieworderstyle.tableWrapper}>
                <table>
                    <thead>
                        <tr>
                            <th>Customer</th>
                            <th>Contact</th>
                            <th>Item#</th>
                            <th>Amount</th>
                            <th>Address</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>ded</td>
                            <td>sss</td>
                            <td>da</td>
                            <td>ts</td>
                            <td>ea</td>
                            <td>twr</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ViewOrderAndStatus