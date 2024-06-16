import csv
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright

movie_hash = []

def get_movie_info(node):
        # Fetch the HTML content of the node
    node_html = node.inner_html()
    # Create a Beautiful Soup object for the node
    soup = BeautifulSoup(node_html, 'html.parser')

    title = soup.select_one('h5 a').text.replace('"', '') if soup.select_one('h5 a') else ""
    url = soup.select_one('a')['href'] if soup.select_one('a') else ""
    category = soup.select_one('.badge-split-film-category .badge-content').text if soup.select_one('.badge-split-film-category .badge-content') else ""
    genres = soup.select_one('.badge-split-film-genre .badge-content').text.replace(',', ' | ') if soup.select_one('.badge-split-film-genre .badge-content') else ""
    section = soup.select_one('.badge-split-film-section .badge-content').text.replace(',', ' | ') if soup.select_one('.badge-split-film-section .badge-content') else ""
    premiere = soup.select_one('.badge-split-film-premiere .badge-content').text.replace(',', ' | ') if soup.select_one('.badge-split-film-premiere .badge-content') else ""
    director = soup.select_one('.badge-split-director .badge-content').text.replace(',', ' | ') if soup.select_one('.badge-split-director .badge-content') else ""
    image_url = soup.select_one('.er-event-image img')['src'] if soup.select_one('.er-event-image img') else ""

    print("Cleaning up movie data for: " + title)

    hash = {
        'title': title,
        'url': url,
        'category': category,
        'genres': genres,
        'section': section,
        'premiere': premiere,
        'director': director,
        'image_url': image_url,
    }
    movie_hash.append(hash)

def convert_to_csv(data):
    csv_file_name = 'output.csv'

    headers = data[0].keys()

    with open(csv_file_name, mode='w', newline='') as file:
        writer = csv.DictWriter(file, fieldnames=headers)
        
        # Write the headers
        writer.writeheader()
        
        # Write the data rows
        for row in data:
            writer.writerow(row)

    print(f'Data has been written to {csv_file_name}')


with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()

    print("Opening page...")
    page.goto("https://arelia.github.io/arelias-sxsw-film-data-grabber/")

    print("Grabbing movie nodes...")
    movie_nodes = page.query_selector_all('.er-content-container')

    print("Parsing movie nodes...")
    [get_movie_info(movie) for movie in movie_nodes]

    print("Converting to CSV...")
    convert_to_csv(movie_hash)

    print("Done!")
    browser.close();
