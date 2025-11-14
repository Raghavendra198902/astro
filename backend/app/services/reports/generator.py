"""
PDF Report Generator
Creates beautiful PDF reports using WeasyPrint
"""

from typing import Dict, Any, Optional
import logging
from datetime import datetime
from pathlib import Path
from jinja2 import Template

logger = logging.getLogger(__name__)


class ReportGenerator:
    """Generate PDF reports from chart data"""
    
    def __init__(self):
        try:
            from weasyprint import HTML, CSS
            self.HTML = HTML
            self.CSS = CSS
            self.available = True
        except ImportError:
            logger.error("WeasyPrint not installed")
            self.available = False
        
        # Load templates
        self.templates_dir = Path(__file__).parent / "templates"
        self.templates_dir.mkdir(exist_ok=True)
    
    async def generate_natal_report(
        self,
        chart_data: Dict[str, Any],
        interpretation: Dict[str, Any],
        profile: Dict[str, Any],
        theme: str = "classic"
    ) -> bytes:
        """
        Generate natal chart PDF report
        
        Args:
            chart_data: Complete chart data
            interpretation: AI interpretation
            profile: User profile data
            theme: Report theme (classic/minimal/festival)
            
        Returns:
            PDF bytes
        """
        if not self.available:
            raise RuntimeError("WeasyPrint not available")
        
        # Load template
        template_html = self._get_template(f"natal_{theme}")
        
        # Prepare data
        context = {
            "title": "Natal Chart Report",
            "generated_date": datetime.now().strftime("%B %d, %Y"),
            "profile": profile,
            "chart": chart_data,
            "interpretation": interpretation,
            "theme": theme
        }
        
        # Render HTML
        html_content = template_html.render(**context)
        
        # Convert to PDF
        pdf_bytes = self.HTML(string=html_content).write_pdf()
        
        logger.info(f"Generated natal report ({theme} theme)")
        return pdf_bytes
    
    async def generate_compatibility_report(
        self,
        person_a: Dict[str, Any],
        person_b: Dict[str, Any],
        analysis: Dict[str, Any],
        theme: str = "classic"
    ) -> bytes:
        """Generate compatibility report PDF"""
        
        if not self.available:
            raise RuntimeError("WeasyPrint not available")
        
        template_html = self._get_template(f"compatibility_{theme}")
        
        context = {
            "title": "Compatibility Report",
            "generated_date": datetime.now().strftime("%B %d, %Y"),
            "person_a": person_a,
            "person_b": person_b,
            "analysis": analysis,
            "theme": theme
        }
        
        html_content = template_html.render(**context)
        pdf_bytes = self.HTML(string=html_content).write_pdf()
        
        logger.info("Generated compatibility report")
        return pdf_bytes
    
    async def generate_transit_report(
        self,
        natal_chart: Dict[str, Any],
        transits: Dict[str, Any],
        period: str,
        theme: str = "classic"
    ) -> bytes:
        """Generate transit forecast report"""
        
        if not self.available:
            raise RuntimeError("WeasyPrint not available")
        
        template_html = self._get_template(f"transit_{theme}")
        
        context = {
            "title": f"Transit Forecast - {period}",
            "generated_date": datetime.now().strftime("%B %d, %Y"),
            "natal_chart": natal_chart,
            "transits": transits,
            "period": period,
            "theme": theme
        }
        
        html_content = template_html.render(**context)
        pdf_bytes = self.HTML(string=html_content).write_pdf()
        
        logger.info(f"Generated transit report for {period}")
        return pdf_bytes
    
    def _get_template(self, template_name: str) -> Template:
        """Load Jinja2 template"""
        template_path = self.templates_dir / f"{template_name}.html"
        
        if template_path.exists():
            with open(template_path, 'r') as f:
                return Template(f.read())
        else:
            # Return default template
            return Template(self._get_default_template())
    
    def _get_default_template(self) -> str:
        """Default HTML template for reports"""
        return """
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>{{ title }}</title>
    <style>
        @page {
            size: A4;
            margin: 2cm;
        }
        body {
            font-family: 'Georgia', serif;
            color: #333;
            line-height: 1.6;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #4a5568;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        h1 {
            color: #2d3748;
            font-size: 28px;
            margin-bottom: 10px;
        }
        .meta {
            color: #718096;
            font-size: 14px;
        }
        .section {
            margin-bottom: 30px;
            page-break-inside: avoid;
        }
        h2 {
            color: #4a5568;
            font-size: 20px;
            border-left: 4px solid #667eea;
            padding-left: 15px;
            margin-bottom: 15px;
        }
        .chart-data {
            background-color: #f7fafc;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        .planet-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #e2e8f0;
        }
        .planet-name {
            font-weight: bold;
            color: #2d3748;
        }
        .planet-position {
            color: #4a5568;
        }
        .interpretation {
            background-color: #fffaf0;
            padding: 20px;
            border-left: 4px solid #ed8936;
            margin-top: 20px;
        }
        .footer {
            margin-top: 50px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            text-align: center;
            color: #a0aec0;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>{{ title }}</h1>
        <div class="meta">Generated on {{ generated_date }}</div>
        {% if profile %}
        <div class="meta">
            {{ profile.full_name }} | {{ profile.date_of_birth }}
        </div>
        {% endif %}
    </div>
    
    {% if chart %}
    <div class="section">
        <h2>Chart Details</h2>
        <div class="chart-data">
            <div class="planet-row">
                <span class="planet-name">Ascendant</span>
                <span class="planet-position">{{ "%.2f"|format(chart.ascendant) }}°</span>
            </div>
            {% for planet_name, planet_data in chart.planets.items() %}
            {% if planet_data %}
            <div class="planet-row">
                <span class="planet-name">{{ planet_name|title }}</span>
                <span class="planet-position">{{ "%.2f"|format(planet_data.longitude) }}°</span>
            </div>
            {% endif %}
            {% endfor %}
        </div>
    </div>
    {% endif %}
    
    {% if interpretation %}
    <div class="section">
        <h2>Interpretation</h2>
        <div class="interpretation">
            {{ interpretation.interpretation }}
        </div>
    </div>
    {% endif %}
    
    <div class="footer">
        <p>Generated by Astor AI | For personal use only</p>
        <p>© {{ generated_date|split(' ')|last }} All Rights Reserved</p>
    </div>
</body>
</html>
        """


# Global instance
report_generator = ReportGenerator()
