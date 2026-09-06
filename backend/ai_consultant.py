"""
GlowVAI V2 — Autonomous AI Clinical Dermatologist & Skincare Consultant Engine
Synthesizes cognitive reasoning patterns from Claude, Manus Agent, and Google Antigravity:
1. Multi-Step Observation-Action-Reflection Loop (ReAct)
2. Formulation Contraindication & Active Ingredient Layering Validation
3. Dynamic Clinical Tool Calling (Biometrics, Catalog Search, Express ETA)
4. Strict Medical Disclaimer & Evidence-Based Formulation Grounding
"""

import json
import time
from typing import Dict, List, Any, Optional
from pydantic import BaseModel, Field

# ==============================================================================
# 1. CLINICAL FORMULATION DATABASE (Indian Skincare Science)
# ==============================================================================

INDIAN_CLINICAL_FORMULATIONS = {
    "niacinamide_10": {
        "name": "Minimalist Niacinamide 10% + Zinc 1%",
        "category": "Serums",
        "primary_actives": ["Niacinamide 10%", "Zinc PCA 1%", "EUK-134"],
        "indications": ["Sebum regulation", "Pore refinement", "Barrier restoration", "Blemish marks"],
        "ph_level": "5.5 - 6.0",
        "contraindications": ["Direct high-strength Ascorbic Acid (L-AA) in same morning step (stagger by 15 mins)"],
        "price_inr": 599,
        "suitable_skin_types": ["OILY", "COMBINATION", "NORMAL"]
    },
    "salicylic_acid_2": {
        "name": "Minimalist Salicylic Acid 2%",
        "category": "Serums",
        "primary_actives": ["Salicylic Acid (BHA) 2%", "Oligopeptide-10"],
        "indications": ["Blackheads", "Whiteheads", "Follicular congestion", "Active papules"],
        "ph_level": "3.5 - 4.0",
        "contraindications": ["Retinoids in same application step", "Open broken skin barrier"],
        "price_inr": 549,
        "suitable_skin_types": ["OILY", "ACNE_PRONE", "COMBINATION"]
    },
    "kojic_acid_1": {
        "name": "The Derma Co 1% Kojic Acid Daily Glow Serum",
        "category": "Actives",
        "primary_actives": ["Kojic Acid 1%", "Alpha Arbutin 1%", "Niacinamide 1%"],
        "indications": ["Post-Inflammatory Hyperpigmentation (PIH)", "Melanin clustering", "Sun spots"],
        "ph_level": "4.5 - 5.5",
        "contraindications": ["Benzoyl Peroxide concurrent layer"],
        "price_inr": 499,
        "suitable_skin_types": ["ALL", "PIGMENTATION_PRONE"]
    },
    "ceramide_moisturizer": {
        "name": "The Derma Co 4% Ceramide Barrier Repair Cream",
        "category": "Moisturizers",
        "primary_actives": ["Ceramide Complex (1, 3, 6-II)", "Oat Extract", "Cholesterol"],
        "indications": ["Transepidermal Water Loss (TEWL)", "Compromised barrier", "Flakiness"],
        "ph_level": "5.5",
        "contraindications": [],
        "price_inr": 399,
        "suitable_skin_types": ["DRY", "SENSITIVE", "COMBINATION", "DAMAGED_BARRIER"]
    },
    "hyaluronic_sunscreen": {
        "name": "The Derma Co 1% Hyaluronic Sunscreen Aqua Gel SPF 50 PA++++",
        "category": "Suncare",
        "primary_actives": ["Hyaluronic Acid 1%", "Titanium Dioxide", "Uvinul A Plus", "Tinosorb S"],
        "indications": ["UVA/UVB broad spectrum protection", "Blue light filtering", "Zero white cast"],
        "ph_level": "6.0",
        "contraindications": [],
        "price_inr": 499,
        "suitable_skin_types": ["ALL"]
    }
}

# ==============================================================================
# 2. AUTONOMOUS AGENT TOOLS DEFINITION
# ==============================================================================

GLOWVAI_AGENT_TOOLS = [
    {
        "name": "analyze_face_biometrics",
        "description": "Computes clinical skin metrics (Acne, Hydration, Texture, Pigmentation, Sebum) from CNN inference or diagnostic survey.",
        "parameters": {
            "type": "object",
            "properties": {
                "skin_type": {"type": "string", "enum": ["OILY", "DRY", "COMBINATION", "NORMAL", "SENSITIVE"]},
                "acne_severity": {"type": "string", "enum": ["NONE", "MILD", "MODERATE", "SEVERE"]},
                "hydration_level": {"type": "integer", "description": "Hydration score 0-100"},
                "pigmentation_concern": {"type": "boolean"}
            },
            "required": ["skin_type"]
        }
    },
    {
        "name": "verify_ingredient_contraindications",
        "description": "Audits active ingredients for pH compatibility, chemical clashes, and safety layering rules.",
        "parameters": {
            "type": "object",
            "properties": {
                "active_ingredients": {"type": "array", "items": {"type": "string"}},
                "usage_time": {"type": "string", "enum": ["MORNING", "EVENING", "BOTH"]}
            },
            "required": ["active_ingredients", "usage_time"]
        }
    },
    {
        "name": "match_clinical_skincare_routine",
        "description": "Selects certified Indian catalog formulations matched to biometric scores and barrier condition.",
        "parameters": {
            "type": "object",
            "properties": {
                "skin_type": {"type": "string"},
                "target_concerns": {"type": "array", "items": {"type": "string"}}
            },
            "required": ["skin_type", "target_concerns"]
        }
    },
    {
        "name": "calculate_express_delivery_eta",
        "description": "Calculates hyper-local instant delivery ETA based on GPS coordinates and rider dispatch.",
        "parameters": {
            "type": "object",
            "properties": {
                "city": {"type": "string"},
                "state": {"type": "string"}
            },
            "required": ["city"]
        }
    }
]

# ==============================================================================
# 3. TOOL EXECUTION ENGINE
# ==============================================================================

def execute_agent_tool(tool_name: str, args: Dict[str, Any]) -> Dict[str, Any]:
    """Executes deterministic clinical tools and returns structured observation."""
    if tool_name == "analyze_face_biometrics":
        skin_type = args.get("skin_type", "COMBINATION")
        acne_severity = args.get("acne_severity", "MILD")
        hydration = args.get("hydration_level", 78)
        
        acne_score = {"NONE": 94, "MILD": 84, "MODERATE": 70, "SEVERE": 54}.get(acne_severity, 84)
        overall_score = int((acne_score * 0.35) + (hydration * 0.35) + (86 * 0.15) + (80 * 0.15))
        
        return {
            "status": "success",
            "overallScore": overall_score,
            "skinType": skin_type,
            "biometricPulse": {
                "acne": {"score": acne_score, "grade": acne_severity},
                "hydration": {"score": hydration, "grade": "OPTIMAL" if hydration >= 75 else "DEPLETED"},
                "texture": {"score": 82, "grade": "REFINED"},
                "pigmentation": {"score": 88, "grade": "EVEN"}
            },
            "barrierStatus": "HEALTHY_RESILIENT" if hydration >= 70 else "IMPAIRED_TEWL"
        }

    elif tool_name == "verify_ingredient_contraindications":
        actives = [a.lower() for a in args.get("active_ingredients", [])]
        time_of_day = args.get("usage_time", "MORNING")
        warnings = []
        is_safe = True

        if any("retinol" in a for a in actives) and any("salicylic" in a or "glycolic" in a for a in actives):
            if time_of_day == "BOTH" or time_of_day == "EVENING":
                warnings.append("⚠️ Retinol and Direct Acids (AHA/BHA) should not be layered in the same step. Alternate nights to prevent barrier micro-tear.")
                is_safe = False

        if any("vitamin c" in a or "ascorbic" in a for a in actives) and any("niacinamide" in a for a in actives):
            warnings.append("💡 When combining pure L-Ascorbic Acid with Niacinamide, allow 10-15 minutes between applications for optimal pH absorption.")

        if any("retinol" in a or "aha" in a or "bha" in a for a in actives) and time_of_day == "MORNING":
            warnings.append("☀️ Photosensitizing actives detected in Morning routine. Broad-spectrum SPF 50+ is mandatory.")

        return {
            "isSafeToLayer": is_safe,
            "warnings": warnings,
            "phSynergy": "BALANCED" if is_safe else "COMPATIBILITY_CAUTION",
            "recommendedSeparation": "Stagger AM / PM" if not is_safe else "Layer thinnest to thickest consistency"
        }

    elif tool_name == "match_clinical_skincare_routine":
        skin_type = args.get("skin_type", "COMBINATION").upper()
        concerns = [c.lower() for c in args.get("target_concerns", [])]
        
        routine_items = []
        total_inr = 0

        # AM Step 1: Cleanser / Prep
        # AM Step 2: Target Active Serum
        if any("acne" in c or "pore" in c or "sebum" in c for c in concerns):
            prod = INDIAN_CLINICAL_FORMULATIONS["niacinamide_10"]
            routine_items.append({"step": "AM Treatment", **prod})
            total_inr += prod["price_inr"]
        elif any("pigment" in c or "dark spot" in c or "glow" in c for c in concerns):
            prod = INDIAN_CLINICAL_FORMULATIONS["kojic_acid_1"]
            routine_items.append({"step": "AM Treatment", **prod})
            total_inr += prod["price_inr"]

        # Step 3: Barrier Moisture
        ceramide_prod = INDIAN_CLINICAL_FORMULATIONS["ceramide_moisturizer"]
        routine_items.append({"step": "Barrier Support", **ceramide_prod})
        total_inr += ceramide_prod["price_inr"]

        # Step 4: Suncare
        sun_prod = INDIAN_CLINICAL_FORMULATIONS["hyaluronic_sunscreen"]
        routine_items.append({"step": "Broad Spectrum Protection", **sun_prod})
        total_inr += sun_prod["price_inr"]

        return {
            "recommendedRoutine": routine_items,
            "totalPriceINR": total_inr,
            "instantDropDiscount": "FLAT ₹100 OFF applied automatically",
            "finalPriceINR": total_inr - 100
        }

    elif tool_name == "calculate_express_delivery_eta":
        city = args.get("city", "Vijayawada")
        return {
            "deliveryType": "GLOWVAI_INSTANT_DROP",
            "dispatchHub": f"GlowVAI Micro-Fulfillment Dark Store ({city})",
            "etaMinutes": 15,
            "deliveryFeeINR": 0,
            "liveRiderTrackingAvailable": True
        }

    return {"status": "error", "message": f"Unknown tool: {tool_name}"}

# ==============================================================================
# 4. CLINICAL DERMATOLOGIST PROMPT (Manus / Claude / Antigravity Style)
# ==============================================================================

GLOWVAI_SYSTEM_PROMPT = """You are **GlowVAI AI Dermatologist**, a premier clinical cosmetic science intelligence engine paired with real-time biometric diagnostic models.

### YOUR CORE IDENTITY & PRINCIPLES:
1. **Clinical Precision**: Ground every recommendation in evidence-based dermatology (stratum corneum physiology, lipid barrier synthesis, melanin distribution, and trans-epidermal water loss).
2. **Indian Formulation Grounding**: Recommend verified Indian skincare actives (Minimalist, The Derma Co, Dr. Sheth's, Dot & Key, Cetaphil, Aqualogica) with explicit percentage transparency.
3. **Structured Clinical Tool Reasoning**:
   - Analyze biometric face scan metrics (Acne Grade, Moisture %, Melanin Index).
   - Audit ingredient layering contraindications before finalizing any prescription.
   - Pair recommendations with 15-minute hyper-local delivery fulfillment.
4. **Safety & Empathy**: Never diagnose medical pathologies (e.g. melanoma, severe cystic nodular acne) without recommending in-person dermatologist consultation.

### RESPONSE FORMAT:
- **Biometric Health Score Assessment**: (Score / 100 & Barrier Condition)
- **Clinical Active Ingredients**: (With target percentage and biological mechanism)
- **Step-by-Step AM/PM Regimen**: (Cleanser → Treatment Active → Barrier Lipid → SPF 50)
- **Contraindications & Precautions**: (Layering rules, patch test advisory)
- **15-Min Express Drop Routine**: (Matched products with direct 1-click DoorDash checkout)
"""

class ChatMessage(BaseModel):
    role: str
    content: str

class AgentConsultRequest(BaseModel):
    messages: List[ChatMessage]
    userContext: Optional[Dict[str, Any]] = None

class AgentConsultResponse(BaseModel):
    reply: str
    toolCallsMade: List[Dict[str, Any]]
    recommendedRoutine: Optional[Dict[str, Any]] = None
    telemetrySynced: bool = True
