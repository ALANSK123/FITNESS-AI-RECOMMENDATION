import React, { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { registerUser } from "../services/api";

const Register = () => {

    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const handleChange = (field) => (e) => {
        setForm({ ...form, [field]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await registerUser(form);
            alert("Registered successfully!");
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Box sx={{ maxWidth: 400, margin: "auto", mt: 5 }}>
            <Typography variant="h5">Register</Typography>

            <form onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    label="Email"
                    sx={{ mb: 2 }}
                    value={form.email}
                    onChange={handleChange("email")}
                />

                <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    sx={{ mb: 2 }}
                    value={form.password}
                    onChange={handleChange("password")}
                />

                <Button type="submit" variant="contained">
                    Register
                </Button>
            </form>
        </Box>
    );
};

export default Register;