import * as React from 'react';
import Box from '@mui/material/Box';

import './ScrollTabs.css'

export default function ScrollTabs({ tabList, setChosen } : { tabList : {tab: string, id: number}[], setChosen: (chosen: number) => void} ) {
  const [value, setValue] = React.useState(0);

  const toggleTab = (newValue: number) => {
    setValue(newValue);
    setChosen(newValue)
  };

  return (
    <Box sx={{  bgcolor: '#f1f1f1', width: "100%"}}>
      {/* <div className="container"> */}
        <div className="bloc-tabs">
          { 
            tabList.map( ({tab, id}, index) => <button key={id}
              className={value === index ? "tabs active-tabs" : "tabs"}
              onClick={() => toggleTab(index)} >
              {tab}
            </button>  ) 
          }
        </div>
      {/* </div> */}
    </Box>
  );
}
