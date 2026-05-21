from flask import Flask, jsonify
import sys
import os

# Instruct Python to search the root directory for our custom script assets
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import from our cleanly named module variable
from a_udemy_collector import UdemyMetricCollector

app = Flask(__name__)

@app.route('/')
@app.route('/api')
def run_pipeline():
    """Executes the core pipeline segments safely inside Vercel's memory layers."""
    try:
        print("🚀 Davies Partner Engine: Initializing Core Live Extractions...")
        
        collector = UdemyMetricCollector()
        db = []
        
        # High-intent niches to pull right away
        target_sectors = [
            "python programming", 
            "real estate marketing", 
            "crypto trading"
        ]
        
        total_scraped_raw = 0
        for sector in target_sectors:
            raw_data = collector.fetch_udemy_pool(sector, page=1)
            db, new_count = collector.process_raw_batch(raw_data, sector, db)
            total_scraped_raw += new_count

        # Structural validation checkpoint
        if not db:
            return jsonify({
                "status": "idle",
                "engine": "Davies_Partner_Udemy_Engine_2026",
                "message": "Marketplace query returned blank. Throttling active to remain stealthy."
            }), 200

        # Output a pristine status dashboard response to your phone browser
        return jsonify({
            "status": "success",
            "engine": "Davies_Partner_Udemy_Engine_2026",
            "pipeline_stage": "STAGE_1_COLLECTION_COMPLETE",
            "metrics": {
                "total_sectors_scanned": len(target_sectors),
                "raw_listings_processed": total_scraped_raw,
                "unique_leads_in_memory": len(db)
            },
            "data_preview": db[:3]  # Previews the first 3 high-intent leads found
        }), 200

    except Exception as e:
        print(f"❌ Core Pipeline Exception: {str(e)}")
        return jsonify({
            "status": "error",
            "engine": "Davies_Partner_Udemy_Engine_2026",
            "error_log": str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True)
            
