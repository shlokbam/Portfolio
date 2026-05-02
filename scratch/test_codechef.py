import requests
import re

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (compatible; portfolio-stats/1.0)',
    'Accept': 'application/json',
}

def test_fetch_codechef(handle='shlokbam'):
    url = f'https://www.codechef.com/users/{handle}'
    print(f"Fetching {url}...")
    resp = requests.get(url, headers=HEADERS, timeout=10)
    print(f"Status Code: {resp.status_code}")
    if resp.status_code != 200:
        return None
    
    html = resp.text
    # Save a snippet of the stars area for inspection
    stars_area = re.search(r'rating-star">([\s\S]*?)</div>', html)
    if stars_area:
        print(f"Stars HTML snippet: {stars_area.group(1)}")
        stars = len(re.findall(r'★', stars_area.group(1)))
        print(f"Stars found: {stars}")
    else:
        print("Stars area not found in HTML.")

    rating_match = re.search(r'rating-number">[\s\n]*(\d+)[\s\n]*<', html)
    print(f"Rating found: {rating_match.group(1) if rating_match else 'N/A'}")

test_fetch_codechef()
