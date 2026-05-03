import requests

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
}

def check_codechef(handle='shlokbam'):
    url = f'https://www.codechef.com/users/{handle}'
    resp = requests.get(url, headers=HEADERS, timeout=10)
    print(f"Status: {resp.status_code}")
    html = resp.text
    
    # Find rating-star div
    import re
    stars_match = re.search(r'rating-star">([\s\S]*?)</div>', html)
    if stars_match:
        content = stars_match.group(1)
        print(f"Stars content: {content}")
        stars = len(re.findall(r'★', content))
        print(f"Stars count: {stars}")
    else:
        print("Stars match not found")

check_codechef()
