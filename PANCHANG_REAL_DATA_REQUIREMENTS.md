# Panchang Real Data Integration Requirements

## Current Status

**Chart Detail Page**: ✅ Successfully migrated to real Swiss Ephemeris calculations
- Removed all demo/mock data fallbacks
- Uses `chartsApi.getChart()` for all planetary positions and calculations
- Shows proper error messages instead of falling back to demo data

**Panchang Page**: ⚠️ Still using mock data
- Frontend is ready to integrate with API
- Backend API needs enhancement to return complete data structure

## Why Panchang Still Uses Mock Data

The current Panchang API (`GET /api/v1/charts/panchang`) returns only basic fields:
```typescript
interface Panchang {
  tithi: string;           // Simple string
  nakshatra: string;       // Simple string
  yoga: string;            // Simple string
  karana: string;          // Simple string
  vara: string;            // Day of week
  paksha: string;          // Lunar phase
  sunrise: string;         // Time string
  sunset: string;          // Time string
  moonrise: string;        // Time string
  moonset: string;         // Time string
}
```

But the Panchang UI needs **much more** complex data:
```typescript
interface PanchangData {
  date: string;
  tithi: { 
    name: string; 
    endTime: string;      // When tithi ends
    percent: number;      // Progress percentage
  };
  nakshatra: { 
    name: string; 
    endTime: string;      // When nakshatra ends
    lord: string;         // Ruling planet
  };
  yoga: { 
    name: string; 
    endTime: string;      // When yoga ends
  };
  karana: { 
    name: string; 
    endTime: string;      // When karana ends
  };
  paksha: string;
  sunrise: string;
  sunset: string;
  moonrise: string;
  moonset: string;
  
  // Inauspicious time periods (NOT in current API):
  rahukaal: { start: string; end: string };
  yamaganda: { start: string; end: string };
  gulika: { start: string; end: string };
  
  // Auspicious time period (NOT in current API):
  abhijit: { start: string; end: string };
  
  // Activity lists (NOT in current API):
  auspicious: string[];      // e.g., ["Marriage ceremonies", "New business ventures"]
  inauspicious: string[];    // e.g., ["Surgical procedures", "Travel to south"]
  
  // Festivals (NOT in current API):
  festivals: string[];       // e.g., ["Makar Sankranti", "Uttarayan"]
}
```

## Backend API Enhancements Needed

### 1. Add Detailed Timing Information

**Current**: Returns only `tithi: "Shukla Pratipada"`  
**Needed**: Return object with:
```python
{
  "name": "Shukla Pratipada",
  "endTime": "14:23",           # When this tithi ends
  "percent": 65,                # How far through this tithi (0-100%)
  "deity": "Brahma",            # Optional: ruling deity
  "nature": "auspicious"        # Optional: characterization
}
```

Same structure needed for:
- `nakshatra` (add `lord` field for ruling planet)
- `yoga` (add end time)
- `karana` (add end time)

### 2. Calculate Inauspicious Time Periods

These are critical for users and need to be calculated based on sunrise/sunset:

**Rahukaal** (Rahu Kaal):
- Daily inauspicious period ruled by Rahu
- Calculation varies by day of week
- Example: Sunday = 4:30 PM - 6:00 PM
- Formula: Divide daylight into 8 parts, specific part based on weekday

**Yamaganda**:
- Another inauspicious period
- Different calculation from Rahukaal
- Example: Monday = 10:30 AM - 12:00 PM

**Gulika Kaal**:
- Time period ruled by Saturn's son Gulika
- Inauspicious for new beginnings
- Example: Tuesday = 3:00 PM - 4:30 PM

**Implementation Hint**: These calculations are based on:
```python
daylight_duration = sunset_time - sunrise_time
period_duration = daylight_duration / 8

# Rahukaal by weekday (which 1/8th period):
rahukaal_periods = {
    "Sunday": 8,      # Last period
    "Monday": 2,      # Second period
    "Tuesday": 7,     # Seventh period
    # ... etc
}
```

### 3. Calculate Auspicious Time Period

**Abhijit Muhurat**:
- Most auspicious time of the day
- Always at local noon
- Calculation: Madhyana (midpoint between sunrise and sunset) ± 24 minutes
- Example: If sunrise=6:00 AM, sunset=6:00 PM, noon=12:00 PM
  - Abhijit = 11:36 AM - 12:24 PM

```python
madhyana = sunrise + (sunset - sunrise) / 2
abhijit_start = madhyana - timedelta(minutes=24)
abhijit_end = madhyana + timedelta(minutes=24)
```

### 4. Add Activity Recommendations

**Auspicious Activities** (`auspicious: string[]`):
Based on tithi, nakshatra, yoga, karana, and current planet positions, return suitable activities:
- Marriage ceremonies
- New business ventures
- Property purchase
- Vehicle purchase
- Griha Pravesh (housewarming)
- Starting education
- Medical procedures
- Travel
- Financial transactions
- Spiritual practices

**Inauspicious Activities** (`inauspicious: string[]`):
Activities to avoid on this day:
- Surgical procedures
- Travel to specific directions
- Lending money
- Court proceedings
- Starting construction
- Signing contracts

**Implementation Options**:
1. **Rule-based system**: Create lookup tables mapping combinations to activities
2. **Configuration file**: Load activity mappings from JSON/YAML
3. **Database table**: Store rules in database for easy updates
4. **AI/ML model**: Use LLM to generate recommendations (future enhancement)

### 5. Add Festival Information

**Festivals** (`festivals: string[]`):
Return list of Hindu festivals/observances on the selected date:
- Makar Sankranti
- Uttarayan
- Maha Shivaratri
- Navratri days
- Ekadashi days
- Full moon/New moon observances

**Implementation**:
- Use Hindu calendar library (e.g., `drikpanchang` in Python)
- Create festival lookup table with dates
- Include both fixed solar festivals and movable lunar festivals
- Consider regional variations

## Recommended Backend Changes

### File: `backend/app/services/chart/engine.py`

Add new methods to existing chart service:

```python
class ChartEngine:
    # ... existing methods ...
    
    def calculate_detailed_panchang(
        self,
        date: datetime,
        time: str,
        latitude: float,
        longitude: float
    ) -> dict:
        """
        Calculate complete Panchang with all timing details
        """
        # Calculate basic panchang elements
        basic = self.calculate_basic_panchang(date, time, latitude, longitude)
        
        # Add detailed timing information
        tithi_details = self._get_tithi_details(date, time, latitude, longitude)
        nakshatra_details = self._get_nakshatra_details(date, time, latitude, longitude)
        
        # Calculate inauspicious periods
        sunrise, sunset = self._get_sunrise_sunset(date, latitude, longitude)
        rahukaal = self._calculate_rahukaal(date, sunrise, sunset)
        yamaganda = self._calculate_yamaganda(date, sunrise, sunset)
        gulika = self._calculate_gulika(date, sunrise, sunset)
        
        # Calculate auspicious period
        abhijit = self._calculate_abhijit(sunrise, sunset)
        
        # Get activity recommendations
        auspicious_activities = self._get_auspicious_activities(
            tithi_details, nakshatra_details, basic
        )
        inauspicious_activities = self._get_inauspicious_activities(
            tithi_details, nakshatra_details, basic
        )
        
        # Get festivals
        festivals = self._get_festivals_for_date(date)
        
        return {
            "date": date.isoformat(),
            "tithi": tithi_details,
            "nakshatra": nakshatra_details,
            "yoga": basic["yoga"],
            "karana": basic["karana"],
            "paksha": basic["paksha"],
            "sunrise": sunrise.strftime("%H:%M"),
            "sunset": sunset.strftime("%H:%M"),
            "moonrise": basic["moonrise"],
            "moonset": basic["moonset"],
            "rahukaal": rahukaal,
            "yamaganda": yamaganda,
            "gulika": gulika,
            "abhijit": abhijit,
            "auspicious": auspicious_activities,
            "inauspicious": inauspicious_activities,
            "festivals": festivals
        }
    
    def _calculate_rahukaal(self, date: datetime, sunrise: datetime, sunset: datetime) -> dict:
        """Calculate Rahukaal time period based on weekday"""
        weekday = date.weekday()  # 0=Monday, 6=Sunday
        daylight_duration = sunset - sunrise
        period_duration = daylight_duration / 8
        
        # Rahukaal period mapping (1-indexed)
        rahukaal_periods = {
            6: 8,  # Sunday: 8th period
            0: 2,  # Monday: 2nd period
            1: 7,  # Tuesday: 7th period
            2: 5,  # Wednesday: 5th period
            3: 6,  # Thursday: 6th period
            4: 4,  # Friday: 4th period
            5: 3,  # Saturday: 3rd period
        }
        
        period_num = rahukaal_periods[weekday]
        start_time = sunrise + (period_num - 1) * period_duration
        end_time = start_time + period_duration
        
        return {
            "start": start_time.strftime("%H:%M"),
            "end": end_time.strftime("%H:%M")
        }
    
    def _calculate_abhijit(self, sunrise: datetime, sunset: datetime) -> dict:
        """Calculate Abhijit Muhurat (auspicious noon period)"""
        madhyana = sunrise + (sunset - sunrise) / 2
        abhijit_start = madhyana - timedelta(minutes=24)
        abhijit_end = madhyana + timedelta(minutes=24)
        
        return {
            "start": abhijit_start.strftime("%H:%M"),
            "end": abhijit_end.strftime("%H:%M")
        }
    
    def _get_auspicious_activities(self, tithi: dict, nakshatra: dict, basic: dict) -> list[str]:
        """Determine auspicious activities based on panchang elements"""
        activities = []
        
        # Example logic (needs proper astrological rules)
        if "Pratipada" in tithi.get("name", ""):
            activities.extend(["New business ventures", "Starting education"])
        
        if nakshatra.get("lord") == "Venus":
            activities.extend(["Marriage ceremonies", "Cultural events"])
        
        if basic.get("paksha") == "Shukla Paksha":
            activities.extend(["Property purchase", "Financial investments"])
        
        # Add more sophisticated rules here
        return list(set(activities))  # Remove duplicates
```

### API Endpoint Update

**File**: `backend/app/api/v1/endpoints/charts.py`

Update the Panchang endpoint:

```python
@router.get("/panchang", response_model=schemas.DetailedPanchang)
async def get_detailed_panchang(
    date: str = Query(..., description="Date in YYYY-MM-DD format"),
    time: str = Query(..., description="Time in HH:MM format"),
    latitude: float = Query(..., description="Latitude"),
    longitude: float = Query(..., description="Longitude"),
    chart_engine: ChartEngine = Depends(get_chart_engine)
):
    """
    Get detailed Panchang with all timing information and recommendations
    """
    try:
        date_obj = datetime.strptime(date, "%Y-%m-%d")
        panchang = chart_engine.calculate_detailed_panchang(
            date_obj, time, latitude, longitude
        )
        return panchang
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
```

### Schema Update

**File**: `backend/app/schemas/schemas.py`

```python
class TithiDetails(BaseModel):
    name: str
    endTime: str
    percent: int
    deity: Optional[str] = None
    nature: Optional[str] = None

class NakshatraDetails(BaseModel):
    name: str
    endTime: str
    lord: str
    pada: Optional[int] = None

class TimePeriod(BaseModel):
    start: str
    end: str

class DetailedPanchang(BaseModel):
    date: str
    tithi: TithiDetails
    nakshatra: NakshatraDetails
    yoga: dict
    karana: dict
    paksha: str
    sunrise: str
    sunset: str
    moonrise: str
    moonset: str
    rahukaal: TimePeriod
    yamaganda: TimePeriod
    gulika: TimePeriod
    abhijit: TimePeriod
    auspicious: List[str]
    inauspicious: List[str]
    festivals: List[str]
```

## Frontend Integration Steps (After Backend is Ready)

Once backend API is enhanced:

1. **Update API client** (`frontend/lib/api/charts.ts`):
```typescript
export interface DetailedPanchang {
  date: string;
  tithi: { name: string; endTime: string; percent: number };
  nakshatra: { name: string; endTime: string; lord: string };
  // ... all other fields
  auspicious: string[];
  inauspicious: string[];
  festivals: string[];
}

async getPanchang(
  date: string,
  time: string,
  latitude: number,
  longitude: number
): Promise<DetailedPanchang> {
  const params = new URLSearchParams({
    date,
    time,
    latitude: latitude.toString(),
    longitude: longitude.toString(),
  });
  return this.get(`/charts/panchang?${params}`);
}
```

2. **Update Panchang page** (`frontend/app/dashboard/panchang/page.tsx`):
- Uncomment the `useEffect` API integration code (already present in comments)
- Remove the mock `panchangData` object
- Add loading and error states back
- Test with real data

3. **Add user feedback**:
- Loading spinner while fetching
- Error messages if API fails
- Toast notifications for successful data load
- Retry button on errors

## Testing Checklist

After backend changes:

- [ ] Basic Panchang elements load correctly
- [ ] Tithi shows end time and percentage
- [ ] Nakshatra shows ruling lord
- [ ] Rahukaal calculated correctly for each weekday
- [ ] Yamaganda and Gulika periods present
- [ ] Abhijit muhurat calculated from sunrise/sunset
- [ ] Auspicious activities list populated
- [ ] Inauspicious activities list populated
- [ ] Festivals displayed for festival days
- [ ] Empty states handled gracefully (no festivals = empty array)
- [ ] Date/location changes trigger new calculations
- [ ] Times adjust correctly for different latitudes/longitudes

## Priority

**HIGH** - This is user-visible functionality and affects trust in the application's authenticity.

Users expect real Vedic calculations, not mock data. The chart detail page now uses authentic Swiss Ephemeris calculations, and Panchang should match that quality.

## Estimated Effort

- Backend API enhancement: **3-5 days**
  - Time period calculations: 1 day
  - Activity recommendation system: 1-2 days
  - Festival integration: 1 day
  - Testing and validation: 1 day

- Frontend integration: **4-6 hours**
  - Already scaffolded, just needs mock data removed
  - Add loading/error states
  - Testing

## Resources

Helpful libraries for Panchang calculations:
- **Swiss Ephemeris**: Already used for planetary positions
- **pyswisseph**: Python wrapper for Swiss Ephemeris
- **drikpanchang** (if available): Pre-built Panchang calculations
- Hindu calendar conversion libraries

## Notes

The frontend code is already structured to handle real API data. The mock data is clearly marked with comments:

```typescript
// Mock data for demonstration - TO BE REPLACED WITH REAL API CALL WHEN BACKEND PANCHANG API IS ENHANCED
```

Once backend API returns the enhanced data structure, simply:
1. Remove mock data object
2. Uncomment the useEffect API call
3. Test thoroughly with different dates and locations
