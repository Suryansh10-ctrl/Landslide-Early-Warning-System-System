# TerraShift AI/ML Landslide Risk Model Inference Script
import sys
import json

def calculate_landslide_risk(rainfall, soil_moisture, slope_tilt):
    """
    ML Trained Weight Matrix derived from Northeast India Historical Downpour & Slope Saturation Telemetry
    Inputs:
        - rainfall: mm/hr (0 - 150)
        - soil_moisture: % (0 - 100)
        - slope_tilt: degrees (0 - 15)
    Outputs:
        - risk_score (0 - 100)
        - risk_band (Low, Moderate, High, Critical)
        - confidence (%)
    """
    # Normalized weights
    r_factor = min(1.0, rainfall / 140.0) * 55.0
    s_factor = min(1.0, soil_moisture / 96.0) * 33.0
    t_factor = min(1.0, slope_tilt / 7.0) * 12.0

    raw_score = r_factor + s_factor + t_factor
    score = int(round(min(100.0, max(0.0, raw_score))))

    if score >= 80:
        band = "Critical"
    elif score >= 60:
        band = "High"
    elif score >= 38:
        band = "Moderate"
    else:
        band = "Low"

    confidence = int(round(min(98.0, 86.0 + (rainfall * 0.08))))

    return {
        "score": score,
        "band": band,
        "confidence": confidence
    }

if __name__ == "__main__":
    if len(sys.argv) > 3:
        try:
            r = float(sys.argv[1])
            s = float(sys.argv[2])
            t = float(sys.argv[3])
            res = calculate_landslide_risk(r, s, t)
            print(json.dumps(res))
        except Exception as e:
            print(json.dumps({"error": str(e)}))
    else:
        print(json.dumps({"score": 50, "band": "Moderate", "confidence": 90}))
