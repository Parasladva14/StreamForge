export default function UserTable({
    users,
    onRoleChange,
    onDelete,
}) {

    return (

        <table
            style={{
                width: "100%",
                borderCollapse: "collapse",
                background: "#1F2937",
                color: "white",
            }}
        >

            <thead>

                <tr>

                    <th>ID</th>

                    <th>Username</th>

                    <th>Email</th>

                    <th>Role</th>

                    <th>Actions</th>

                </tr>

            </thead>

            <tbody>

                {users.map((user) => (

                    <tr key={user.id}>

                        <td>{user.id}</td>

                        <td>{user.username}</td>

                        <td>{user.email}</td>

                        <td>

                            <select
                                value={user.role}
                                onChange={(e) =>
                                    onRoleChange(
                                        user.id,
                                        e.target.value
                                    )
                                }
                            >

                                <option value="Admin">
                                    Admin
                                </option>

                                <option value="Operator">
                                    Operator
                                </option>

                                <option value="Viewer">
                                    Viewer
                                </option>

                            </select>

                        </td>

                        <td>

                            <button
                                onClick={() =>
                                    onDelete(user.id)
                                }
                            >
                                Delete
                            </button>

                        </td>

                    </tr>

                ))}

            </tbody>

        </table>

    );

}