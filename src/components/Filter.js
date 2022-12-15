import { FormControl, FormControlLabel, InputLabel, MenuItem, Radio, RadioGroup, Select } from "@mui/material";
import React, {useContext} from "react"

/* IMPORTING CONTEXT FROM DASHBOARD PAGE */
import { DataContext } from "../pages/DashboardPage";

/* DATE FILTER FUNCTION */
export const dateFilter = (data, state) => {
  if (state === "descending") {
    return data.sort((a, b) => {
      return new Date(a.date) - new Date(b.date);
    });
  } else {
    return data.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });
  }
}

/* SENTIMENT FILTER FUNCTION */
export const sentimentFilter = (data, state) => {
  if (state === "pos") {
    return data.sort((a, b) => {
      return a.pos_sent - b.pos_sent;
    });
  } else if (state === "neu") {
    return data.sort((a, b) => {
      return a.neu_sent - b.neu_sent;
    });
  } else if (state === "neg") {
    return data.sort((a, b) => {
      return a.neg_sent - b.neg_sent;
    });
  } else {
    return data;
  }
}

/* LABEL FILTER FUNCTION */
export const labelFilter = (data, state) => {
  if (state === "tesla") {
    return data.sort((a, b) => {
      return
    })
  } else if (state === "space") {
    return data.sort((a, b) => {
      return
    })
  } else if (state === "solar") {
    return data.sort((a, b) => {
      return
    })
  } else if (state === "working") {
    return data.sort((a, b) => {
      return
    })
  } else if (state === "misc") {
    return data.sort((a, b) => {
      return
    })
  } else {
    return data;
  }
}

/**
 * Filter will serve as a way for users to filter certain search query parameters.
 */
export const Filter = () => {
  /* LOAD IN SOME CONTEXT STATES */
  const { dateState, setDateState , sentimentState, setSentimentState, tweetsFiltered, setTweetsFiltered } = useContext(DataContext);
  
  /* HANDLERS */
  const handleDateFilter = (event) => {
    setDateState(event.target.value);
    setTweetsFiltered(dateFilter(tweetsFiltered, dateState));
    // console.log(event.target.value);
  };

  const handleSentimentFilter = (event) => {
    setSentimentState(event.target.value);
    setTweetsFiltered(sentimentFilter(tweetsFiltered, sentimentState));
  }

  return (
    <div className="filters">
      <h2>Filter By...</h2>
      <div className="filter-groups">
        <div className="filter date">
          <h3>Date</h3>
          <FormControl>
            <RadioGroup
              defaultValue={dateState}
              name={"dates-radio-button-group"}
            >
              <FormControlLabel value={"ascending"} control={<Radio />} label={"Ascending"} onChange={handleDateFilter} />
              <FormControlLabel value={"descending"} control={<Radio />} label={"Descending"} onChange={handleDateFilter} />
            </RadioGroup>
          </FormControl>
        </div>
        <div className="filter sentiment">
          <h3>Top Sentiment</h3>
          <FormControl variant="filled" sx={{ m: 1, minWidth: 320 }}>
            <InputLabel>We Feeling...</InputLabel>
            <Select
              defaultValue={sentimentState}
              name={"sentiment-radio-button-group"}
              onChange={handleSentimentFilter}
            >
              <MenuItem value={""}>
              <em>None</em>
              </MenuItem>
              <MenuItem value={"pos"} >Positive</MenuItem>
              <MenuItem value={"neu"} >Neutral</MenuItem>
              <MenuItem value={"neg"} >Negative</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className="filter label">
          <h3>Label</h3>
          <FormControl variant="filled" sx={{ m: 1, minWidth: 320 }}>
            <InputLabel>Categories</InputLabel>
            <Select
              defaultValue={sentimentState}
              name={"sentiment-radio-button-group"}
              onChange={handleSentimentFilter}
            >
              <MenuItem value={""}>
              <em>None</em>
              </MenuItem>
              <MenuItem value={"tesla"} >Tesla</MenuItem>
              <MenuItem value={"space"} >Space</MenuItem>
              <MenuItem value={"solar"} >Solar</MenuItem>
              <MenuItem value={"working"} >Working</MenuItem>
              <MenuItem value={"misc"} >Misc</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>
    </div>
  )
}