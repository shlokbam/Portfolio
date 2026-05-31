from flask import Flask, render_template, request, jsonify, send_file
import os
import time
import requests
from datetime import datetime

# Load environment variables from .env if present
if os.path.exists('.env'):
    with open('.env') as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                key, val = line.split('=', 1)
                os.environ[key.strip()] = val.strip()

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
    """Fetch LeetCode stats and contest rating history using consolidated GraphQL."""
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
      userContestRankingHistory(username: $username) {
        attended
        rating
        contest {
          title
        }
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
        history_raw = data.get('userContestRankingHistory', [])
        
        # Filter and parse rating history for attended contests
        history = [round(h['rating']) for h in history_raw if h.get('attended')]
        
        return {
            'total':   stats.get('All',    0),
            'easy':    stats.get('Easy',   0),
            'medium':  stats.get('Medium', 0),
            'hard':    stats.get('Hard',   0),
            'ranking': user['profile'].get('ranking', 'N/A'),
            'contestRating': round(contest.get('rating', 0)) if contest else 'N/A',
            'contestRanking': contest.get('globalRanking', 'N/A') if contest else 'N/A',
            'ratingHistory': history
        }
    except Exception:
        return None

# Removed Codeforces fetcher as requested

import re
def _fetch_codechef(handle='shlokbam'):
    """CodeChef direct scraper — fetches user statistics and embedded rating history JSON."""
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
        rank_match = re.search(r'<strong>\s*(\d+)\s*</strong>[\s\S]*?Global Rank', html)
        rank = rank_match.group(1) if rank_match else 'N/A'
        
        # Highest Rating
        highest_match = re.search(r'\(Highest Rating (\d+)\)', html)
        highest = highest_match.group(1) if highest_match else 'N/A'
        
        # Parse embedded ratings Highcharts JSON array
        history = []
        history_match = re.search(r'var all_rating\s*=\s*(.*?);', html)
        if history_match:
            try:
                import json
                ratings = json.loads(history_match.group(1))
                history = [int(r.get('rating', 0)) for r in ratings]
            except Exception:
                pass
        
        return {
            'rating': rating,
            'stars': f'{stars}★' if stars != 'N/A' else 'N/A',
            'globalRank': rank,
            'highestRating': highest,
            'ratingHistory': history
        }
    except Exception:
        return None

def _fetch_github(username='shlokbam'):
    """Fetch GitHub stats and extract the last 15 days of daily contribution history."""
    try:
        # Repos & Followers from API
        api_resp = requests.get(f'https://api.github.com/users/{username}', headers=HEADERS, timeout=10)
        user_data = api_resp.json()
        
        # Contributions scraping
        cont_resp = requests.get(f'https://github.com/users/{username}/contributions', 
                                 headers={'User-Agent': HEADERS['User-Agent']}, timeout=10)
        html = cont_resp.text
        cont_match = re.search(r'([0-9,]+)\s+contributions', html)
        contributions = cont_match.group(1) if cont_match else '—'
        
        # Parse contribution numbers from tooltips
        matches = re.findall(r'(\d+|No)\s+contributions?\s+on\s+[A-Za-z]+\s+\d+', html)
        history = []
        for val in matches:
            if val == 'No':
                history.append(0)
            else:
                history.append(int(val))
                
        # Slice the last 15 days
        recent_history = history[-15:] if len(history) >= 15 else history
        
        return {
            'repos': user_data.get('public_repos', '—'),
            'followers': user_data.get('followers', '—'),
            'contributions': contributions,
            'contributionHistory': recent_history
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

    # Fetch all stats
    data = {
        'leetcode':   _fetch_leetcode(),
        'codechef':   _fetch_codechef(),
        'github':     _fetch_github(),
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

import json

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
        
        # 1. Log message to local JSON database on server
        message_log = {
            'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'name': name,
            'email': email,
            'subject': subject,
            'message': message,
            'ip': request.remote_addr
        }
        
        log_file = 'messages.json'
        messages = []
        if os.path.exists(log_file):
            try:
                with open(log_file, 'r') as f:
                    messages = json.load(f)
            except Exception:
                messages = []
        messages.append(message_log)
        with open(log_file, 'w') as f:
            json.dump(messages, f, indent=4)
            
        # 2. Forward to Shlok's email via Web3Forms (Secure Server-side)
        access_key = os.environ.get('WEB3FORMS_ACCESS_KEY')
        if access_key:
            payload = {
                'access_key': access_key,
                'name': name,
                'email': email,
                'subject': f"Portfolio Contact: {subject}",
                'message': f"You received a new message from your portfolio contact form:\n\n"
                           f"Name: {name}\n"
                           f"Email: {email}\n"
                           f"Subject: {subject}\n\n"
                           f"Message:\n{message}"
            }
            try:
                requests.post('https://api.web3forms.com/submit', json=payload, timeout=8)
            except Exception as e:
                print(f"Email forwarding error: {e}")
        
        return jsonify({
            'success': True, 
            'message': 'Message received successfully! I will get back to you soon.'
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

@app.route('/api/availability')
def check_availability():
    """Concurrently checks live project URLs and returns their online/offline state."""
    urls = [
        "https://multi-agent-ai-research-system-six.vercel.app/",
        "https://mock-vue.vercel.app/",
        "https://generativeai-rag.streamlit.app/",
        "https://genetic-algorithm-multi-constraint.onrender.com/",
        "https://predictive-maintenance-hx97.onrender.com/",
        "https://ims-frontend-udaw.onrender.com/login"
    ]
    import concurrent.futures
    
    def check_url(url):
        try:
            # Send a HEAD request first (efficient)
            resp = requests.head(url, headers=HEADERS, timeout=4)
            # If status code is 405 (Method Not Allowed) or other failure, fallback to GET
            if resp.status_code >= 400:
                resp = requests.get(url, headers=HEADERS, timeout=4)
            # A status code < 500 implies the host is active and responding
            return url, resp.status_code < 500
        except Exception:
            return url, False

    results = {}
    with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
        future_to_url = {executor.submit(check_url, url): url for url in urls}
        for future in concurrent.futures.as_completed(future_to_url):
            url = future_to_url[future]
            try:
                url, status = future.result()
                results[url] = "online" if status else "offline"
            except Exception:
                results[url] = "offline"
                
    return jsonify({'success': True, 'statuses': results})

_chat_stats = {'questions_answered': 247}

@app.route('/api/chat/stats', methods=['GET'])
def chat_stats():
    """Returns the total number of chat questions answered."""
    return jsonify({'success': True, 'count': _chat_stats['questions_answered']})

@app.route('/api/chat', methods=['POST'])
def chat():
    """Handles chatbot conversations powered by Groq Llama-3."""
    data = request.json or {}
    user_message = data.get('message', '').strip()
    if not user_message:
        return jsonify({'success': False, 'message': 'Message is empty'}), 400

    api_key = os.environ.get('GROQ_API_KEY')
    if not api_key:
        return jsonify({
            'success': True,
            'reply': "I'm sorry, my API key is currently not configured. Please contact Shlok directly at shlokbam19103@gmail.com!"
        })

    system_prompt = (
        "CRITICAL RULE: You are Shlok Bam's AI Portfolio Assistant. You MUST ONLY answer questions directly about Shlok Bam, his career, VIT Pune education, projects, skills, and portfolio. "
        "Under NO circumstances are you allowed to write general programming code, solve math equations, explain general computer science algorithms (unless directly related to Shlok's projects), write essays, or perform any general assistant tasks. "
        "If a user asks you to write code (e.g., 'Write a python script to check if a string is a palindrome', 'Write a function for...', 'Solve this coding problem...'), you MUST absolutely decline and state: 'I am only programmed to assist with questions about Shlok Bam\'s career, experience, and portfolio. I cannot write code or solve general programming problems for you. However, I can tell you about Shlok\'s amazing RAG PDF project or other engineering work!'\n\n"
        "You are Shlok Bam's AI Portfolio Assistant, a highly professional, polite, and enthusiastic representative. "
        "Your goal is to answer recruiters and visitors about Shlok's career, education, projects, skills, and leadership. "
        "Keep your answers professional, concise, and structured (use bullet points where appropriate).\n\n"
        "Here are Shlok's details:\n"
        "- Name: Shlok Bam\n"
        "- Role: Information Technology Student, Programmer, and Full-Stack Developer\n"
        "- Contact: Email: shlokbam19103@gmail.com | Phone: +91-7974670370 | GitHub: https://github.com/shlokbam | LinkedIn: https://www.linkedin.com/in/shlokbam/\n"
        "- Location: Pune, India\n\n"
        "EDUCATION:\n"
        "- Vishwakarma Institute of Technology (VIT), Pune: Bachelor of Technology (B.Tech) in Information Technology (IT) (2023 - Present)\n"
        "- Academic Score: 8.97 CGPA (up to 5th Semester)\n"
        "- High School: Primary & Secondary Education completed (2010 - 2022) with a strong foundation in math and science.\n\n"
        "LEADERSHIP & EXPERIENCE:\n"
        "- PharmaACE Innovations LLP - Incoming Analytics Intern (June 2026 - July 2026): Selected for a 2-month Analytics Internship in Hinjewadi, Pune, focusing on business intelligence and data modeling.\n"
        "- ITSA (Information Technology Students Association) - Founding Chairperson (2024 - Present): Led tech committees, hosted AI tool sessions, anchored Edge'24 technical flagship event, mentored 100+ first-year students in soft skills, public speaking, and tech.\n"
        "- abhivriddhi Management Head & EDGE'24 Event Anchor: Hosting and stage coordination for flagship events.\n\n"
        "KEY SKILLS:\n"
        "- Programming Languages: Python, JavaScript, HTML, CSS, C++\n"
        "- Web Frameworks & Libraries: Flask, React, Vue.js, TailwindCSS\n"
        "- AI & Machine Learning: Generative AI, LangChain, RAG (Retrieval-Augmented Generation), LLMs, Vector DBs, Gemini API, Computer Vision, OpenCV\n"
        "- Cloud & DevOps: Docker, CI/CD pipelines, Git, Cloud integration, Linux\n\n"
        "17+ KEY PROJECTS:\n"
        "1. Eagle LMS (Industry Sponsored): Enterprise-grade Learning Management System featuring a FastAPI backend, dual-role React dashboards, and a premium React Native mobile app with secure watermarking. Code: https://github.com/shlokbam/lms\n"
        "2. Multi-Agent AI Research System: Sophisticated collaborative AI research platform driven by specialized CrewAI/LangChain agents. Deployed at: https://multi-agent-ai-research-system-six.vercel.app/ | Code: https://github.com/shlokbam/Multi_Agent_AI_Research_System\n"
        "3. Generative AI RAG PDF Hub: A full Generative AI RAG pipeline where recruiters can upload PDFs and ask questions. Deployed at: https://generativeai-rag.streamlit.app/\n"
        "4. AI Surveillance Poaching Detection: AI surveillance system using Computer Vision to detect poachers and send instant email alerts.\n"
        "5. AI-powered Mock Interview Platform: Interactive portal automating job interview questions and scoring using Vue/React.\n"
        "6. Full DevOps CI/CD Pipeline: Complete automated DevOps pipeline built from scratch to deploy high-availability apps.\n"
        "7. Predictive Maintenance App (HX97): Uses ML/AI models to predict machinery failures before they happen. Deployed at: https://predictive-maintenance-hx97.onrender.com/\n"
        "8. Multi-Constraint Genetic Algorithm: Specialized constraint solver using evolutionary computation. Deployed at: https://genetic-algorithm-multi-constraint.onrender.com/\n"
        "9. Inventory Management System: Fully-featured responsive store inventory database system. Deployed at: https://ims-frontend-udaw.onrender.com/login\n\n"
        "RULES FOR THE CHATBOT:\n"
        "1. Be extremely helpful and positive about Shlok's qualities (quick learner, proactive leader, great communicator).\n"
        "2. If asked about contact info, provide his email (shlokbam19103@gmail.com) and phone (+91-7974670370) clearly.\n"
        "3. Only answer questions related to Shlok's resume, academic record, projects, skills, and portfolio. If someone asks unrelated questions (e.g. 'How do I cook pasta?' or 'Write a python script to reverse a string' or 'Write a palindrome function'), politely decline: 'I am only programmed to assist with questions about Shlok Bam\'s career, experience, and portfolio. I cannot write code or solve general programming problems for you. However, I can tell you about Shlok\'s amazing RAG PDF project or other engineering work!' and direct them back to Shlok's work."
    )

    try:
        url = "https://api.groq.com/openai/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": "llama-3.1-8b-instant",
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ],
            "temperature": 0.5,
            "max_tokens": 800
        }
        resp = requests.post(url, json=payload, headers=headers, timeout=10)
        resp_data = resp.json()
        _chat_stats['questions_answered'] += 1
        reply = resp_data['choices'][0]['message']['content'].strip()
        return jsonify({'success': True, 'reply': reply, 'count': _chat_stats['questions_answered']})
    except Exception as e:
        return jsonify({
            'success': False,
            'reply': "I'm sorry, I ran into a small error trying to connect to the brain. Please try asking again in a moment, or reach out to Shlok directly!"
        }), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 10000))
    # Loaded environment variables and starting the Flask development server
    app.run(host='0.0.0.0', port=port, debug=True)