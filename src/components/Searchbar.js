import React from "react";
import TextField from "@mui/material/TextField";

/**
 * Searchbar will serve as a nav bar for the whole app. There will
 * be nav links to different parts, the home button back to
 * the dashboard, and a search bar that searches through available
 * tweets.
 */
export const Searchbar = () => {
  return (
    <div className="header">
      <div className="nav">
        <div className="home">
          <a href="/"><h1>The Musk Machine</h1></a>
        </div>
        <div className="links">
          <a href="/" className="link"><h4>link 1</h4></a>
          <a href="/" className="link"><h4>link 2</h4></a>
        </div>
      </div>
      <div className="search">
        <TextField
          fullWidth
          label="Search a tweet"
          variant="filled"
          helperText="Feel free to search up any tweets!"
        />
      </div>
    </div>
  )
}