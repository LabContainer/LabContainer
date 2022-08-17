import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import CircularProgressWithLabel from '../../components/common/CircularProgressWithLabel';

import './DashboardCard.css'

export interface DashBoardData {
  "LabName" : string
  "Course" : string
  "Progress": number
  "Instructor": string
  "TimeLeft" : string
}

export default function DashboardCard({data} : {data : DashBoardData}) {
  const theme = useTheme();

  return (
    <Card sx={{  margin: "30px" }}>
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: "space-evenly" }}>
        <CardContent className='card_internal'>
          <Typography component="div" variant="h5">
            { data.LabName }
          </Typography>
        </CardContent>
        <CardContent sx={{ flex: '1 0 auto' , borderRight: "1px solid grey", flexDirection: 'column', justifyContent: "center"}} className='card_internal'>
          <Typography component="div" variant="h5">
            { data.Course }
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" component="div">
            { data.Instructor }
          </Typography>
        </CardContent>
        <CardContent className='card_internal'>
          <Typography component="div" variant="h5">
            <CircularProgressWithLabel value={data.Progress} size="5rem" ></CircularProgressWithLabel>
          </Typography>
        </CardContent>
        <CardContent className='card_internal'>
          <Typography component="div" variant="h5">
            { data.TimeLeft } Left
          </Typography>
        </CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
          <Typography component="div" variant="h5">
            Continue
          </Typography>
          <IconButton aria-label="play/pause">
            <PlayArrowIcon sx={{ height: 38, width: 38 }} />
          </IconButton>
        </Box>
      </Box>
    </Card>
  );
}