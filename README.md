# The Musk Machine

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Overview

**The Musk Machine** is a dashboard that provides insight into the world of Elon Musk. More specifically, it presents a database of all of Musk's tweets with one simple goal in mind: how do his tweets reflect his character? How is it that a businessman who enjoyed trolling around on Twitter came to own it? Are his tweets able to say something about his career and life trajectory? These questions and many others helped to define the scope of this project.

## Background

In building the Musk Machine, I wanted to tie in both elements of Information Organization and Retrieval (INFO 202), my background in front-end development, and my newfound interests in natural language processing (NLP). I will say that prior to this endeavor, I had no understanding of NLP. I had taken a couple of machine learning (ML) courses in the past that were more focused on theory and mathematics, but everything in the JuPyter notebook is from my own extensive research of reading through how others have applied ML and NLP tools to datasets of tweets.

I arrived at the conclusion of working on tweets of Elon Musk simply because I was curious. There's a lot of things to admire (and dislike) Musk and because of his position in society as one of the most wealthy people in the world breaking headlines left and right for heavily controversial reasons, much is to be said about the new Twitter CEO. Personally, I have always wanted to become a tech revolutionary like Tony Stark of the Marvel Cinematic Universe and a similar real life equivalent is Elon Musk.

## Technologies

This app is built on `React.js` + `SCSS` on the front-end and `Python` on the back-end. GitHub pages, however, does not host back-ends as they are statically hosted websites. To circumvent that issue, I performed all of my tasks on a [JuPyter notebook](https://colab.research.google.com/drive/1EmKVh6Bi-XKRD1WTzB_9krLv-cvbUODu?usp=sharing). This JuPyter notebook is accessible to anyone with a UC Berkeley account to view and is also in the GitHub repo under `src/data`.

### JuPyter Notebook

The data for this project can be found on [Kaggle](https://www.kaggle.com/datasets/ayhmrba/elon-musk-tweets-2010-2021). This dataset came with 13 sub-datasets of all of Elon Musk's tweets from 2010 to early 2022. **NOTE: Working on Google Colab, running this dataset requires that the datasets be downloaded onto the user's Google Drive.**

#### Imports

To get the notebook running, we start with a handful of imports that help with data preprocessing, data analysis, sentiment analysis, and other miscellaneous tasks. This task requires `pandas` for all dataframe related work.

```
# imports for the project

### data analysis ###
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

### data preprocessing and feature engineering ###
import re
import collections
import nltk
from nltk.corpus import stopwords

### sentiment analysis and visuals ###
nltk.download('vader_lexicon')
from wordcloud import WordCloud
from nltk.sentiment.vader import SentimentIntensityAnalyzer

### export our data ###
import json
```

#### Loading the Data

Once we have our imports, let's concatenate all of our dataframes into one.

```
# reading our csv files onto variables
df2010 = pd.read_csv('/content/drive/My Drive/info 202/data/2010.csv')
df2011 = pd.read_csv('/content/drive/My Drive/info 202/data/2011.csv')
df2012 = pd.read_csv('/content/drive/My Drive/info 202/data/2012.csv')
df2013 = pd.read_csv('/content/drive/My Drive/info 202/data/2013.csv')
df2014 = pd.read_csv('/content/drive/My Drive/info 202/data/2014.csv')
df2015 = pd.read_csv('/content/drive/My Drive/info 202/data/2015.csv')
df2016 = pd.read_csv('/content/drive/My Drive/info 202/data/2016.csv')
df2017 = pd.read_csv('/content/drive/My Drive/info 202/data/2017.csv')
df2018 = pd.read_csv('/content/drive/My Drive/info 202/data/2018.csv')
df2019 = pd.read_csv('/content/drive/My Drive/info 202/data/2019.csv')
df2020 = pd.read_csv('/content/drive/My Drive/info 202/data/2020.csv')
df2021 = pd.read_csv('/content/drive/My Drive/info 202/data/2021.csv')
df2022 = pd.read_csv('/content/drive/My Drive/info 202/data/2022.csv')

# we have a lot of csv files to work with
# let's concatenate them all together
tweet_df = pd.concat([df2010, df2011, df2012, df2013, df2014, df2015, df2016, df2017, df2018, df2019, df2020, df2021, df2022], ignore_index=True)
tweet_df
```

#### Data Cleaning

It looks like there are a lot of columns in the dataframe that we don't need. I removed them out for the sake of my own personal sanity.

```
# there are a lot of columns that we don't need
# list(tweet_df.columns)
tweet_df = tweet_df.drop(['Unnamed: 0','id','conversation_id','created_at','timezone','place','language','user_id','user_id_str','username','name','day','hour','link','urls','photos','video','thumbnail','retweet','quote_url','search','near','geo','source','user_rt_id','user_rt','retweet_id','retweet_date','translate','trans_src','trans_dest'], axis=1)
list(tweet_df.columns) # should be 15 columns

# just need to remove extra columns
clean_df = clean_df.drop(['cashtags','reply_to','mentions'], axis=1)
clean_df
```

Next, we have to clean some data as a result of values being placed in different columns over time.

```
# move the replies_count, retweets_count, and likes_count to nreplies, nretweets, and nlikes respectively
tweet_df['nlikes'] = tweet_df['nlikes'].fillna(0)
tweet_df['nreplies'] = tweet_df['nreplies'].fillna(0)
tweet_df['nretweets'] = tweet_df['nretweets'].fillna(0)
tweet_df['likes_count'] = tweet_df['likes_count'].fillna(0)
tweet_df['replies_count'] = tweet_df['replies_count'].fillna(0)
tweet_df['retweets_count'] = tweet_df['retweets_count'].fillna(0)

tweet_df['num_likes'] = tweet_df['nlikes'] + tweet_df['likes_count']
tweet_df['num_replies'] = tweet_df['nreplies'] + tweet_df['replies_count']
tweet_df['num_retweets'] = tweet_df['nretweets'] + tweet_df['retweets_count']

tweet_df = tweet_df.drop(['nlikes','nreplies','nretweets','likes_count','replies_count','retweets_count'], axis=1)
tweet_df
```

#### Cleaning Tweets for Analysis

With all of our data cleaned up in the dataframe, we want to start looking into what Elon Musk is saying. However, it is hard to analyze tweets as they are presented. I utilized the `re` Python library to integrate regex operations to clean up the tweets into a new column.

Sources:
- https://medium.com/vickdata/detecting-hate-speech-in-tweets-natural-language-processing-in-python-for-beginners-4e591952223
- https://docs.python.org/3/library/re.html

```
# let's use the re library to clean up tweets by using regex matching

def clean_tweet(df, tweet_col, new_col):
  """
  df: pandas dataframe being worked on
  tweet_col: column with tweets
  new_col: column where cleaned tweets will go to
  ---
  clean_tweet takes in a column of raw tweets from a df, turns it lowercase,
  and applies a regex matching operation (this assumes we count capitalized
  versions of a word as the same -- Apple and apple)
  ---
  returns df
  """
  df[new_col] = df[tweet_col].str.lower()
  df[new_col] = df[new_col].apply(lambda elem: re.sub(r"(@[A-Za-z0-9]+)|([^0-9A-Za-z \t])|(\w+:\/\/\S+)|^rt|http.+?", "", elem))
  
  return df

clean_df = clean_tweet(tweet_df, "tweet", "clean_tweet")
clean_df
```

#### Frequency Analysis

My first approach into the analysis of tweets was to see what words Elon Musk said the most over the last 10+ years on Twitter. To ensure that I wouldn't be seeing a lot of common terms (known as stopwords), I made sure to remove those on top of my own custom list as well.

```
# operate on a list of those newly cleaned tweets
tweets_list = clean_df['clean_tweet'].values.tolist()
# tweets_list

# looks like there are a lot of meaningless words
# we can remove stopwords with the nltk package
nltk.download('stopwords')
# stop_words = set(stopwords.words('english'))
stop_words = nltk.corpus.stopwords.words('english')

# this list is pretty good but we can add a lot more based on a couple runs
# we only want top categories so let's remove sentiments
new_stopwords = ['hes', 'shes', 'youre', 'dont', 'wouldnt', 'didnt', 'amp',
                 'good', 'like', 'yes', 'would', 'great', 'one', 'much',
                 'first', 'also', 'new', 'thanks', 'make', 'need', 'yeah',
                 'true', 'soon', 'right', 'get', 'way', 'even', 'thats', 'us',
                 'actually', 'many', 'coming', 'probably', 'sure', 'exactly',
                 'really', 'next', 'year', 'better', 'maybe', 'im', 'lot',
                 'still', 'best', 'back', 'go', 'long', 'going', 'week',
                 'almost', 'well', 'could', 'know', 'w', 'cool', 'hard',
                 'point', 'big', 'needed', 'day', 'full', 'ok', 'want', 'haha',
                 'made', 'done', 'see', 'today', 'enough', 'cant', 'something']
stop_words.extend(new_stopwords)
```

From there, I was able to split all of the tweets into a list of words and run a frequency counter using the `collections` library.

```
# split the tweets into a large list of words
words_list = []
for tweet in tweets_list:
  filtered_tweet = [word for word in tweet.split() if not word in stop_words]
  words_list += filtered_tweet

words_list

# we can use the collections library to count commonly used words
counts_list = collections.Counter(words_list)
counts_list.most_common(50)
```

#### Categories and Bias

The top words included tesla, space, work, solar, and other miscellaneous words. As a result, I went with my own gut and researched a little more about Musk before landing on those aforementioned buckets to categorize and label the tweets. The categories of **tesla** would contain words related to driving and cars, **space** would relate to his company, SpaceX, and other aeronautic related tweets, **solar** would relate to energy, **work** is about Elon's outlooks on the workforce and his controversial opinions on laying off employees, and **misc** would apply to all else.

This, of course, presents my own personal bias into the categorization of tweets, creating a supervised learning model. An alternative approach would have been to cluster the tweets without labels so that I can see what similarities tweets have with one another to form the labels afterward. As a result of my own internal discussions, I tried a Jaccard similarity scorer model to see how that would go. The category words variables can be found in the notebook.

```
# time to evaluate our tweets to a similarity score algorithm

def jaccard_similarity(query, document):
  intersection = set(query).intersection(set(document))
  union = set(query).union(set(document))
  return len(intersection)/len(union)

def get_scores(tweets):
  tweets_and_scores = []
  for tweet in tweets:
    tesla_score = jaccard_similarity(tesla_category_words2, tweet)
    space_score = jaccard_similarity(space_category_words2, tweet)
    solar_score = jaccard_similarity(solar_category_words2, tweet)
    work_score = jaccard_similarity(working_category_words2, tweet)
    misc_score = jaccard_similarity(misc_category_words2, tweet)
    tweets_and_scores.append([tweet,
                              [tesla_score, space_score,
                               solar_score, work_score,
                               misc_score]])
  return tweets_and_scores

# tesla_score = get_scores(tesla_category_words2, tweets_list)
# space_score = get_scores(space_category_words2, tweets_list)
# solar_score = get_scores(solar_category_words2, tweets_list)
# work_score = get_scores(working_category_words2, tweets_list)
get_scores(tweets_list)
```

Unfortunately, the scores I received on each tweet was not accurate at all. Some tweets only mentioning tesla would somehow score higher in space and other categories. As a result, I defaulted to a naive approach of applying all of them manually (NOT BY HAND). Thus, I wrote a quick script that would run through all of the tweets and if the tweets contained at least one word from the categories, they would be labeled as such. If none, they received the misc tag.

```
# since the jaccard similarity measure didn't work, i will try a naive
# approach of brute forcing categories onto the tweets

def adding_labels(tweet):
  labels_for_this_tweet = []
  for each_word in tweet.split():
    if "tesla" not in labels_for_this_tweet:
      if each_word in tesla_category_words:
        labels_for_this_tweet.append("tesla")
    if "space" not in labels_for_this_tweet:
      if each_word in space_category_words:
        labels_for_this_tweet.append("space")
    if "solar" not in labels_for_this_tweet:
      if each_word in solar_category_words:
        labels_for_this_tweet.append("solar")
    if "working" not in labels_for_this_tweet:
      if each_word in working_category_words:
        labels_for_this_tweet.append("working")
    if "misc" not in labels_for_this_tweet:
      if each_word in misc_category_words:
        labels_for_this_tweet.append("misc")
  if labels_for_this_tweet == []:
    labels_for_this_tweet.append("misc")
  return labels_for_this_tweet

clean_df['labels'] = clean_df.apply(lambda row: adding_labels(row['clean_tweet']), axis=1)
clean_df
```

#### Sentiment Analysis

On top of the new metadata tags, I wanted to see how Elon Musk was like on Twitter in regards to sentiment. To do this, I utilized the `nltk vader lexicon` package and `SentimentIntensityAnalyzer` function to calculate these values.

```
# takes about 4min 38sec
def sentiment_calc(tweet):
  score = SentimentIntensityAnalyzer().polarity_scores(tweet)
  return score.get('pos'),score.get('neu'),score.get('neg')

clean_df[['pos_sent', 'neu_sent', 'neg_sent']] = clean_df.apply(lambda row: sentiment_calc(row['clean_tweet']), axis=1, result_type="expand")
```

I will note that this package is pretty light. What I mean by that is that the analysis does not look at phrases in a sentence. Rather, it takes each word as is and calculates the score for the total phrase. To test, run the `sentiment_calc` function on the following sentences:
- "I am happy"
- "I am so happy"

You will find that the first sentence scores higher positively than the second, and that the second is more neutralized by the "so". Adding more "so" before "happy", one would expect the sentiment to be more positive but alas, that is simply a technical limitation of the package. As a result, a quick peek at any of his tweets would indicate that Elon is a pretty "neutral" tweeter overall, with "Nuke Mars!" as a very neutral tweet.

### React

As a result of a static website not being deployed to the cloud, I relied on a static export of the `pandas` dataframe into a `json` file. I utilized the JSON file to map my data into tweets rendered by my own custom components that I have designed. A search bar and filtering side bar aid in narrowing the tweets for any given search query.

## Main Features

### Tweet Searching and Tweet Filtering

For the search feature, a user can enter a search query into the search bar at the top of the dashboard to look for a certain tweet. This search filters through the tweets themselves and not the dates, tags, and other metadata. The filtering feature allows a user to narrow down the list of tweets by metadata. A user can find tweets by labels, sentiment analysis, and date. Both of these features work in conjunction with one another.

## Class Concepts

From the INFO 202 class, a lot of emphasis was placed on metadata. As such, my focus was to take the Twitter platform and turn it into something more approachable like a shopping page. The Twitter platform is quite difficult for those who are looking to find a certain tweet or filter on a single person's page.

In the Google Colab notebook, I focused on adding new metadata tags through machine learning and natural language processing. While it was a struggle on the Jaccard similarity scorer front, I found a lot of success in the sentiment analysis and the manual input of labels to build new metadata tags to allow users to better navigate the dataframe.

Did you know that 34,000+ tweets is stored in a JSON file of over 13MB? Now you do. As a result of the large dataset, I wanted to make sure that my choices in metadata creation as well as the searching and filtering processes on the app would allow a user to see what they want from their search query.

When it comes to applying these technologies and this project into INFO 202, I utilized the power of a **faceted search navigation system**. By combining the filters of date, sentiment, and labels alongside a search bar, a user is able to navigate a search query and locate any one of Elon Musk's tweets about any given topic, if any.

In cleaning up the tweets to best prepare them for analysis, I incorporated class concepts on the **tokenization** lecture such as applying regular expression (regex) operations to best remove any links, emojis, and other values and symbols that would mess up the cleaning of tweets for analysis. As a side note, I think I could have better improved the cleaning of my tweets and data preprocessing by stemming words in my tweet. While this may remove meaning on a lot words, I believed it would have been effective in further analyzing tweets to categories.

While my **categorization** of tweets was not automated effectively as planned using an ML model, I believe that I have created a system that decently reflects that extent of most tweets.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

## Future Directions

Like mentioned before, there are a lot of things I would like to do as a result of simply not knowing any natural language processing. In taking NLP and data visualization next semester, I would hope to continue this project to show new visuals, highlight important points in Elon Musk's Twitter career, and integrate new features onto the dashboard that better and more accurately reflect his tweets. I am excited to take INFO 259 and INFO 247 next semester for these reasons.

## Miscellaneous

This took about two days. I would not try replicating this process again.