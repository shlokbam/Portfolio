from flask import Flask, render_template, request, jsonify, send_file
import os
import time
import requests
from datetime import datetime

app = Flask(__name__)

# Configuration
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key-here')

# ── In-memory cache ──────────────────────────────────────────────────────────
_stats_cache = {'data': None, 'fetched_at': 0}
CACHE_TTL = 2 * 60 * 60  # 2 hours in seconds

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (compatible; portfolio-stats/1.0)',
    'Accept': 'application/json',
}

def _fetch_leetcode(username='shlokbam05'):
    """Use LeetCode's own GraphQL endpoint directly — no proxy needed."""
    query = """
    query getUserStats($username: String!) {
      matchedUser(username: $username) {
        username
        profile { ranking }
        submitStatsGlobal {
          acSubmissionNum {
            difficulty
            count
          }
        }
      }
      userContestRanking(username: $username) {
        rating
        globalRanking
      }
    }
    """
    try:
        resp = requests.post(
            'https://leetcode.com/graphql',
            json={'query': query, 'variables': {'username': username}},
            headers={**HEADERS, 'Content-Type': 'application/json',
                     'Referer': 'https://leetcode.com'},
            timeout=10
        )
        data = resp.json()['data']
        user = data['matchedUser']
        stats = {s['difficulty']: s['count']
                 for s in user['submitStatsGlobal']['acSubmissionNum']}
        
        contest = data.get('userContestRanking')
        return {
            'total':   stats.get('All',    0),
            'easy':    stats.get('Easy',   0),
            'medium':  stats.get('Medium', 0),
            'hard':    stats.get('Hard',   0),
            'ranking': user['profile'].get('ranking', 'N/A'),
            'contestRating': round(contest.get('rating', 0)) if contest else 'N/A',
            'contestRanking': contest.get('globalRanking', 'N/A') if contest else 'N/A'
        }
    except Exception:
        return None

# Removed Codeforces fetcher as requested

import re
def _fetch_codechef(handle='shlokbam'):
    """CodeChef direct scraper — fallback since unofficial APIs are unreliable."""
    try:
        url = f'https://www.codechef.com/users/{handle}'
        resp = requests.get(url, headers=HEADERS, timeout=10)
        if resp.status_code != 200:
            return None
        
        html = resp.text
        # Rating - using DOTALL and looking for first occurrence in rating-header
        rating_match = re.search(r'rating-number">[\s\n]*(\d+)[\s\n]*<', html)
        rating = rating_match.group(1) if rating_match else 'N/A'
        
        # Stars - matches both literal ★ and HTML entity &#9733;
        stars_match = re.search(r'rating-star">([\s\S]*?)</div>', html)
        stars = len(re.findall(r'★|&#9733;', stars_match.group(1))) if stars_match else 'N/A'
        
        # Global Rank - look for "Global Rank" following the strong tag
        # Using [\s\S]*? to skip over closing tags like </a>
        rank_match = re.search(r'<strong>\s*(\d+)\s*</strong>[\s\S]*?Global Rank', html)
        rank = rank_match.group(1) if rank_match else 'N/A'
        
        # Highest Rating
        highest_match = re.search(r'\(Highest Rating (\d+)\)', html)
        highest = highest_match.group(1) if highest_match else 'N/A'
        
        return {
            'rating': rating,
            'stars': f'{stars}★' if stars != 'N/A' else 'N/A',
            'globalRank': rank,
            'highestRating': highest
        }
    except Exception:
        return None

@app.route('/api/stats')
def api_stats():
    now = time.time()
    # Return cached data if still fresh
    if _stats_cache['data'] and (now - _stats_cache['fetched_at']) < CACHE_TTL:
        return jsonify({'success': True, 'data': _stats_cache['data'],
                        'cached': True})

    # Fetch LeetCode and CodeChef
    data = {
        'leetcode':   _fetch_leetcode(),
        'codechef':   _fetch_codechef(),
        'fetched_at': datetime.utcnow().strftime('%Y-%m-%d %H:%M UTC'),
    }

    _stats_cache['data']       = data
    _stats_cache['fetched_at'] = now

    return jsonify({'success': True, 'data': data, 'cached': False})

@app.route('/api/stats/debug')
def api_stats_debug():
    """Hit this URL on Render to see raw API responses for debugging."""
    import traceback
    results = {}
    for name, fn in [('leetcode', _fetch_leetcode),
                     ('codechef', _fetch_codechef)]:
        try:
            results[name] = {'data': fn(), 'error': None}
        except Exception as e:
            results[name] = {'data': None, 'error': traceback.format_exc()}
    return jsonify(results)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/contact', methods=['POST'])
def contact():
    try:
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        subject = data.get('subject')
        message = data.get('message')
        
        # Basic validation
        if not all([name, email, subject, message]):
            return jsonify({'success': False, 'message': 'All fields are required'}), 400
        
        # Here you can add code to store the message in a database or file
        # For now, we'll just return success
        return jsonify({
            'success': True, 
            'message': 'Message received! I will get back to you soon.'
        })
            
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/download-resume')
def download_resume():
    try:
        return send_file(
            'static/resume.pdf',
            as_attachment=True,
            download_name='Shlok_Bam_Resume.pdf'
        )
    except Exception as e:
        return jsonify({'success': False, 'message': 'Resume not found'}), 404

@app.route('/certifications/<path:filename>')
def view_certificate(filename):
    try:
        return send_file(
            f'static/certificates/certifications/{filename}',
            mimetype='application/pdf'
        )
    except Exception as e:
        return jsonify({'success': False, 'message': 'Certificate not found'}), 404

@app.route('/hackathons/<path:filename>')
def view_hackathon_certificate(filename):
    try:
        return send_file(
            f'static/certificates/hackathons/{filename}',
            mimetype='application/pdf'
        )
    except Exception as e:
        return jsonify({'success': False, 'message': 'Certificate not found'}), 404

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 10000))
    app.run(host='0.0.0.0', port=port, debug=True)