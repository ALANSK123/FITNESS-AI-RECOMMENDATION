import { Card, CardContent, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getActivities } from "../services/api";

const ActivityList = ({ refreshKey = 0 }) => {

    const [activities, setActivities] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        let isMounted = true;

        getActivities()
            .then((response) => {
                if (isMounted) {
                    setActivities(response.data);
                }
            })
            .catch((error) => {
                console.error(error);
            });

        return () => {
            isMounted = false;
        };
    }, [refreshKey]);


    return (
        <Grid container spacing={2}>
            {activities.length === 0 && (
                <Grid size={12}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography color="text.secondary">
                                No activities yet. Add one to get started.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            )}
            {activities.map(activity => (
                <Grid key={activity.id} size={{ xs: 12, sm: 6, md: 4 }}>
                    <Card sx={{ cursor: 'pointer', height: '100%' }}
                        onClick={() => navigate(`/activities/${activity.id}`)}> 
                        <CardContent>
                            <Typography variant="h6">{activity.type}</Typography>
                            <Typography>Duration: {activity.duration} mins</Typography>
                            <Typography>Calories: {activity.caloriesBurned} cal</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    )
}

export default ActivityList