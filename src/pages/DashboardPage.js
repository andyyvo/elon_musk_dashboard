import React, { useEffect } from "react"
import { Searchbar } from "../components/Searchbar";
import { Twittercard } from "../components/Twittercard"
import db from "../data/df_elon_musk.json"

/**
 * Main page of app that hosts a search bar and filtering system to organize
 * all of Elon Musk's tweets.
 * 
 * Data is statically hosted as JSON data.
 */
export const DashboardPage = () => {
  const [numLoaded, setNumLoaded] = React.useState(99);
  const [tweetsLoaded, setTweetsLoaded] = React.useState(db.slice(0,numLoaded));

  const sentiment_to_percent = (pos, neu, neg) => {
    return [(pos*100).toFixed(1), (neu*100).toFixed(1), (neg*100).toFixed(1)]
  }

  const handleOnClick = () => {
    setNumLoaded(numLoaded + 99);
  }

  useEffect(() => {
    setTweetsLoaded(db.slice(0, numLoaded))
  }, [numLoaded])

  return (
    <div className="dashboardpage">
      <Searchbar />
      <div className="tweets">
        {tweetsLoaded.map((tweet, index) => (
          <>
          <Twittercard
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
    </div>
  )
}