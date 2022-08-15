import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

export default function ScrollTabs({ tabList, setChosen } : { tabList : string[], setChosen: React.Dispatch<React.SetStateAction<number>>} ) {
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
        { tabList.map( tab => <Tab label={tab} />  ) }
        
      </Tabs>
    </Box>
  );
}
