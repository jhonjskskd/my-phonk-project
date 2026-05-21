from flask import Flask, jsonify
import sys
import os

# Ensure Python can look in the root directory for future modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

app = Flask(__name__)

@app.route('/')
@app.route('/api')
def run_pipeline():
    try:
        print("🚀 Vercel Webhook Triggered: Core Engine Online.")
        
        # This is our test data placeholder. We will replace this with real data in the next step!
        sample_database = [
            {
                "instructor_name": "Test Instructor",
                "market_niche": "python programming",
                "pipeline_status": "CORE_ROUTER_ONLINE"
            }
        ]

        return jsonify({
            "status": "success",
            "engine": "Davies_Partner_Udemy_Engine_2026",
            "message": "Base deployment successful! The router is completely live.",
            "data_preview": sample_database
        }), 200

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"Pipeline configuration error: {str(e)}"
        }), 500

if __name__ == '__main__':
    app.run(debug=True)
      
