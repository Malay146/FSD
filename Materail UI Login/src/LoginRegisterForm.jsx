import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Tabs,
  Tab,
} from "@mui/material";

export default function LoginRegisterForm() {
  const [tab, setTab] = useState(0); // 0 = Login, 1 = Register
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const handleTabChange = (_, newValue) => {
    setTab(newValue);
    setFormData({ name: "", email: "", password: "" });
    setErrors({});
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let tempErrors = {};

    if (tab === 1 && !formData.name.trim()) {
      tempErrors.name = "Name is required";
    }

    if (!formData.email) {
      tempErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      tempErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      alert(tab === 0 ? "Login Successful!" : "Registration Successful!");
    }
  };

  return (
    <Paper elevation={4} sx={{ width: 350, padding: 3 }}>
      <Tabs value={tab} onChange={handleTabChange} centered>
        <Tab label="Login" />
        <Tab label="Register" />
      </Tabs>

      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit}
        sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}
      >
        {tab === 1 && (
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
          />
        )}

        <TextField
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={!!errors.email}
          helperText={errors.email}
        />

        <TextField
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          error={!!errors.password}
          helperText={errors.password}
        />

        <Button type="submit" variant="contained" color="primary" fullWidth>
          {tab === 0 ? "Login" : "Register"}
        </Button>
      </Box>

      <Typography
        variant="body2"
        align="center"
        sx={{
          mt: 2,
          color: "gray",
          cursor: "pointer",
          textDecoration: "underline",
        }}
        onClick={() => setTab(tab === 0 ? 1 : 0)}
      >
        {tab === 0
          ? "Don't have an account? Click Register."
          : "Already have an account? Click Login."}
      </Typography>
    </Paper>
  );
}
