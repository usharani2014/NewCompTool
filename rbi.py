from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup
import pandas as pd
import time
import sys
from datetime import datetime

app = Flask(__name__)
CORS(app)

def rbi_scrape_and_update_data(url):
    try:
        response = requests.get(url)
        response.raise_for_status()
        html = response.content

        soup = BeautifulSoup(html, 'html.parser')

        td_elements = soup.find_all('td', class_="tableheader")
        if len(td_elements) >= 2:
            second_td_element = td_elements[1].get_text(strip=True)

        third_tr = soup.find('tr', class_='tablecontent2')

        if third_tr:
            p_tags = third_tr.find_all('p')

            first_p_content = p_tags[0].get_text(strip=True)
            second_p_content = p_tags[1].get_text(strip=True)
            start = -1
            for ind in range(len(p_tags)):
                if p_tags[ind].get_text(strip=True) in ["Madam/ Dear Sir,", "Madam/Sir,", "Madam / Sir,", "Madam / Dear Sir,", "Dear Sir / Madam", "Madam/Dear Sir,", "Dear Sir / Madam,", "Madam / Dear Sir", "Madam / Dear Sir,", "Madam/ Sir", "Madam / Sir", "Madam/Sir"]:
                    start = ind
                    break
            if start == -1:
                return None
            else:
                actual_data_p_tags = p_tags[start+2:-2]
                actual_data_content = '\n'.join([p.get_text(strip=True) for p in actual_data_p_tags])

                data = [second_td_element, first_p_content, second_p_content, actual_data_content]
                return data
    except Exception as e:
        print(f"Error scraping and updating: {str(e)}")
        raise

def rbi_extract_urls_data(urls):
    data_list = []
    for url in urls:
        data = rbi_scrape_and_update_data(url)
        print(data)
        if data:
            data_list.append(data)
    return data_list

def rbi_scrape_and_update_data_paytm(url):
    try:
        response = requests.get(url)
        response.raise_for_status()
        html = response.content

        soup = BeautifulSoup(html, 'html.parser')

        td_elements = soup.find_all('td', class_="tableheader")
        if len(td_elements) >= 2:
            second_td_element = td_elements[1].get_text(strip=True)

        third_tr = soup.find('tr', class_='tablecontent2')

        if third_tr:
            p_tags = third_tr.find_all('p')

            first_p_content = p_tags[0].get_text(strip=True)
            date = p_tags[1].get_text(strip=True)
            year = date.split(',')
            start = -1
            for ind in range(len(p_tags)):
                if p_tags[ind].get_text(strip=True) in ["Madam/ Dear Sir,", "Madam/Sir,", "Madam / Sir,", "Madam / Dear Sir,", "Dear Sir / Madam", "Madam/Dear Sir,", "Dear Sir / Madam,", "Madam / Dear Sir", "Madam / Dear Sir,", "Madam/ Sir", "Madam / Sir", "Madam/Sir"]:
                    start = ind
                    break
            if start == -1:
                return None
            else:
                actual_data_p_tags = p_tags[start+2:-2]
                actual_data_content = '\n'.join([p.get_text(strip=True) for p in actual_data_p_tags])
                date_object = datetime.strptime(date, "%B %d, %Y")

                formatted_date = date_object.strftime("%Y-%m-%d")

                data = [year[-1].strip(), formatted_date, 'RBI', first_p_content, second_td_element, actual_data_content, url]
                return data
    except Exception as e:
        print(f"Error scraping and updating: {str(e)}")
        raise

def rbi_extract_urls_data_paytm(urls):
    data_list = []
    validator = False
    for url in urls:
        data = rbi_scrape_and_update_data_paytm(url)
        if data:
            data_list.append(data)
        else:
            validator = True
    return data_list, validator

def rbi_extract_urls_scrap(url):
    try:
        page = requests.get(url)
        page.raise_for_status()
    except Exception as e:
        error_type, error_obj, error_info = sys.exc_info()
        print('ERROR FOR LINK')
        print(error_type, 'Line:', error_info.tb_lineno)
        return []
    time.sleep(2)
    soup = BeautifulSoup(page.text, 'html.parser')
    links = soup.find_all('a', class_='link2')
    data = []
    for link in links:
        title = link.text.strip()
        href = link.get('href')
        data.append(href)

    return data

def rbi_extract_urls():
    url = 'https://rbi.org.in/Scripts/NotificationUser.aspx'
    urls = rbi_extract_urls_scrap(url)
    return urls

def sebi_extract_data_from_url(url):
    data = []
    try:
        page = requests.get(url)
        soup = BeautifulSoup(page.text, 'html.parser')
        rows = soup.find_all('tr', class_='odd')
        for row in rows:
            date_td = row.find('td')
            if date_td:
                date = date_td.text.strip()
                link_td = row.find('td').find_next('td')
                if link_td:
                    link_a = link_td.find('a')
                    if link_a:
                        title_content = link_a.text.strip()
                        data.append((title_content, '', date))
    except Exception as e:
        print(f"Error occurred while extracting data: {e}")
    return data

@app.route('/rbi_scrape_and_update', methods=['POST'])
def rbi_scrape_and_update():
    try:
        urls = rbi_extract_urls()
        for i in range(len(urls)):
            urls[i] = "https://rbi.org.in/Scripts/" + urls[i]
        updated_data = rbi_extract_urls_data(urls)
        return jsonify({"message": "Scraping and updating completed successfully", "data": updated_data})
    except Exception as e:
        return jsonify({"error": str(e)})

@app.route('/sebi_scrape_and_update', methods=['POST'])
def sebi_scrape_and_update():
    try:
        url = 'https://www.sebi.gov.in/sebiweb/home/HomeAction.do?doListing=yes&sid=1&ssid=7&smid=0'
        extracted_data = sebi_extract_data_from_url(url)
        return jsonify({"message": "Scraping and updating completed successfully", "data": extracted_data})
    except Exception as e:
        return jsonify({"error": str(e)})

@app.route('/rbi_scrape_and_update/paytm', methods=['POST'])
def rbi_scrape_and_update_paytm():
    try:
        urls = rbi_extract_urls()
        if len(urls) == 0:
            return jsonify({"error": "Extraction Failed , Try again after Sometime"})
        for i in range(len(urls)):
            urls[i] = "https://rbi.org.in/Scripts/" + urls[i]
        updated_data, validator = rbi_extract_urls_data_paytm(urls)
        return jsonify({"message": "Scraping and updating completed successfully", "data": updated_data, "left": validator})
    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == '__main__':
    app.run(debug=True)
