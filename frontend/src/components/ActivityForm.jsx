import { Box, Button, Card, CardContent, FormControl, InputLabel, MenuItem, Select, TextField, Typography, Stack, InputAdornment } from '@mui/material'
import React, { useState } from 'react'
import { addActivity } from '../services/api'
import { Plus, Clock, Flame, Dumbbell } from "lucide-react"

const INITIAL_ACTIVITY = {
    type: "RUNNING",
    duration: '',
    caloriesBurned: '',
    additionalMetrics: {}
};

const ActivityForm = ({ onActivityAdded }) => {
    const [activity, setActivity] = useState(INITIAL_ACTIVITY);
    const [loading, setLoading] = useState(false);

    const handleFieldChange = (field) => (e) => {
        setActivity((prev) => ({ ...prev, [field]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await addActivity(activity);
            onActivityAdded();
            setActivity(INITIAL_ACTIVITY);
        }
        catch(error) {
            console.error(error)
        } finally {
            setLoading(false);
        }
    }

    return (
        <Card className="animate-glow" sx={{ 
            mb: 4, 
            overflow: 'visible',
            position: 'relative',
            '&::before': {
                content: '""',
                position: 'absolute',
                top: -2,
                left: -2,
                right: -2,
                bottom: -2,
                background: 'linear-gradient(45deg, #a855f7, #06b6d4)',
                borderRadius: 'inherit',
                zIndex: -1,
                opacity: 0.2
            }
        }}>
            <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Plus size={20} color="#a855f7" />
                    New Activity
                </Typography>
                <Box component="form" onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                        <FormControl fullWidth>
                            <InputLabel>Activity Type</InputLabel>
                            <Select
                                label="Activity Type"
                                value={activity.type}
                                onChange={handleFieldChange("type")}
                                startAdornment={
                                    <InputAdornment position="start">
                                        <Dumbbell size={20} style={{ marginRight: 8, color: '#a855f7' }} />
                                    </InputAdornment>
                                }
                            >
                                <MenuItem value={"RUNNING"}>Running</MenuItem>
                                <MenuItem value={"WALKING"}>Walking</MenuItem>
                                <MenuItem value={"CYCLING"}>Cycling</MenuItem>
                            </Select>
                        </FormControl>

                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                            <TextField
                                fullWidth
                                label="Duration"
                                type='number'
                                value={activity.duration}
                                onChange={handleFieldChange("duration")}
                                onWheel={(e) => e.target.blur()}
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">min</InputAdornment>,
                                    startAdornment: <InputAdornment position="start"><Clock size={18} /></InputAdornment>
                                }}
                            />

                            <TextField
                                fullWidth
                                label="Calories"
                                type='number'
                                value={activity.caloriesBurned}
                                onChange={handleFieldChange("caloriesBurned")}
                                onWheel={(e) => e.target.blur()}
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">cal</InputAdornment>,
                                    startAdornment: <InputAdornment position="start"><Flame size={18} /></InputAdornment>
                                }}
                            />
                        </Stack>

                        <Button 
                            type='submit' 
                            variant='contained' 
                            size="large"
                            disabled={loading || !activity.duration || !activity.caloriesBurned}
                            sx={{ py: 1.5 }}
                        >
                            {loading ? "Adding..." : "Log Activity"}
                        </Button>
                    </Stack>
                </Box>
            </CardContent>
        </Card>
    )
}

export default ActivityForm