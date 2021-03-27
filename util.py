import random
import pandas as pd
import os

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


def main():
    create_years("/Users/aaron/Desktop/csci1951a/hw6-dataviz-aaronwangj/data/netflix.csv")

if __name__ == "__main__":
    main()