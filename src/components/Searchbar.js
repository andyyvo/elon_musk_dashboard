import React, { useContext, useEffect } from "react";
import TextField from "@mui/material/TextField";

/* IMPORTING CONTEXT FROM DASHBOARD PAGE */
import { DataContext } from "../pages/DashboardPage";

/**
 * Searchbar will serve as a nav bar for the whole app. There will
 * be nav links to different parts, the home button back to
 * the dashboard, and a search bar that searches through available
 * tweets.
 */
export const Searchbar = () => {
  /* LOAD IN SOME CONTEXT STATES */
  const { availableTweets, tweetsFiltered, setTweetsFiltered } = useContext(DataContext);

  /* SEARCH BAR STATE */
  const [userInput, setUserInput] = React.useState("");

  /* FILTER THROUGH OUR DATA */
  const searchTweets = (query, data) => {
    if (!query) {
      // console.log(data.length)
      // console.log(availableTweets.length)
      setTweetsFiltered(availableTweets);
    } else {
      // console.log(data.filter((d) => d['tweet'].includes(query)).length)
      console.log(tweetsFiltered.length)
      setTweetsFiltered(data.filter((d) => d['tweet'].includes(query)));
    }
  }

  /* RE-RENDER PAGE UPON EVERY USER INPUT */
  useEffect(() => {
    // console.log(userInput)
    // searchTweets(userInput, availableTweets);
    // console.log(dateState);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInput])

  return (
    <div className="header">
      <div className="nav">
        <div className="home">
          <a href="/elon_musk_dashboard"><h1>The Musk Machine</h1></a>
        </div>
        <div className="links">
          {/* <a href="/" className="link"><h4>link 1</h4></a>
          <a href="/" className="link"><h4>link 2</h4></a> */}
        </div>
      </div>
      <div className="search">
        <TextField
          fullWidth
          label="Search a tweet"
          variant="filled"
          helperText="Feel free to search up any tweets!"
          onChange={(e) => {
            setUserInput(e.target.value.toLowerCase());
            searchTweets(userInput, availableTweets);
          }}
          placeholder="Search..."
        />
      </div>
    </div>
  )
}