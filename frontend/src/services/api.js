// TerraShift Frontend API Service Layer

const API_BASE = 'http://localhost:3000/api/v1';

export async function fetchHealthStatus() {
  try {
    const res = await fetch(`${API_BASE}/health`);
    return await res.json();
  } catch (err) {
    console.warn('Backend API unreachable, operating in frontend simulation mode:', err.message);
    return { status: 'offline', mongoDB: 'Disconnected' };
  }
}

export async function sendSensorTelemetry(data) {
  try {
    const res = await fetch(`${API_BASE}/telemetry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (err) {
    console.warn('Error sending telemetry to backend API:', err.message);
    return null;
  }
}

export async function fetchLatestTelemetry() {
  try {
    const res = await fetch(`${API_BASE}/telemetry/latest`);
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function fetchMonitoringZones() {
  try {
    const res = await fetch(`${API_BASE}/zones`);
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function fetchAlertLogs() {
  try {
    const res = await fetch(`${API_BASE}/alerts`);
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function postAlertLog(alertData) {
  try {
    const res = await fetch(`${API_BASE}/alerts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(alertData),
    });
    return await res.json();
  } catch (err) {
    return null;
  }
}
