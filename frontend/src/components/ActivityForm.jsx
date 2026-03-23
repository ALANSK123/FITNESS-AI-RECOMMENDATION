import { Box, Button, Card, CardContent, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import { addActivity } from '../services/api'

const INITIAL_ACTIVITY = {
    type: "RUNNING",
    duration: '',
    caloriesBurned: '',
    additionalMetrics: {}
};

const ActivityForm = ({ onActivityAdded }) => {

    const [activity, setActivity] = useState(INITIAL_ACTIVITY);

    const handleFieldChange = (field) => (e) => {
        setActivity((prev) => ({ ...prev, [field]: e.target.value }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            console.log(activity);
            await addActivity(activity);
            onActivityAdded();
            setActivity(INITIAL_ACTIVITY);
        }
        catch(error) {
            console.error(error)
        }
    }

    return (
        <Card sx={{ mb: 2 }}>
            <CardContent>
                <Typography variant="h6" sx={{ mb: 2, textAlign: "left" }}>
                    Add New Activity
                </Typography>
                <Box component="form" onSubmit={handleSubmit}>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Activity Type</InputLabel>
                        <Select
                            label="Activity Type"
                            value={activity.type}
                            onChange={handleFieldChange("type")}
                        >
                            <MenuItem value={"RUNNING"}>Running</MenuItem>
                            <MenuItem value={"WALKING"}>Walking</MenuItem>
                            <MenuItem value={"CYCLING"}>Cycling</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField
                        fullWidth
                        label="Duration (mins)"
                        type='number'
                        sx={{ mb: 2 }}
                        value={activity.duration}
                        onChange={handleFieldChange("duration")}
                        onWheel={(e) => e.target.blur()}
                    />

                    <TextField
                        fullWidth
                        label="Calories Burned (cal)"
                        type='number'
                        sx={{ mb: 2 }}
                        value={activity.caloriesBurned}
                        onChange={handleFieldChange("caloriesBurned")}
                        onWheel={(e) => e.target.blur()}
                    />

                    <Button type='submit' variant='contained'>Add Activity</Button>
                </Box>
            </CardContent>
        </Card>
    )
}

export default ActivityForm