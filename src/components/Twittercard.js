import { Tag } from "./Tag";

/**
 * Elon Musk's tweets will be rendered into a custom component
 * similar to that of an actual tweet. This component will take in
 * the tweet's contents, number of likes/retweets/replies, date,
 * sentiment analysis, hashtags, and tags as visible metadata.
 * 
 * content, date, sentiment, hashtags: string
 * 
 * num_likes, num_retweets, num_replies: int
 * 
 * tags: tag component
 */
export const Twittercard = (props) => {
  /* sentiment indexes */
  const first_sentiment = 0;
  const secnd_sentiment = 1;
  const third_sentiment = 2;

  return (
    <div className="twittercard">
      <div className="twittercard-header">
        <div className="bio">
          <div className="pfp">
            <img src={process.env.PUBLIC_URL + "/Elon_Musk.jpg"} alt="Elon Musk" />
          </div>
          <div className="names">
            <div className="name"><h4><b>Elon Musk</b></h4></div>
            <div className="handle"><h4>@elonmusk</h4></div>
          </div>
        </div>
        <div className="sentiment">
          <h5 className="right-align">{"" + props.sentiment[first_sentiment] + "% pos sentiment"}</h5>
          <h5 className="right-align">{"" + props.sentiment[secnd_sentiment] + "% neu sentiment"}</h5>
          <h5 className="right-align">{"" + props.sentiment[third_sentiment] + "% neg sentiment"}</h5>
        </div>
      </div>
      <div className="twittercard-content">
        <p>{props.content}</p>
        <h5>{props.date}</h5>
      </div>
      <div className="twittercard-stats">
        <div className="stat">
          <img src={process.env.PUBLIC_URL + "/reply.png"} alt="Replies" className="icon" />
          <h5 className="">{props.num_replies}</h5>
        </div>
        <div className="stat">
          <img src={process.env.PUBLIC_URL + "/retweet.png"} alt="Retweets" className="icon" />
          <h5 className="">{props.num_retweets}</h5>
        </div>
        <div className="stat">
          <img src={process.env.PUBLIC_URL + "/heart.png"} alt="Likes" className="icon" />
          <h5 className="">{props.num_likes}</h5>
        </div>
      </div>
      <div className="twittercard-tags">
        {props.tags.map((tag) => (
          <Tag name={tag} />
        ))}
      </div>
    </div>
  )
}