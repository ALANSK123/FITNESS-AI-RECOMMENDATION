import { Card, CardContent, Grid, Typography, Stack, Box, Chip } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getActivities } from "../services/api";
import { ChevronRight, Clock, Flame, Dumbbell, History } from "lucide-react";
import { motion } from "framer-motion";

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

    const getActivityIcon = (type) => {
        switch(type) {
            case 'RUNNING': return <Flame size={20} color="#ff4d4d" />;
            case 'WALKING': return <Clock size={20} color="#06b6d4" />;
            case 'CYCLING': return <Dumbbell size={20} color="#a855f7" />;
            default: return <History size={20} />;
        }
    };

    return (
        <Box>
            <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <History size={20} color="#06b6d4" />
                Recent Activities
            </Typography>
            <Grid container spacing={3}>
                {activities.length === 0 && (
                    <Grid item xs={12}>
                        <Card variant="outlined" sx={{ py: 6, textAlign: 'center', borderStyle: 'dashed' }}>
                            <CardContent>
                                <Typography color="text.secondary">
                                    No activities yet. Start your first session!
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                )}
                {activities.map((activity, index) => (
                    <Grid item key={activity.id} xs={12} sm={6}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card 
                                component="div"
                                className="bento-card"
                                sx={{ 
                                    cursor: 'pointer', 
                                    height: '100%',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        borderColor: 'primary.main',
                                        transform: 'translateY(-6px)',
                                        boxShadow: '0 12px 24px rgba(168, 85, 247, 0.15)'
                                    }
                                }}
                                onClick={() => navigate(`/activities/${activity.id}`)}
                            > 
                                <CardContent sx={{ p: 3 }}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 3 }}>
                                        <Box sx={{ 
                                            p: 1, 
                                            borderRadius: 2, 
                                            bgcolor: 'rgba(255, 255, 255, 0.05)',
                                            display: 'flex',
                                            alignItems: 'center'
                                        }}>
                                            {getActivityIcon(activity.type)}
                                        </Box>
                                        <ChevronRight size={18} color="#94a3b8" />
                                    </Stack>

                                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                                        {activity.type.charAt(0) + activity.type.slice(1).toLowerCase()}
                                    </Typography>

                                    <Stack direction="row" spacing={3}>
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <Clock size={16} color="#94a3b8" />
                                            <Typography variant="body2" color="#f8fafc">
                                                {activity.duration}m
                                            </Typography>
                                        </Stack>
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <Flame size={16} color="#94a3b8" />
                                            <Typography variant="body2" color="#f8fafc">
                                                {activity.caloriesBurned} cal
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </Grid>
                ))}
            </Grid>
        </Box>
    )
}

export default ActivityList