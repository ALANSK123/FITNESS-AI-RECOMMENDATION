import React, { useEffect, useState } from "react";
import { Box, Typography, Card, CardContent } from "@mui/material";
import ActivityForm from "./ActivityForm";
import { getActivities } from "../services/api";

const Dashboard = () => {

    const [activities, setActivities] = useState([]);

    // ✅ fetch all activities
    const fetchActivities = async () => {
        try {
            const res = await getActivities();
            console.log("FETCHED:", res.data);
            setActivities(res.data); // 🔥 this updates UI
        } catch (error) {
            console.error(error);
        }
    };

    // ✅ initial load
    useEffect(() => {
        fetchActivities();
    }, []);

    return (
        <Box sx={{ p: 2 }}>

            <Typography variant="h4" sx={{ mb: 2 }}>
                Activity Dashboard
            </Typography>

            {/* ✅ THIS IS THE IMPORTANT LINE */}
            <ActivityForm onActivityAdded={fetchActivities} />

            {/* ✅ Activity List */}
            {activities.map((activity) => (
                <Card key={activity.id} sx={{ mb: 2 }}>
                    <CardContent>
                        <Typography>Type: {activity.type}</Typography>
                        <Typography>Duration: {activity.duration} mins</Typography>
                        <Typography>
                            Calories: {activity.caloriesBurned}
                        </Typography>
                        <Typography>
                            Date: {new Date(activity.createdAt).toLocaleString()}
                        </Typography>
                    </CardContent>
                </Card>
            ))}

        </Box>
    );
};

export default Dashboard;