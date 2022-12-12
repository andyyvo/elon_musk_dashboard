import React, { useEffect, createContext } from "react"
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
 */
export const DashboardPage = () => {
  /* LOADING TWEETS STATE */
  const [availableTweets, setAvailableTweets] = React.useState(db);
  const [numLoaded, setNumLoaded] = React.useState(99);
  const [tweetsFiltered, setTweetsFiltered] = React.useState(availableTweets);

  /* CONVERTING SENTIMENT VALUE TO PERCENTAGE */
  const sentiment_to_percent = (pos, neu, neg) => {
    return [(pos*100).toFixed(1), (neu*100).toFixed(1), (neg*100).toFixed(1)]
  }

  /* HANDLE ONCLICK OF LOAD MORE BUTTON */
  const handleOnClick = () => {
    setNumLoaded(numLoaded + 99);
  }

  /* RE-RENDER WHEN LOAD MORE */
  useEffect(() => {
    setTweetsFiltered(db.slice(0, numLoaded))
  }, [numLoaded])

  /* RE-RENDER WHEN SEARCH QUERY CHANGES */
  useEffect(() => {
    // console.log("num loaded " + numLoaded)
    if (tweetsFiltered.length === 0) {
      setNumLoaded(0);
    } else if (tweetsFiltered.length <= 99) {
      setNumLoaded(tweetsFiltered.length);
    } else {
      setNumLoaded(99);
    }
  }, [tweetsFiltered])

  return (
    <DataContext.Provider
      value={{
        availableTweets,
        setAvailableTweets,
        numLoaded,
        setNumLoaded,
        tweetsFiltered,
        setTweetsFiltered
      }}
    >
      <div className="dashboardpage">
        <Searchbar />
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
        {/* {JSON.stringify(db)} */}
        {/* {typeof(db)} */}
      </div>
    </DataContext.Provider>
  )
}