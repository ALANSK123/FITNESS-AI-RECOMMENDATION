import { Box, Card, CardContent, Divider, duration, Typography } from "@mui/material"
import React, { useEffect, useState } from "react"
import { useParams } from "react-router"
import { getActivityDetail } from "../services/api";

const ActivityDetail = () => {

    const {id} = useParams();
    const [activity, setActivity] = useState(null);
    const [formData, setFormData] = useState({
        duration: "",
        caloriesBurned: ""
    });

    const [recommendation, setReommendation] = useState(null);


    useEffect(() => {
        const fetchActivityDetail = async () => {
            try {
                const response = await getActivityDetail(id);
                // console.log(response);
                setActivity(response.data);
                setReommendation(response.data.recommendation);

                setFormData({
                    duration: response.data.duration,
                    caloriesBurned: response.data.caloriesBurned
                });
            }
            catch(error) {
                console.error(error);
            }
        };

        fetchActivityDetail();
    }, [id]);

    if(!activity) {
        return <Typography>Loading...</Typography>
    }

    return (
        <Box component="section" sx={{ p: 2, border: '1px dashed grey', maxWidth: 800 }} >
            <Card sx={{ mb: 2 }}>
                <CardContent>
                    <Typography variant="h5" gutterBottom>Activity Details</Typography>
                    <Typography>Type: {activity.type}</Typography>
                    <Typography>Duration: {activity.duration} minutes</Typography>
                    <Typography>Calories Burned: {activity.caloriesBurned}</Typography>
                    <Typography>Date: {new Date(activity.createdAt).toLocaleString()}</Typography>
                </CardContent>
            </Card>

            {recommendation && (
                <Card>
                    <CardContent>
                        <Typography variant="h5" gutterBottom>Ai Recommendation </Typography>
                        <Typography variant="h6">Analysis</Typography>
                        <Typography paragraph>{activity.recommendation}</Typography>

                        <Divider sx={{ my: 2 }} />

                        <Typography variant="h6">Improvements</Typography>
                        {activity?.improvements?.map((improvement, index) => (
                            <Typography key={index} paragraph>{improvement}</Typography>
                        ))}

                        <Divider sx={{ my: 2 }} />

                        <Typography variant="h6">Suggestions</Typography>
                        {activity?.suggestions?.map((suggestion, index) => (
                            <Typography key={index} paragraph>{suggestion}</Typography>
                        ))}

                        <Divider sx={{ my: 2 }} />

                        <Typography variant="h6">Safety Guidelines</Typography>
                        {activity?.safety?.map((safety, index) => (
                            <Typography key={index} paragraph>{safety}</Typography>
                        ))}

                    </CardContent>
                </Card>
            )}
        </Box>
    )
}

export default ActivityDetail