import pandas as pd
from flask import Flask, jsonify, request
from flask_cors import CORS
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import uuid 
from datetime import datetime, timedelta
import numpy as np 
import joblib # Import joblib for model persistence
import os # Import os for path checking
from math import radians, sin, cos, sqrt, atan2

app = Flask(__name__)
CORS(app)

# Global variables to store processed data, trained model, and features
processed_data_df = pd.DataFrame()
ml_model = None
model_features = []
MODEL_PATH = 'model.joblib' # Path to save/load the trained model

# Helper function to convert NaN to None for JSON serialization
def convert_nan_to_none(obj):
    if isinstance(obj, dict):
        return {k: convert_nan_to_none(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [convert_nan_to_none(elem) for elem in obj]
    elif pd.isna(obj) or obj == float('inf') or obj == float('-inf'):
        return None
    return obj

# Haversine distance function
def haversine_distance(lat1, lon1, lat2, lon2):
    R = 6371  # Radius of Earth in kilometers

    lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])

    dlon = lon2 - lon1
    dlat = lat2 - lat1

    a = sin(dlat / 2)**2 + cos(lat1) * cos(lat2) * sin(dlon / 2)**2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))

    distance = R * c
    return distance

# List of Northeast Indian states for filtering
NORTHEAST_STATES = [
    "Arunachal Pradesh", "Assam", "Manipur", "Meghalaya", 
    "Mizoram", "Nagaland", "Sikkim", "Tripura"
]

# --- Data Loading, Preprocessing, and Model Training/Loading ---
def load_and_preprocess_data_and_train_model():
    global processed_data_df, ml_model, model_features
    try:
        # Load and preprocess data
        df = pd.read_excel("../final_nhs-wq_pre_2023_compressed.xlsx")
        
        cols_to_fix = ["NO3", "As (ppb)", "Fe (ppm)", "Total Hardness", "pH", "EC (µS/cm at"]
        all_numeric_cols = cols_to_fix + ['Latitude', 'Longitude']

        # Pre-clean Latitude and Longitude columns to remove non-numeric characters (e.g., backticks)
        if 'Latitude' in df.columns:
            df['Latitude'] = df['Latitude'].astype(str).str.replace(r'[^0-9.-]', '', regex=True)
        if 'Longitude' in df.columns:
            df['Longitude'] = df['Longitude'].astype(str).str.replace(r'[^0-9.-]', '', regex=True)

        for col in all_numeric_cols:
            if col in df.columns:
                df[col] = pd.to_numeric(df[col], errors="coerce")
        
        # Fill NaNs in all relevant numeric columns with their median
        df[all_numeric_cols] = df[all_numeric_cols].fillna(df[all_numeric_cols].median())
        
        # Ensure 'Location' is a string type and fill any NaN with a placeholder or None
        df['Location'] = df['Location'].fillna('Unknown Location').astype(str)

        # Filter data for Northeast states only
        df = df[df['State'].isin(NORTHEAST_STATES)]

        def water_quality_label(row):
            if (
                row["NO3"] > 45 or
                row["As (ppb)"] > 10 or
                row["Fe (ppm)"] > 0.3 or
                row["Total Hardness"] > 300 or
                row["pH"] < 6.5 or row["pH"] > 8.5 or
                row["EC (µS/cm at"] > 1500
            ):
                return 1   # Unsafe
            else:
                return 0   # Safe

        df["WaterQuality_Label"] = df.apply(water_quality_label, axis=1)

        def disease_risk_mapping(row):
            risks = []
            if row["NO3"] > 45:
                risks.append("Blue Baby Syndrome (Methemoglobinemia)")
            if row["As (ppb)"] > 10:
                risks.append("Arsenic Poisoning (Skin, Cancer risk)")
            if row["Fe (ppm)"] > 0.3:
                risks.append("Stomach Issues / Teeth Staining")
            if row["Total Hardness"] > 300:
                risks.append("Hair Fall, Kidney Stones")
            if row["pH"] < 6.5 or row["pH"] > 8.5:
                risks.append("Diarrhea, Stomach Irritation")
            if row["EC (µS/cm at"] > 1500:
                risks.append("Hypertension Risk (High Salinity)")
            return ", ".join(risks) if risks else "Safe"

        df["Possible_Diseases"] = df.apply(disease_risk_mapping, axis=1)

        # --- Model Loading/Training ---
        # Prepare data for model training (if needed)
        numeric_cols = df.select_dtypes(include=['float64', 'int64']).columns.tolist()
        if 'WaterQuality_Label' in numeric_cols:
            numeric_cols.remove('WaterQuality_Label')

        X_for_model = df[numeric_cols]
        y_for_model = df["WaterQuality_Label"]
        model_features = X_for_model.columns.tolist()

        if os.path.exists(MODEL_PATH):
            print(f"Loading model from {MODEL_PATH}")
            ml_model = joblib.load(MODEL_PATH)
        else:
            print("Training model...")
            X_train, X_test, y_train, y_test = train_test_split(X_for_model, y_for_model, test_size=0.2, random_state=42)
            model = RandomForestClassifier(random_state=42)
            model.fit(X_train, y_train)
            ml_model = model
            joblib.dump(ml_model, MODEL_PATH)
            print(f"Model trained and saved to {MODEL_PATH}")

        processed_data_df = df

    except Exception as e:
        print(f"Error loading, preprocessing data, or training/loading model: {e}")

# Load data and train model on startup
load_and_preprocess_data_and_train_model()


# --- API Endpoints --- #

@app.route('/api/symptom-reports')
def get_symptom_reports():
    if processed_data_df.empty:
        return jsonify([]), 200

    # Get proximity parameters
    lat = request.args.get('latitude', type=float)
    lon = request.args.get('longitude', type=float)
    radius_km = request.args.get('radius_km', type=float)
    limit = request.args.get('limit', type=int)

    print(f"API /symptom-reports received: lat={lat}, lon={lon}, radius_km={radius_km}, limit={limit}")

    filtered_df = processed_data_df.copy()
    print(f"API /symptom-reports: Rows before proximity filter: {len(filtered_df)}")
    if lat is not None and lon is not None and radius_km is not None:
        filtered_df['distance'] = filtered_df.apply(
            lambda row: haversine_distance(lat, lon, row['Latitude'], row['Longitude']),
            axis=1
        )
        filtered_df = filtered_df[filtered_df['distance'] <= radius_km]
    print(f"API /symptom-reports: Rows after proximity filter: {len(filtered_df)}")

    reports = []
    for index, row in filtered_df.iterrows():
        symptoms_str = row["Possible_Diseases"]
        symptoms_list = [s.strip() for s in symptoms_str.split(',') if s.strip() != "Safe"]
        
        # Generate a realistic reportedAt date based on the 'Year' column
        year = int(row["Year"]) if pd.notna(row["Year"]) else datetime.now().year
        # For simplicity, assign a random month and day within the year
        month = (index % 12) + 1  # Cycle through months
        day = (index % 28) + 1    # Cycle through days
        reported_date = datetime(year, month, day).isoformat()

        report = {
            "id": str(uuid.uuid4()),
            "village": row["Location"], 
            "coordinates": [row["Latitude"], row["Longitude"]],
            "symptoms": symptoms_list,
            "severity": 'severe' if row["WaterQuality_Label"] == 1 else ('moderate' if symptoms_list else 'mild'),
            "reportedAt": reported_date,
            "waterSource": f"{row["Location"]} Well", 
            "reporterAge": None, 
            "reporterGender": None 
        }
        reports.append(convert_nan_to_none(report)) 
    
    # Sort reports by severity (severe > moderate > mild) and then limit
    severity_order = {'severe': 0, 'moderate': 1, 'mild': 2}
    reports.sort(key=lambda x: severity_order.get(x['severity'], 99))

    if limit:
        reports = reports[:limit]
    print(f"API /symptom-reports: Rows after limit: {len(reports)}")

    return jsonify(reports)

@app.route('/api/water-sources')
def get_water_sources():
    if processed_data_df.empty:
        return jsonify([]), 200

    # Get proximity parameters
    lat = request.args.get('latitude', type=float)
    lon = request.args.get('longitude', type=float)
    radius_km = request.args.get('radius_km', type=float)
    limit = request.args.get('limit', type=int)

    print(f"API /water-sources received: lat={lat}, lon={lon}, radius_km={radius_km}, limit={limit}")

    filtered_df = processed_data_df.copy()
    print(f"API /water-sources: Rows before proximity filter: {len(filtered_df)}")
    if lat is not None and lon is not None and radius_km is not None:
        filtered_df['distance'] = filtered_df.apply(
            lambda row: haversine_distance(lat, lon, row['Latitude'], row['Longitude']),
            axis=1
        )
        filtered_df = filtered_df[filtered_df['distance'] <= radius_km]
    print(f"API /water-sources: Rows after proximity filter: {len(filtered_df)}")

    # Aggregate water sources by village
    aggregated_water_sources = {}
    for index, row in filtered_df.iterrows():
        location = row["Location"]
        
        if location not in aggregated_water_sources:
            # Initialize for new village
            aggregated_water_sources[location] = {
                "id": str(uuid.uuid4()), # Generate a unique ID for the aggregated village
                "name": location,
                "type": "aggregated", # Represent as an aggregated type
                "coordinates": [], # Will store all coordinates to average later
                "statuses": [], # Will store all statuses to determine overall status
                "reportCount": 0,
                "lastTested": datetime(1900, 1, 1).isoformat(), # Initialize with a very old date
                "distances": [] # Store distances for averaging
            }

        # Collect coordinates for averaging
        aggregated_water_sources[location]["coordinates"].append([row["Latitude"], row["Longitude"]])
        if 'distance' in row and pd.notna(row['distance']):
            aggregated_water_sources[location]["distances"].append(row["distance"])

        # Collect statuses to determine overall village status
        current_status = 'contaminated' if row["WaterQuality_Label"] == 1 else ('caution' if row["Possible_Diseases"] != "Safe" else 'safe')
        aggregated_water_sources[location]["statuses"].append(current_status)

        # Increment report count for the village based on filtered data
        if row["WaterQuality_Label"] == 1 or row["Possible_Diseases"] != "Safe":
            aggregated_water_sources[location]['reportCount'] += 1
        
        # Update lastTested to the most recent date
        current_test_date = datetime.now() - timedelta(days=index % 30) # Using existing logic for mock date
        if current_test_date.isoformat() > aggregated_water_sources[location]["lastTested"]:
            aggregated_water_sources[location]["lastTested"] = current_test_date.isoformat()


    # Finalize aggregated water sources
    water_sources_list = []
    status_priority = {'contaminated': 0, 'caution': 1, 'safe': 2}

    for location, data in aggregated_water_sources.items():
        # Determine overall status for the village
        overall_status = 'safe'
        if 'contaminated' in data["statuses"]:
            overall_status = 'contaminated'
        elif 'caution' in data["statuses"]:
            overall_status = 'caution'
        
        # Average coordinates
        avg_lat = sum([coord[0] for coord in data["coordinates"]]) / len(data["coordinates"])
        avg_lon = sum([coord[1] for coord in data["coordinates"]]) / len(data["coordinates"])

        avg_distance = sum(data["distances"]) / len(data["distances"]) if data["distances"] else float('inf')

        water_source_entry = {
            "id": data["id"],
            "name": data["name"],
            "type": data["type"],
            "coordinates": [avg_lat, avg_lon],
            "status": overall_status,
            "lastTested": data["lastTested"],
            "reports": [], # Keeping this empty as per existing structure
            "reportCount": data["reportCount"],
            "distance": avg_distance # Add average distance for sorting
        }
        water_sources_list.append(convert_nan_to_none(water_source_entry))

    # Sort aggregated water sources: by distance, then contaminated > caution > safe, then by report count descending, then by name
    water_sources_list.sort(key=lambda x: (x['distance'], status_priority.get(x['status'], 99), -x['reportCount'], x['name'])) 

    if limit:
        water_sources_list = water_sources_list[:limit]
    print(f"API /water-sources: Rows after limit: {len(water_sources_list)}")

    return jsonify(water_sources_list)

@app.route('/api/alerts')
def get_alerts():
    if processed_data_df.empty:
        return jsonify([]), 200
    
    # Get proximity parameters
    lat = request.args.get('latitude', type=float)
    lon = request.args.get('longitude', type=float)
    radius_km = request.args.get('radius_km', type=float)
    limit = request.args.get('limit', type=int)

    print(f"API /alerts received: lat={lat}, lon={lon}, radius_km={radius_km}, limit={limit}")

    filtered_df = processed_data_df.copy()
    print(f"API /alerts: Rows before proximity filter: {len(filtered_df)}")
    if lat is not None and lon is not None and radius_km is not None:
        filtered_df['distance'] = filtered_df.apply(
            lambda row: haversine_distance(lat, lon, row['Latitude'], row['Longitude']),
            axis=1
        )
        filtered_df = filtered_df[filtered_df['distance'] <= radius_km]
    print(f"API /alerts: Rows after proximity filter: {len(filtered_df)}")

    # Group alerts by village and consolidate
    aggregated_alerts = {}
    for index, row in filtered_df.iterrows():
        village = row["Location"]
        level = 'high' if row["WaterQuality_Label"] == 1 else ('medium' if row["Possible_Diseases"] != "Safe" else 'low')
        timestamp = datetime.now()

        if village not in aggregated_alerts:
            aggregated_alerts[village] = {
                "id": str(uuid.uuid4()),
                "village": village,
                "level": level,
                "trigger": [],
                "description": [],
                "timestamp": timestamp,
                "status": 'active',
                "reportCount": 0,
                "distances": [] # Store distances for averaging
            }
        
        # Update level if a higher level alert is found for this village
        level_order = {'high': 0, 'medium': 1, 'low': 2}
        if level_order.get(level, 99) < level_order.get(aggregated_alerts[village]['level'], 99):
            aggregated_alerts[village]['level'] = level
        
        # Consolidate triggers and descriptions
        trigger_desc = f"Contaminated Water Detected" if row["WaterQuality_Label"] == 1 else "Potential Health Risk"
        description_detail = f"Unsafe water quality detected in {village}. Possible diseases: {row["Possible_Diseases"]}" \
                             if row["WaterQuality_Label"] == 1 else f"Some health risks identified in {village}. Possible diseases: {row["Possible_Diseases"]}"

        if trigger_desc not in aggregated_alerts[village]['trigger']:
            aggregated_alerts[village]['trigger'].append(trigger_desc)
        if description_detail not in aggregated_alerts[village]['description']:
            aggregated_alerts[village]['description'].append(description_detail)

        aggregated_alerts[village]['reportCount'] += 1 # Increment report count for the village
        # Update timestamp to the most recent if multiple alerts for same village
        if timestamp > aggregated_alerts[village]['timestamp']:
            aggregated_alerts[village]['timestamp'] = timestamp

        if 'distance' in row and pd.notna(row['distance']):
            aggregated_alerts[village]["distances"].append(row["distance"])

    # Convert triggers and descriptions lists to strings
    for village_alert in aggregated_alerts.values():
        village_alert['trigger'] = "; ".join(village_alert['trigger'])
        village_alert['description'] = "; ".join(village_alert['description'])
        village_alert['timestamp'] = village_alert['timestamp'].isoformat()
        village_alert['distance'] = sum(village_alert["distances"]) / len(village_alert["distances"]) if village_alert["distances"] else float('inf')

    alerts_list = list(aggregated_alerts.values())

    # Sort alerts: by distance, then high > medium > low, then by report count descending, then by village name
    level_order = {'high': 0, 'medium': 1, 'low': 2}
    alerts_list.sort(key=lambda x: (x['distance'], level_order.get(x['level'], 99), -x['reportCount'], x['village']))

    if limit:
        alerts_list = alerts_list[:limit]
    print(f"API /alerts: Rows after limit: {len(alerts_list)}")

    return jsonify(convert_nan_to_none(alerts_list))

@app.route('/api/dashboard-summary')
def get_dashboard_summary():
    if processed_data_df.empty:
        return jsonify({}), 200
    
    total_reports_today = 0 # Need to define "today" from data. For now, total processed.
    active_alerts = 0
    high_risk_villages = 0
    new_reports_24h = 0 # Similar to total_reports_today, needs time-based data

    # Example aggregation
    total_reports = len(processed_data_df)
    active_alerts = len([row for idx, row in processed_data_df.iterrows() if row["WaterQuality_Label"] == 1])
    high_risk_villages = processed_data_df[processed_data_df["WaterQuality_Label"] == 1]["Location"].nunique()
    # For new_reports_24h, we need a 'reportedAt' column in the source data or simulation
    # For now, let's just make it a subset of total_reports as a placeholder
    new_reports_24h = int(total_reports * 0.1)

    summary = {
        "totalReportsToday": total_reports,
        "activeAlerts": active_alerts,
        "highRiskVillages": high_risk_villages,
        "newReports24h": new_reports_24h
    }
    return jsonify(convert_nan_to_none(summary))

@app.route('/api/chart-data')
def get_chart_data():
    if processed_data_df.empty:
        return jsonify({}), 200
    
    # Symptoms breakdown
    all_symptoms = []
    for symptoms_str in processed_data_df["Possible_Diseases"]:
        symptoms_list = [s.strip() for s in symptoms_str.split(',') if s.strip() != "Safe"]
        all_symptoms.extend(symptoms_list)
    
    symptom_counts = pd.Series(all_symptoms).value_counts().reset_index()
    symptom_counts.columns = ['name', 'count']
    symptoms_chart = symptom_counts.to_dict(orient='records')

    # Timeline data (reports over time)
    timeline_data = []
    if not processed_data_df.empty and "Year" in processed_data_df.columns:
        # Generate a 'Month-Year' column for more granular aggregation
        temp_df = processed_data_df.copy()
        temp_df['Year'] = pd.to_numeric(temp_df['Year'], errors='coerce').fillna(datetime.now().year).astype(int)
        
        # Create a 'reportedAt' like series for more granular grouping
        temp_df['date_for_timeline'] = temp_df.apply(lambda row: datetime(int(row['Year']), (row.name % 12) + 1, 1), axis=1)
        
        reports_by_month = temp_df.groupby(pd.Grouper(key='date_for_timeline', freq='ME')).size().reset_index(name='reports')
        reports_by_month.columns = ['date', 'reports']
        reports_by_month['date'] = reports_by_month['date'].dt.strftime('%Y-%m')
        
        # Generate more realistic (mock) rainfall data that broadly correlates with reports
        rainfall_scale_factor = 10 
        reports_by_month['rainfall'] = reports_by_month['reports'].apply(lambda x: x * np.random.uniform(0.8, 1.2) * rainfall_scale_factor + np.random.uniform(50, 200))
        reports_by_month['rainfall'] = reports_by_month['rainfall'].round(2)

        timeline_data = reports_by_month.to_dict(orient='records')
        
    chart_data = {
        "symptoms": symptoms_chart,
        "timeline": timeline_data
    }
    return jsonify(convert_nan_to_none(chart_data))


@app.route('/predict', methods=['POST'])
def predict():
    if ml_model is None or processed_data_df.empty:
        return jsonify(error="Model not loaded or data not processed"), 500

    data = request.get_json()
    if not data:
        return jsonify(error="No input data provided"), 400

    # Create a DataFrame for prediction, ensuring column order matches training data
    input_df = pd.DataFrame([data])
    # Ensure all model features are present, fill missing with median from original data
    for feature in model_features:
        if feature not in input_df.columns:
            input_df[feature] = processed_data_df[feature].median()

    input_for_prediction = input_df[model_features]

    prediction = ml_model.predict(input_for_prediction)[0]
    # Convert numpy int64 to standard int for JSON serialization
    water_quality_label = int(prediction)
    
    # Derive possible diseases based on input data using the existing function
    # This assumes input_df has all the necessary columns for disease_risk_mapping
    # We need to ensure input_df has the right columns or pass only relevant ones
    
    # For disease risk mapping, we need specific columns. Let's create a row-like object
    # from the input data to pass to disease_risk_mapping
    input_row_for_diseases = {}
    for col in ["NO3", "As (ppb)", "Fe (ppm)", "Total Hardness", "pH", "EC (µS/cm at"]:
        input_row_for_diseases[col] = input_df[col].iloc[0] if col in input_df.columns else processed_data_df[col].median()

    # Call the disease_risk_mapping function with the input_row_for_diseases
    possible_diseases = disease_risk_mapping(input_row_for_diseases)

    return jsonify(convert_nan_to_none({
        "WaterQuality_Label": water_quality_label,
        "Possible_Diseases": possible_diseases
    }))


@app.route('/api/send-alert', methods=['POST'])
def send_alert():
    """
    Send a custom alert message via WhatsApp to configured recipients.
    """
    try:
        data = request.get_json()
        message = data.get('message', '')
        
        if not message:
            return jsonify({'error': 'Message is required'}), 400
        
        # Import the alert system
        import sys
        import os
        
        # Add trigger directory to path
        trigger_path = os.path.join(os.path.dirname(__file__), '..', 'trigger')
        if trigger_path not in sys.path:
            sys.path.append(trigger_path)
        
        try:
            from telegram_alert import send_custom_telegram_message
        except ImportError as e:
            print(f"Import error: {e}")
            return jsonify({'error': f'Failed to import alert modules: {str(e)}'}), 500
        
        # Send message via Telegram
        print(f"Attempting to send alert via Telegram")
        
        try:
            telegram_success = send_custom_telegram_message(message)
            if telegram_success:
                print("Successfully sent Telegram message")
                return jsonify({
                    'success': True,
                    'message': 'Alert sent successfully via Telegram',
                    'method': 'telegram'
                })
            else:
                return jsonify({
                    'success': False,
                    'message': 'Failed to send alert via Telegram',
                    'error': 'Telegram API failed'
                }), 500
        except Exception as e:
            error_msg = f"Error sending Telegram: {str(e)}"
            print(error_msg)
            return jsonify({
                'success': False,
                'message': 'Failed to send alert',
                'error': error_msg
            }), 500
        
    except Exception as e:
        print(f"Error in send_alert endpoint: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': f'Failed to send alert: {str(e)}'}), 500

@app.route('/api/test-whatsapp')
def test_whatsapp():
    """
    Test endpoint to check if WhatsApp API is working.
    """
    try:
        # Import the alert system
        import sys
        import os
        
        # Add trigger directory to path
        trigger_path = os.path.join(os.path.dirname(__file__), '..', 'trigger')
        if trigger_path not in sys.path:
            sys.path.append(trigger_path)
        
        from whatsapp_alert import send_whatsapp_message
        from database import fetch_all_phone_numbers
        
        # Get recipient numbers
        phone_numbers = fetch_all_phone_numbers()
        
        if not phone_numbers:
            return jsonify({'error': 'No phone numbers configured'}), 500
        
        # Test with a simple message
        test_message = "Test message from Jalrakshak system"
        test_number = phone_numbers[0]
        
        print(f"Testing WhatsApp API with number: {test_number}")
        result = send_whatsapp_message(test_number, test_message)
        
        return jsonify({
            'success': result,
            'message': f'WhatsApp test {"succeeded" if result else "failed"}',
            'test_number': test_number,
            'test_message': test_message
        })
        
    except Exception as e:
        print(f"Error testing WhatsApp: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': f'WhatsApp test failed: {str(e)}'}), 500

@app.route('/')
def hello_world():
    return jsonify(message="Hello from Flask Backend!")

if __name__ == '__main__':
    app.run(debug=True)
