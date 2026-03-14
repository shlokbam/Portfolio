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

def _fetch_leetcode(username='shlokbam05'):
    try:
        solved = requests.get(
            f'https://alfa-leetcode-api.0x10.tech/{username}/solved',
            timeout=8
        ).json()
        profile = requests.get(
            f'https://alfa-leetcode-api.0x10.tech/userProfile/{username}',
            timeout=8
        ).json()
        return {
            'total':   solved.get('solvedProblem',  0),
            'easy':    solved.get('easySolved',     0),
            'medium':  solved.get('mediumSolved',   0),
            'hard':    solved.get('hardSolved',     0),
            'ranking': profile.get('ranking',       'N/A'),
        }
    except Exception:
        return None

def _fetch_codeforces(handle='shlokbam'):
    try:
        data = requests.get(
            f'https://codeforces.com/api/user.info?handles={handle}',
            timeout=8
        ).json()
        if data.get('status') != 'OK':
            return None
        u = data['result'][0]
        return {
            'rating':    u.get('rating',    'Unrated'),
            'maxRating': u.get('maxRating', 'N/A'),
            'rank':      u.get('rank',      'N/A').title(),
        }
    except Exception:
        return None

def _fetch_codechef(handle='shlokbam'):
    try:
        data = requests.get(
            f'https://codechef-api.vercel.app/handle/{handle}',
            timeout=8
        ).json()
        return {
            'rating':     data.get('currentRating', data.get('rating',       'N/A')),
            'stars':      data.get('stars',                                   'N/A'),
            'globalRank': data.get('globalRank',    data.get('global_rank',  'N/A')),
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

    # Fetch all three in sequence (Render free tier — avoid thread issues)
    data = {
        'leetcode':   _fetch_leetcode(),
        'codeforces': _fetch_codeforces(),
        'codechef':   _fetch_codechef(),
        'fetched_at': datetime.utcnow().strftime('%Y-%m-%d %H:%M UTC'),
    }

    _stats_cache['data']       = data
    _stats_cache['fetched_at'] = now

    return jsonify({'success': True, 'data': data, 'cached': False})

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
    app.run(host='0.0.0.0', port=port)