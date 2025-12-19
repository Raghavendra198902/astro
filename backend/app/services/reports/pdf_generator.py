"""
PDF Report Generation Service
Generate beautiful PDF reports in multiple languages
"""

from typing import Dict, List, Optional
from datetime import datetime
import io
from app.core.i18n import Language, get_translator

logger = None  # Will be imported from logging


class PDFReportService:
    """
    Generate PDF reports for predictions and charts
    Supports Marathi, Hindi, and English
    """
    
    def __init__(self):
        self.report_styles = {
            "title_font_size": 24,
            "heading_font_size": 16,
            "body_font_size": 11,
            "colors": {
                "primary": "#9333ea",
                "secondary": "#3b82f6",
                "accent": "#10b981",
                "text": "#1f2937"
            }
        }
    
    async def generate_prediction_report(
        self,
        user_profile: Dict,
        predictions: List[Dict],
        language: Language = Language.ENGLISH,
        include_ml_analysis: bool = True
    ) -> bytes:
        """
        Generate comprehensive PDF report for predictions
        """
        try:
            from reportlab.lib.pagesizes import letter, A4
            from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
            from reportlab.lib.units import inch
            from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, Image
            from reportlab.lib import colors
            from reportlab.pdfbase import pdfmetrics
            from reportlab.pdfbase.ttfonts import TTFont
            from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
            
            translator = get_translator(language)
            
            # Create PDF buffer
            buffer = io.BytesIO()
            doc = SimpleDocTemplate(buffer, pagesize=A4, rightMargin=72, leftMargin=72,
                                  topMargin=72, bottomMargin=18)
            
            # Container for the 'Flowable' objects
            elements = []
            
            # Styles
            styles = getSampleStyleSheet()
            
            # Title style
            title_style = ParagraphStyle(
                'CustomTitle',
                parent=styles['Heading1'],
                fontSize=24,
                textColor=colors.HexColor('#9333ea'),
                spaceAfter=30,
                alignment=TA_CENTER,
                fontName='Helvetica-Bold'
            )
            
            # Heading style
            heading_style = ParagraphStyle(
                'CustomHeading',
                parent=styles['Heading2'],
                fontSize=16,
                textColor=colors.HexColor('#3b82f6'),
                spaceAfter=12,
                spaceBefore=12,
                fontName='Helvetica-Bold'
            )
            
            # Body style
            body_style = ParagraphStyle(
                'CustomBody',
                parent=styles['BodyText'],
                fontSize=11,
                textColor=colors.HexColor('#1f2937'),
                spaceAfter=12,
                alignment=TA_JUSTIFY
            )
            
            # Title
            if language == Language.MARATHI:
                title_text = "🌟 ज्योतिष भविष्यवाणी रिपोर्ट"
                subtitle_text = "AI-सक्षम वैदिक ज्योतिष विश्लेषण"
            elif language == Language.HINDI:
                title_text = "🌟 ज्योतिष भविष्यवाणी रिपोर्ट"
                subtitle_text = "AI-संचालित वैदिक ज्योतिष विश्लेषण"
            else:
                title_text = "🌟 Astrological Prediction Report"
                subtitle_text = "AI-Powered Vedic Astrology Analysis"
            
            elements.append(Paragraph(title_text, title_style))
            elements.append(Paragraph(subtitle_text, body_style))
            elements.append(Spacer(1, 0.3*inch))
            
            # User Information
            elements.append(Paragraph(translator.translate("profile"), heading_style))
            
            profile_data = [
                [translator.translate("name"), user_profile.get("name", "N/A")],
                [translator.translate("birth_date"), user_profile.get("birth_date", "N/A")],
                [translator.translate("birth_place"), user_profile.get("birth_place", "N/A")],
                [translator.translate("generated_date"), datetime.now().strftime("%Y-%m-%d %H:%M")]
            ]
            
            profile_table = Table(profile_data, colWidths=[2*inch, 4*inch])
            profile_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#f3f4f6')),
                ('TEXTCOLOR', (0, 0), (-1, -1), colors.HexColor('#1f2937')),
                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, -1), 10),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
                ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#e5e7eb'))
            ]))
            
            elements.append(profile_table)
            elements.append(Spacer(1, 0.3*inch))
            
            # Predictions Section
            elements.append(Paragraph(translator.translate("predictions"), heading_style))
            elements.append(Spacer(1, 0.2*inch))
            
            for idx, prediction in enumerate(predictions, 1):
                # Prediction title
                pred_title = f"{idx}. {prediction.get('title', 'Prediction')}"
                elements.append(Paragraph(pred_title, heading_style))
                
                # Prediction details table
                area_label = translator.translate(prediction.get("area", "general"))
                
                pred_data = [
                    [translator.translate("area"), area_label],
                    [translator.translate("date"), prediction.get("date", "N/A")],
                    [translator.translate("accuracy"), f"{int(prediction.get('accuracy', 0) * 100)}%"],
                    [translator.translate("confidence"), prediction.get("confidence", "N/A").replace("_", " ").title()],
                ]
                
                pred_table = Table(pred_data, colWidths=[2*inch, 4*inch])
                pred_table.setStyle(TableStyle([
                    ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#ede9fe')),
                    ('TEXTCOLOR', (0, 0), (-1, -1), colors.HexColor('#1f2937')),
                    ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                    ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
                    ('FONTSIZE', (0, 0), (-1, -1), 10),
                    ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
                    ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#c4b5fd'))
                ]))
                
                elements.append(pred_table)
                elements.append(Spacer(1, 0.1*inch))
                
                # Description
                desc = Paragraph(f"<b>{translator.translate('description')}:</b> {prediction.get('description', '')}", 
                               body_style)
                elements.append(desc)
                elements.append(Spacer(1, 0.1*inch))
                
                # ML Analysis (if included)
                if include_ml_analysis and prediction.get("ml_analysis"):
                    elements.append(Paragraph(translator.translate("ml_analysis"), heading_style))
                    
                    ml_data = []
                    for method, score in prediction.get("ml_analysis", {}).items():
                        method_name = method.replace("_", " ").title()
                        ml_data.append([method_name, f"{score}%"])
                    
                    if ml_data:
                        ml_table = Table(ml_data, colWidths=[3*inch, 3*inch])
                        ml_table.setStyle(TableStyle([
                            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#dbeafe')),
                            ('TEXTCOLOR', (0, 0), (-1, -1), colors.HexColor('#1f2937')),
                            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                            ('FONTSIZE', (0, 0), (-1, -1), 10),
                            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
                            ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#93c5fd'))
                        ]))
                        elements.append(ml_table)
                
                # Recommendations
                if prediction.get("recommendations"):
                    elements.append(Spacer(1, 0.1*inch))
                    elements.append(Paragraph(translator.translate("recommendations"), heading_style))
                    
                    for rec in prediction.get("recommendations", []):
                        rec_text = f"• {rec}"
                        elements.append(Paragraph(rec_text, body_style))
                
                # Astrological Basis
                if prediction.get("astrological_basis"):
                    elements.append(Spacer(1, 0.1*inch))
                    elements.append(Paragraph(translator.translate("astrological"), heading_style))
                    elements.append(Paragraph(prediction.get("astrological_basis", ""), body_style))
                
                elements.append(Spacer(1, 0.3*inch))
                
                # Page break after every 2 predictions
                if idx % 2 == 0 and idx < len(predictions):
                    elements.append(PageBreak())
            
            # Footer
            elements.append(PageBreak())
            footer_text = f"""
            <b>Astor AI - {translator.translate('ai_powered')}</b><br/>
            {translator.translate('generated_date')}: {datetime.now().strftime('%Y-%m-%d %H:%M')}<br/>
            Version 5.0.0 - AI Excellence & Marathi Support<br/>
            <br/>
            <i>Note: {translator.translate('disclaimer')}</i>
            """
            
            elements.append(Paragraph(footer_text, body_style))
            
            # Build PDF
            doc.build(elements)
            
            # Get PDF data
            pdf_data = buffer.getvalue()
            buffer.close()
            
            return pdf_data
            
        except ImportError:
            # If reportlab not installed, return structured data for frontend generation
            return self._generate_html_fallback(user_profile, predictions, language, translator)
        
        except Exception as e:
            raise Exception(f"Failed to generate PDF: {str(e)}")
    
    def _generate_html_fallback(self, user_profile, predictions, language, translator):
        """
        Generate HTML fallback if reportlab not available
        Frontend can convert this to PDF using browser APIs
        """
        html = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Prediction Report</title>
            <style>
                body {{ font-family: Arial, sans-serif; margin: 40px; }}
                h1 {{ color: #9333ea; text-align: center; }}
                h2 {{ color: #3b82f6; margin-top: 30px; }}
                .profile-table {{ width: 100%; border-collapse: collapse; margin: 20px 0; }}
                .profile-table th, .profile-table td {{ border: 1px solid #ddd; padding: 12px; text-align: left; }}
                .profile-table th {{ background-color: #f3f4f6; }}
                .prediction {{ margin: 30px 0; padding: 20px; border-left: 4px solid #9333ea; background: #f9fafb; }}
                .footer {{ margin-top: 50px; text-align: center; color: #6b7280; }}
            </style>
        </head>
        <body>
            <h1>🌟 {translator.translate('predictions')} Report</h1>
            <p style="text-align: center; color: #6b7280;">AI-Powered Vedic Astrology Analysis</p>
            
            <h2>{translator.translate('profile')}</h2>
            <table class="profile-table">
                <tr><th>Name</th><td>{user_profile.get('name', 'N/A')}</td></tr>
                <tr><th>Birth Date</th><td>{user_profile.get('birth_date', 'N/A')}</td></tr>
                <tr><th>Birth Place</th><td>{user_profile.get('birth_place', 'N/A')}</td></tr>
            </table>
            
            <h2>{translator.translate('predictions')}</h2>
        """
        
        for pred in predictions:
            html += f"""
            <div class="prediction">
                <h3>{pred.get('title', '')}</h3>
                <p><strong>Area:</strong> {translator.translate(pred.get('area', ''))}</p>
                <p><strong>Date:</strong> {pred.get('date', '')}</p>
                <p><strong>Accuracy:</strong> {int(pred.get('accuracy', 0) * 100)}%</p>
                <p><strong>Description:</strong> {pred.get('description', '')}</p>
            </div>
            """
        
        html += f"""
            <div class="footer">
                <p>Generated by Astor AI - Version 5.0.0</p>
                <p>{datetime.now().strftime('%Y-%m-%d %H:%M')}</p>
            </div>
        </body>
        </html>
        """
        
        return html.encode('utf-8')
    
    async def generate_chart_report(
        self,
        user_profile: Dict,
        chart_data: Dict,
        language: Language = Language.ENGLISH
    ) -> bytes:
        """
        Generate PDF report for birth chart
        """
        # Similar structure to prediction report
        # Include chart image, planetary positions, houses, yogas, etc.
        pass


# Global instance
pdf_report_service = PDFReportService()
