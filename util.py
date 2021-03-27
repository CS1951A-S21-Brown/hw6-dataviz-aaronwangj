import random
import pandas as pd
import numpy as np
import os
from collections import Counter

def load_file(file_path):
    # TODO: Use pandas to load data from the file.
    df = pd.read_csv(file_path, skip_blank_lines=True).dropna()
    path = '/Users/aaron/Desktop/csci1951a/hw6-dataviz-aaronwangj/data'
    output_file = os.path.join(path,'netflix_country_count.csv')

    new_df = df["country"].value_counts().reset_index()

    df2 = pd.DataFrame(data = new_df)


    df2.to_csv(output_file, index = False, header = ["country", "count"])
    print('Done! Here is what the head of the csv looks like:')
    print(pd.read_csv(output_file, skip_blank_lines=True).dropna().head())

def create_movie_tv_genres(file_path):
    #load data from the csv file.
    df = pd.read_csv(file_path, skip_blank_lines=True).dropna()

    #path to output csv
    path = '/Users/aaron/Desktop/csci1951a/hw6-dataviz-aaronwangj/data'
    output_movie_path = os.path.join(path,'movie_genres.csv')
    output_show_path = os.path.join(path,'show_genres.csv')

    grouped = df.groupby("type")
    movies = grouped.get_group("Movie")
    shows = grouped.get_group("TV Show")
    shows_genres = shows["listed_in"].value_counts().reset_index()
    movies_genres = movies["listed_in"].value_counts().reset_index()

    df_shows = pd.DataFrame(data = shows_genres)
    df_movies = pd.DataFrame(data = movies_genres)


    df_shows.to_csv(output_show_path, index = False, header = ["genre", "count"])
    df_movies.to_csv(output_movie_path, index = False, header = ["genre", "count"])


def create_movie_durations(file_path):
    #load data from the csv file.
    df = pd.read_csv(file_path, skip_blank_lines=True).dropna()

    #path to output csv
    path = '/Users/aaron/Desktop/csci1951a/hw6-dataviz-aaronwangj/data'
    output_movie_path = os.path.join(path,'movie_durations.csv')
    output_show_path = os.path.join(path,'show_durations.csv')

    grouped = df.groupby("type")
    movies = grouped.get_group("Movie")
    shows = grouped.get_group("TV Show")

    # df_shows = shows.filter(['date_added', 'duration'])
    df_movies = movies.filter(['date_added', 'duration'])

    df_movies['duration'] = df_movies['duration'].str[:-4].astype(float)

    # df_shows.to_csv(output_show_path, index = False, header = ["date_added", "duration"])
    df_movies.to_csv(output_movie_path, index = False, header = ["date_added", "duration"])

def create_years(file_path):
    #load data from the csv file.
    df = pd.read_csv(file_path, skip_blank_lines=True).dropna()

    #path to output csv
    path = '/Users/aaron/Desktop/csci1951a/hw6-dataviz-aaronwangj/data'
    output_path = os.path.join(path,'netflix_years.csv')

    df_years = df.filter(['release_year'])


    df_years.to_csv(output_path, index = False, header = "year")



def average_runtime_per_year(file_path):
    #load data from the csv file.
    df = pd.read_csv(file_path, skip_blank_lines=True).dropna()

    #path to output csv
    path = '/Users/aaron/Desktop/csci1951a/hw6-dataviz-aaronwangj/data'
    output_path = os.path.join(path,'movie_durations_by_year.csv')

    df = df.groupby("type").get_group("Movie")
    df['duration'] = df['duration'].str[:-4].astype(float)

    output = []

    years_grouped = df.groupby("release_year")

    for group_name, df_group in years_grouped:
        output.append([group_name,df_group["duration"].mean()])
    print(output)

    output = np.array(output)

    output = pd.DataFrame(output)

    output.to_csv(output_path, index = False, header = ["year", "count"])


def director_actor_pairs(file_path):
    #load data from the csv file.
    df = pd.read_csv(file_path, skip_blank_lines=True).dropna()

    #path to output csv
    path = '/Users/aaron/Desktop/csci1951a/hw6-dataviz-aaronwangj/data'
    output_path = os.path.join(path,'director_actor_pairs.csv')

    df = df.groupby("type").get_group("Movie")
    df = df.filter(['director', 'cast'])

    # all_directors = df['director']
    # all_actors = df['cast']

    # for key, value in all_directors.iteritems():
    #     print(value)

    result = [f(x, y) for x, y in zip(df['director'], df['cast'])]

    new_result = []

    for i in result:
        new_result = new_result + i
    
    print(new_result)

    
    output = Counter([tuple(i) for i in new_result])

    # (unique, counts) = np.unique(new_result, return_counts=True)

    # frequencies = np.asarray((unique, counts)).T

    output = list(output.items())

    output = np.array(output)

    output = pd.DataFrame(output)

    output.to_csv(output_path, index = False, header = ['pair', 'count'])

def f(x,y):
    x = x.split(", ")
    y = y.split(", ")

    output = []

    for i in x:
        for j in y:
            output.append([i, j])
            # print([i,j])
    
    return output



    


    # output = []
    # print(df['cast'])


    # for group_name, df_group in years_grouped:
    #     output.append([group_name,df_group["duration"].mean()])
    # print(output)

    # output = np.array(output)

    # output = pd.DataFrame(output)

    # output.to_csv(output_path, index = False, header = ["year", "count"])


def main():
    director_actor_pairs("/Users/aaron/Desktop/csci1951a/hw6-dataviz-aaronwangj/data/netflix.csv")

if __name__ == "__main__":
    main()