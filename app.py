from flask import Flask, render_template, request, jsonify, send_file
import os
from datetime import datetime

app = Flask(__name__)

# Configuration
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key-here')

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