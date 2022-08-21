import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

import './ScrollTabs.css'

export default function ScrollTabs({ tabList, setChosen } : { tabList : {tab: string, id: number}[], setChosen: (chosen: number) => void} ) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    setChosen(newValue)
  };

  return (
    <Box sx={{  bgcolor: 'background.paper', width: "100%"}}>
      <Tabs
        value={value}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons
        allowScrollButtonsMobile
        aria-label="scrollable force tabs example"
      >
        { tabList.map( ({tab, id}) => <Tab label={tab} key={id} />  ) }
        
      </Tabs>
    </Box>
  );
}
