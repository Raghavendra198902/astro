"""
Prompt Templates for AI Interpretation
Structured prompts for different interpretation types
"""

from typing import Dict

# System prompts
SYSTEM_ASTROLOGER = """You are a highly knowledgeable and experienced astrologer with expertise in both Vedic (Jyotish) and Western astrology. 

Your role is to provide:
- Accurate, insightful interpretations based on astrological principles
- Balanced perspectives highlighting both strengths and challenges
- Practical, actionable guidance
- Empowering messages that respect free will

Guidelines:
- Always provide context and explain astrological reasoning
- Use clear, accessible language while maintaining depth
- Avoid absolute predictions or medical/financial advice
- Emphasize potential and growth opportunities
- Cite traditional texts when relevant
- Be compassionate and constructive in tone"""

# Natal chart interpretation
NATAL_INTERPRETATION = """Based on the following natal chart placements, provide a comprehensive astrological interpretation:

{symbolization}

Please structure your interpretation with the following sections:

**Overview**: Brief summary of the chart's key themes and overall energy

**Personality & Character**: Core traits, temperament, and psychological patterns based on Ascendant, Sun, and Moon

**Strengths & Talents**: Natural abilities, gifts, and areas of excellence

**Challenges & Growth Areas**: Obstacles to overcome and lessons to learn

**Career & Life Path**: Professional inclinations, suitable fields, and purpose

**Relationships & Social Life**: Approach to relationships, compatibility factors

**Health & Vitality**: Physical constitution and health considerations (general guidance only)

**Spiritual Path**: Higher purpose, karmic lessons, and spiritual potential

**Recommendations**: Practical suggestions for maximizing potential and navigating challenges

Provide rich detail drawing on classical astrological principles while keeping language accessible."""

# Transit interpretation
TRANSIT_INTERPRETATION = """Analyze the current transits and their impact on the natal chart:

Natal Chart:
{natal}

Current Transits:
{transit}

Key Transit-Natal Aspects:
{aspects}

Please provide:

**Transit Overview**: Summary of the current astrological weather

**Major Influences**: Most significant transits and their meanings

**Opportunities**: Areas where positive energy is available

**Challenges**: Potential obstacles or tensions to navigate

**Timing**: Expected duration and evolution of these influences

**Practical Guidance**: Concrete suggestions for working with these energies

Focus on actionable insights that help the person navigate this period effectively."""

# Dasha interpretation
DASHA_INTERPRETATION = """Interpret the current Vimshottari Dasha period:

Chart Placements:
{chart}

Current Mahadasha: {mahadasha}
Current Antardasha: {antardasha}
Remaining Period: {balance_years} years

Please provide:

**Dasha Lord Analysis**: Characteristics and domains of the Mahadasha lord based on its placement in the natal chart

**Sub-period Influence**: How the Antardasha lord modifies the Mahadasha themes

**Life Areas Activated**: Which areas of life are emphasized during this period

**Opportunities**: What this period favors and supports

**Challenges**: Potential difficulties or tests

**Timeline**: How this period typically unfolds

**Recommendations**: How to maximize this dasha period's potential

Draw on classical Vedic principles regarding dasha interpretation."""

# Compatibility interpretation
COMPATIBILITY_INTERPRETATION = """Analyze the compatibility between these two charts:

Person A:
{chart_a}

Person B:
{chart_b}

Guna Milan Score: {guna_score}/36
Key Aspects: {synastry_aspects}

Please provide:

**Overall Compatibility**: Summary assessment

**Emotional Harmony**: Moon-to-Moon and emotional connections

**Communication**: Mercury aspects and mental compatibility

**Romantic Chemistry**: Venus-Mars dynamics

**Long-term Potential**: Saturn, Jupiter, and commitment factors

**Strengths**: Areas of natural harmony

**Growth Areas**: Challenges requiring awareness and work

**Recommendations**: Practical advice for the relationship

Be balanced and constructive, avoiding deterministic judgments."""

# Question answering with RAG
QA_WITH_CONTEXT = """Based on the following knowledge from authoritative astrological texts:

{context}

Question: {question}

Please provide a detailed, well-sourced answer that:
- Directly addresses the question
- Cites relevant sources from the context
- Explains underlying astrological principles
- Offers practical application

If the context doesn't fully answer the question, supplement with general astrological knowledge while being clear about what comes from sources vs. general principles."""


def get_prompt_template(template_name: str) -> str:
    """Get prompt template by name"""
    
    templates: Dict[str, str] = {
        "system_astrologer": SYSTEM_ASTROLOGER,
        "natal_interpretation": NATAL_INTERPRETATION,
        "transit_interpretation": TRANSIT_INTERPRETATION,
        "dasha_interpretation": DASHA_INTERPRETATION,
        "compatibility_interpretation": COMPATIBILITY_INTERPRETATION,
        "qa_with_context": QA_WITH_CONTEXT
    }
    
    return templates.get(template_name, "")
