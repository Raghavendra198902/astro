# 🚀 Quick Start: Enterprise Features

## Instant Demo Commands

### 1. Check WebSocket Stats
```bash
curl http://localhost:8000/api/v1/ws/stats
```

Expected response:
```json
{
  "active_users": 0,
  "total_connections": 0,
  "active_rooms": 0,
  "rooms": {}
}
```

### 2. Connect to WebSocket (Browser Console)
```javascript
// Get your JWT token first
const token = "YOUR_JWT_TOKEN";

// Connect to WebSocket
const ws = new WebSocket(`ws://localhost:8000/api/v1/ws?token=${token}`);

ws.onopen = () => {
  console.log("✅ Connected to Astrology Platform");
  
  // Request current transits
  ws.send(JSON.stringify({
    type: "request_transits",
    latitude: 28.6139,
    longitude: 77.2090
  }));
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log("📡 Received:", data);
  
  if (data.type === "transit_update") {
    console.log("🌟 Live Transit Update:", data.planets);
  }
};

// Send heartbeat every 30 seconds
setInterval(() => {
  ws.send(JSON.stringify({ type: "heartbeat" }));
}, 30000);
```

### 3. Create Bulk Chart Job
```bash
# First, get authentication token
TOKEN=$(curl -s -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"your@email.com","password":"yourpassword"}' | jq -r .access_token)

# Create bulk chart generation job
curl -X POST http://localhost:8000/api/v1/batch/bulk-charts \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "id": "chart1",
        "birth_datetime": "1990-01-15T10:30:00",
        "latitude": 28.6139,
        "longitude": 77.2090,
        "system": "vedic"
      },
      {
        "id": "chart2",
        "birth_datetime": "1985-05-20T14:15:00",
        "latitude": 40.7128,
        "longitude": -74.0060,
        "system": "western"
      }
    ],
    "priority": 5
  }'
```

Expected response:
```json
{
  "job_id": "abc-123-def-456",
  "status": "pending",
  "total_items": 2,
  "message": "Bulk chart generation job created"
}
```

### 4. Check Job Status
```bash
JOB_ID="abc-123-def-456"
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/api/v1/batch/jobs/$JOB_ID
```

### 5. Get Analytics Dashboard
```bash
# Get last 30 days statistics
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8000/api/v1/analytics/dashboard?start_date=2025-11-18&end_date=2025-12-18"
```

Expected response:
```json
{
  "period": {
    "start": "2025-11-18T00:00:00",
    "end": "2025-12-18T00:00:00"
  },
  "overview": {
    "total_events": 1250,
    "unique_users": 45,
    "charts_generated": 320,
    "predictions_made": 180,
    "avg_response_time_ms": 125.5,
    "error_count": 3,
    "error_rate_percent": 0.24
  },
  "top_events": [
    {"event_type": "chart_generated", "count": 320},
    {"event_type": "prediction_generated", "count": 180}
  ]
}
```

### 6. Track Custom Event
```bash
curl -X POST http://localhost:8000/api/v1/analytics/track \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "event_type": "premium_feature_used",
    "category": "user_engagement",
    "action": "clicked",
    "label": "advanced_transit_overlay",
    "value": 1.0,
    "properties": {
      "chart_type": "natal",
      "feature": "transit_overlay"
    }
  }'
```

---

## 🎯 Frontend Integration Examples

### React WebSocket Hook
```typescript
import { useEffect, useRef, useState } from 'react';

export function useAstrologyWebSocket(token: string) {
  const [transits, setTransits] = useState<any>(null);
  const [connected, setConnected] = useState(false);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Connect
    ws.current = new WebSocket(`ws://localhost:8000/api/v1/ws?token=${token}`);

    ws.current.onopen = () => {
      setConnected(true);
      console.log('✅ WebSocket connected');
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'transit_update') {
        setTransits(data.planets);
      } else if (data.type === 'connected') {
        console.log('🌟 Features available:', data.features);
      }
    };

    ws.current.onerror = (error) => {
      console.error('❌ WebSocket error:', error);
    };

    ws.current.onclose = () => {
      setConnected(false);
      console.log('👋 WebSocket disconnected');
    };

    // Heartbeat
    const heartbeat = setInterval(() => {
      if (ws.current?.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify({ type: 'heartbeat' }));
      }
    }, 30000);

    // Cleanup
    return () => {
      clearInterval(heartbeat);
      ws.current?.close();
    };
  }, [token]);

  const requestTransits = (lat: number, lon: number) => {
    ws.current?.send(JSON.stringify({
      type: 'request_transits',
      latitude: lat,
      longitude: lon
    }));
  };

  return { transits, connected, requestTransits };
}

// Usage in component
function ChartPage() {
  const { transits, connected, requestTransits } = useAstrologyWebSocket(token);

  useEffect(() => {
    if (connected) {
      requestTransits(28.6139, 77.2090);
    }
  }, [connected]);

  return (
    <div>
      <div>Status: {connected ? '🟢 Live' : '🔴 Disconnected'}</div>
      {transits && (
        <div>
          <h3>Current Transits</h3>
          <pre>{JSON.stringify(transits, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
```

### Batch Processing Component
```typescript
import { useState } from 'react';

function BulkChartGenerator() {
  const [jobId, setJobId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('idle');

  const generateBulkCharts = async (chartData: any[]) => {
    const response = await fetch('/api/v1/batch/bulk-charts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ items: chartData, priority: 5 })
    });

    const result = await response.json();
    setJobId(result.job_id);
    
    // Poll for status
    pollJobStatus(result.job_id);
  };

  const pollJobStatus = async (jobId: string) => {
    const interval = setInterval(async () => {
      const response = await fetch(`/api/v1/batch/jobs/${jobId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const job = await response.json();
      setProgress(job.progress_percent);
      setStatus(job.status);

      if (job.status === 'completed' || job.status === 'failed') {
        clearInterval(interval);
        console.log('Job finished:', job.result_data);
      }
    }, 2000);
  };

  return (
    <div>
      <button onClick={() => generateBulkCharts(myChartData)}>
        Generate Bulk Charts
      </button>
      
      {jobId && (
        <div>
          <p>Job ID: {jobId}</p>
          <p>Status: {status}</p>
          <progress value={progress} max={100} />
          <span>{progress.toFixed(1)}%</span>
        </div>
      )}
    </div>
  );
}
```

---

## 📊 Performance Testing

### Load Test WebSocket Connections
```bash
# Install wscat if needed
npm install -g wscat

# Test connection
wscat -c "ws://localhost:8000/api/v1/ws?token=YOUR_TOKEN"

# Send test message
> {"type": "request_transits", "latitude": 28.6139, "longitude": 77.2090}
```

### Benchmark Chart Generation (with cache)
```bash
# First call (no cache)
time curl -X POST http://localhost:8000/api/v1/charts/generate \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"birth_datetime":"1990-01-15T10:30:00","latitude":28.6139,"longitude":77.2090,"chartType":"natal"}'

# Second call (cached) - should be much faster
time curl -X POST http://localhost:8000/api/v1/charts/generate \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"birth_datetime":"1990-01-15T10:30:00","latitude":28.6139,"longitude":77.2090,"chartType":"natal"}'
```

### Check Cache Hit Rate
```bash
# Connect to Redis
docker-compose exec redis redis-cli

# In Redis CLI:
> INFO stats
> KEYS astro:*
> GET astro:chart:*  # Check cached charts
```

---

## 🎨 UI Enhancement Ideas

### Real-Time Transit Indicator
```typescript
// Display live transit status in navbar
function LiveTransitIndicator() {
  const { connected, transits } = useAstrologyWebSocket(token);

  return (
    <div className="transit-indicator">
      <span className={connected ? 'dot-green' : 'dot-red'} />
      <span>Live Transits</span>
      {transits && (
        <div className="transit-popup">
          {Object.entries(transits).map(([planet, data]: any) => (
            <div key={planet}>
              {planet}: {data.sign} {data.degree}°
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

### Analytics Dashboard Widget
```typescript
function AnalyticsDashboard() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch('/api/v1/analytics/dashboard', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setStats);
  }, []);

  if (!stats) return <div>Loading...</div>;

  return (
    <div className="analytics-grid">
      <StatCard title="Charts Generated" value={stats.overview.charts_generated} />
      <StatCard title="Predictions Made" value={stats.overview.predictions_made} />
      <StatCard title="Avg Response Time" value={`${stats.overview.avg_response_time_ms}ms`} />
      <StatCard title="Active Users" value={stats.overview.unique_users} />
    </div>
  );
}
```

---

## 🔧 Troubleshooting

### WebSocket Not Connecting
```bash
# Check if WebSocket is running
curl http://localhost:8000/api/v1/ws/stats

# Check backend logs
docker-compose logs backend | grep WebSocket

# Verify JWT token is valid
curl -H "Authorization: Bearer $TOKEN" http://localhost:8000/api/v1/users/me
```

### Cache Not Working
```bash
# Check Redis connection
docker-compose exec redis redis-cli ping
# Should return: PONG

# Check cache keys
docker-compose exec redis redis-cli KEYS "astro:*"

# Monitor cache operations
docker-compose exec redis redis-cli MONITOR
```

### Rate Limit Exceeded
```bash
# Check rate limit headers in response
curl -i http://localhost:8000/api/v1/charts/generate

# Look for:
# X-RateLimit-Remaining-Minute: 95
# X-RateLimit-Tier: free

# Upgrade tier in database or wait for reset
```

---

## 🎉 Success Indicators

### Everything Working:
✅ WebSocket stats endpoint returns data  
✅ Backend logs show "Enterprise Features Enabled"  
✅ Redis ping returns PONG  
✅ Cache keys appear in Redis  
✅ Rate limit headers in API responses  
✅ Batch jobs can be created and monitored  
✅ Analytics dashboard returns statistics  

### Performance Benchmarks:
- Cached chart generation: < 500ms
- Cached predictions: < 300ms
- API response time (p50): < 200ms
- WebSocket message latency: < 100ms
- Cache hit rate: > 90%

---

## 📞 Quick Links

- **API Docs:** http://localhost:8000/docs
- **WebSocket Stats:** http://localhost:8000/api/v1/ws/stats
- **Analytics Dashboard:** http://localhost:8000/api/v1/analytics/dashboard
- **Full Documentation:** [ENTERPRISE_FEATURES.md](./ENTERPRISE_FEATURES.md)

---

**🚀 Start building enterprise-grade astrology applications today!**
