import React, { useEffect, createContext } from "react"
import { Filter } from "../components/Filter";
import { Searchbar } from "../components/Searchbar";
import { Twittercard } from "../components/Twittercard"
import db from "../data/df_elon_musk.json"

/* CREATING CONTEXT FOR DATA */
export const DataContext = createContext();

/**
 * Main page of app that hosts a search bar and filtering system to organize
 * all of Elon Musk's tweets.
 * 
 * Data is statically hosted as JSON data.
 * 
 * Flow is as follows:
 * 1. data is stored as a state in availableTweets to have a full copy
 * 2. tweetsFiltered will be a copy of availableTweets for filters
 * 3. numLoaded allows us to slice tweetsFiltered at any point
 * 4. changes made in Filter.js and Searchbar.js will be applied to the tweetsFiltered useEffect
 */
export const DashboardPage = () => {
  /* LOADING TWEETS STATE */
  const [availableTweets, setAvailableTweets] = React.useState(db);
  const [numLoaded, setNumLoaded] = React.useState(99);
  const [tweetsFiltered, setTweetsFiltered] = React.useState(availableTweets);

  /* FILTER STATES */
  const [dateState, setDateState] = React.useState("ascending");
  const [sentimentState, setSentimentState] = React.useState("");
  const [labelState, setLabelState] = React.useState("");

  /* CONVERTING SENTIMENT VALUE TO PERCENTAGE */
  const sentiment_to_percent = (pos, neu, neg) => {
    return [(pos*100).toFixed(1), (neu*100).toFixed(1), (neg*100).toFixed(1)]
  }

  /* HANDLE ONCLICK OF LOAD MORE BUTTON */
  const handleOnClick = () => {
    setNumLoaded(numLoaded + 99);
  }

  /* RE-RENDER WHEN SEARCH QUERY CHANGES */
  useEffect(() => {
    /* search bar changes */
    if (tweetsFiltered.length === 0) {
      setNumLoaded(0);
    } else if (tweetsFiltered.length <= 99) {
      setNumLoaded(tweetsFiltered.length);
    } else {
      setNumLoaded(99);
    }
    // console.log("num loaded " + numLoaded)
  }, [tweetsFiltered, dateState, sentimentState]);

  return (
    <DataContext.Provider
      value={{
        availableTweets,
        setAvailableTweets,
        numLoaded,
        setNumLoaded,
        tweetsFiltered,
        setTweetsFiltered,
        dateState,
        setDateState,
        sentimentState,
        setSentimentState,
        labelState,
        setLabelState
      }}
    >
      <div className="dashboardpage">
        <Searchbar />
        <div className="dashboardpage-contents">
          <div className="filter-content">
            <Filter />
          </div>
          <div className="tweet-content">
            <div className="tweets">
              {tweetsFiltered.slice(0,numLoaded).map((tweet, index) => (
                <>
                <Twittercard
                  key={index}
                  sentiment={sentiment_to_percent(tweet.pos_sent, tweet.neu_sent, tweet.neg_sent)}
                  content={tweet.tweet}
                  date={tweet.date}
                  num_replies={tweet.num_replies}
                  num_retweets={tweet.num_retweets}
                  num_likes={tweet.num_likes}
                  tags={Object.values(tweet.labels)}
                />
                </>
              ))}
            </div>
            <div className="moreTweets">
              <button className="moreTweets-btn" onClick={handleOnClick}>
                <h4><b>View More</b></h4>
              </button>
            </div>
          </div>
        </div>
        {/* {JSON.stringify(db)} */}
        {/* {typeof(db)} */}
      </div>
    </DataContext.Provider>
  )
}