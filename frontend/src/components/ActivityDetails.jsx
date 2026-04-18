import { Box, Card, CardContent, Divider, Typography, Stack, Grid, Button, Paper, CircularProgress } from "@mui/material"
import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router"
import { getActivityDetail } from "../services/api";
import { ArrowLeft, Brain, Clock, Flame, Calendar, Activity, ShieldCheck, Zap, Sparkles, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const ActivityDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activity, setActivity] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchActivityDetail = async () => {
            try {
                const response = await getActivityDetail(id);
                setActivity(response.data);
            }
            catch(error) {
                console.error(error);
                setError("Failed to load activity details. Please try again.");
            }
        };
        fetchActivityDetail();
    }, [id]);

    const renderHeader = () => (
        <Button 
            startIcon={<ArrowLeft size={18} />} 
            onClick={() => navigate(-1)}
            sx={{ mb: 3, color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
        >
            Back to Activities
        </Button>
    );

    if (error) {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {renderHeader()}
                <Card sx={{ p: 4, textAlign: 'center', borderColor: 'error.main' }}>
                    <Typography color="error" variant="h6">{error}</Typography>
                    <Button variant="outlined" onClick={() => window.location.reload()} sx={{ mt: 2 }}>
                        Retry
                    </Button>
                </Card>
            </motion.div>
        );
    }

    if (!activity) {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {renderHeader()}
                <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    py: 12,
                    gap: 3 
                }}>
                    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                        <CircularProgress size={60} thickness={4} sx={{ color: 'primary.main' }} />
                        <Box sx={{
                            top: 0, left: 0, bottom: 0, right: 0,
                            position: 'absolute', display: 'flex',
                            alignItems: 'center', justifyContent: 'center',
                        }}>
                             <Brain size={24} className="animate-pulse" color="#a855f7" />
                        </Box>
                    </Box>
                    <Stack alignItems="center" spacing={1}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>Analyzing Activity Insights</Typography>
                        <Typography color="text.secondary">Our AI is crunching the numbers for you...</Typography>
                    </Stack>
                </Box>
            </motion.div>
        );
    }

    const metrics = [
        { label: 'Duration', value: `${activity.duration}m`, icon: <Clock size={20} color="#06b6d4" /> },
        { label: 'Calories', value: `${activity.caloriesBurned}`, icon: <Flame size={20} color="#ff4d4d" /> },
        { label: 'Date', value: new Date(activity.createdAt).toLocaleDateString(), icon: <Calendar size={20} color="#a855f7" /> },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
        >
            {renderHeader()}

            <Grid container spacing={4}>
                <Grid item xs={12} md={5}>
                    <Card sx={{ height: '100%', p: 2 }}>
                        <CardContent>
                            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
                                <Activity size={24} color="#a855f7" />
                                {activity.type}
                            </Typography>
                            
                            <Stack spacing={3}>
                                {metrics.map((metric, i) => (
                                    <Paper key={i} elevation={0} sx={{ p: 2, bgcolor: 'rgba(255, 255, 255, 0.03)', borderRadius: 3 }}>
                                        <Stack direction="row" alignItems="center" spacing={2}>
                                            <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'rgba(255, 255, 255, 0.05)' }}>
                                                {metric.icon}
                                            </Box>
                                            <Box>
                                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                                    {metric.label}
                                                </Typography>
                                                <Typography variant="h6" sx={{ fontSize: '1.1rem' }}>
                                                    {metric.value}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </Paper>
                                ))}
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={7}>
                    {activity.recommendation ? (
                        <Card className="animate-glow" sx={{ 
                            border: '1px solid rgba(168, 85, 247, 0.3)',
                            background: 'linear-gradient(145deg, rgba(30, 30, 35, 0.8) 0%, rgba(10, 10, 12, 0.9) 100%)',
                            position: 'relative',
                            overflow: 'visible'
                        }}>
                            <Box sx={{ 
                                position: 'absolute', 
                                top: -12, 
                                right: 24, 
                                bgcolor: 'primary.main', 
                                color: 'white',
                                px: 2,
                                py: 0.5,
                                borderRadius: 10,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                boxShadow: '0 4px 12px rgba(168, 85, 247, 0.4)'
                            }}>
                                <Sparkles size={14} />
                                <Typography variant="caption" sx={{ fontWeight: 700 }}>AI RECOMMENDATION</Typography>
                            </Box>

                            <CardContent sx={{ p: 4 }}>
                                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: 'primary.light' }}>
                                    <Brain size={22} />
                                    Analysis & Insights
                                </Typography>
                                <Typography paragraph sx={{ color: 'text.primary', lineHeight: 1.7, bgcolor: 'rgba(168, 85, 247, 0.05)', p: 2, borderRadius: 2, borderLeft: '4px solid #a855f7' }}>
                                    {activity.recommendation}
                                </Typography>

                                <Stack spacing={4} sx={{ mt: 4 }}>
                                    {activity.improvements?.length > 0 && (
                                        <Box>
                                            <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'secondary.main' }}>
                                                <Zap size={18} /> Optimization
                                            </Typography>
                                            <Stack spacing={1}>
                                                {activity.improvements.map((text, i) => (
                                                    <Typography key={i} variant="body2" color="text.secondary">• {text}</Typography>
                                                ))}
                                            </Stack>
                                        </Box>
                                    )}

                                    {activity.suggestions?.length > 0 && (
                                        <Box>
                                            <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'accent-tertiary' }}>
                                                <Sparkles size={18} color="#10b981" /> Next Steps
                                            </Typography>
                                            <Stack spacing={1}>
                                                {activity.suggestions.map((text, i) => (
                                                    <Typography key={i} variant="body2" color="text.secondary">• {text}</Typography>
                                                ))}
                                            </Stack>
                                        </Box>
                                    )}

                                    {activity.safety?.length > 0 && (
                                        <Box>
                                            <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'error.light' }}>
                                                <ShieldCheck size={18} /> Safety First
                                            </Typography>
                                            <Stack spacing={1}>
                                                {activity.safety.map((text, i) => (
                                                    <Typography key={i} variant="body2" color="text.secondary">• {text}</Typography>
                                                ))}
                                            </Stack>
                                        </Box>
                                    )}
                                </Stack>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card sx={{ py: 8, textAlign: 'center' }}>
                            <CardContent>
                                <Brain size={48} color="#94a3b8" style={{ marginBottom: 16, opacity: 0.5 }} />
                                <Typography color="text.secondary">
                                    Analyzing your metrics for AI recommendations...
                                </Typography>
                            </CardContent>
                        </Card>
                    )}
                </Grid>
            </Grid>
        </motion.div>
    )
}

export default ActivityDetail