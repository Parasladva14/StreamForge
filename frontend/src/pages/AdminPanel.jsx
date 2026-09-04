import { useEffect, useState } from "react";

import {
    getUsers,
    updateUserRole,
    deleteUser,
} from "../services/userService";

import UserTable from "../components/admin/UserTable";

import { toast } from "react-toastify";

export default function AdminPanel() {

    const [users, setUsers] = useState([]);

    const loadUsers = async () => {

        try {

            const data = await getUsers();

            setUsers(data);

        } catch {

            toast.error("Failed to load users");

        }

    };

    useEffect(() => {

        loadUsers();

    }, []);

    const changeRole = async (id, role) => {

        try {

            await updateUserRole(id, role);

            toast.success("Role Updated");

            loadUsers();

        } catch {

            toast.error("Update Failed");

        }

    };

    const removeUser = async (id) => {

        if (!window.confirm("Delete User?"))

            return;

        try {

            await deleteUser(id);

            toast.success("User Deleted");

            loadUsers();

        } catch {

            toast.error("Delete Failed");

        }

    };

    return (

        <div
            style={{
                padding: 40,
                background: "#111827",
                minHeight: "100vh",
            }}
        >

            <h1
                style={{
                    color: "white",
                }}
            >
                User Management
            </h1>

            <UserTable

                users={users}

                onRoleChange={changeRole}

                onDelete={removeUser}

            />

        </div>

    );

}