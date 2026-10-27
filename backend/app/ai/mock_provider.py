import json
from typing import Dict, Any, List
from app.ai.base import BaseAIProvider

class MockProvider(BaseAIProvider):
    """
    Offline/Demo AI Provider for VidyaSaathi.
    Provides realistic, culturally tailored, curriculum-grounded tutoring
    without requiring external cloud API keys.
    """

    EXPLANATION_TEMPLATES = {
        "hi": {
            "fractions": {
                "title": "भिन्न (Fractions) क्या हैं?",
                "explanation": "भिन्न किसी पूरी चीज़ के बराबर हिस्सों को दर्शाने का तरीका है। ऊपर की संख्या (अंश) बताती है कि हमारे पास कितने हिस्से हैं, और नीचे की संख्या (हर) बताती है कि कुल कितने बराबर हिस्से किए गए हैं।",
                "rural_example": "जैसे मां ने 1 बाजरे की रोटी बनाई और उसे 4 भाई-बहनों में बराबर बांट दिया। हर बच्चे को रोटी का 1/4 (एक चौथाई) हिस्सा मिला।",
                "key_takeaway": "बराबर हिस्से करना ही भिन्न की मूल पहचान है। जब 4 हिस्से मिलते हैं, तो 1 पूरी रोटी बनती है (4/4 = 1)।",
                "audio_text": "भिन्न किसी पूरी चीज़ के बराबर हिस्सों को कहते हैं। जैसे एक रोटी के चार टुकड़े करने पर हर टुकड़ा एक चौथाई कहलाता है।"
            },
            "percentages": {
                "title": "प्रतिशत (Percentages) को समझें",
                "explanation": "प्रतिशत का मतलब है 'प्रति सौ' यानी 100 में से कितना। इसे % के चिन्ह से दर्शाते हैं।",
                "rural_example": "गाँव की मंडी में अगर 100 बोरी गेहूँ में से 15 बोरी बीज के लिए रखी गई, तो इसका मतलब 15% गेहूँ सुरक्षित किया गया।",
                "key_takeaway": "किसी भी संख्या को 100 के आधार पर नापना प्रतिशत कहलाता है।",
                "audio_text": "प्रतिशत का अर्थ होता है हर सौ में से कितना हिस्सा।"
            },
            "photosynthesis": {
                "title": "प्रकाश संश्लेषण (Photosynthesis)",
                "explanation": "हरे पौधे सूर्य की रोशनी, पानी और हवा से कार्बन डाइऑक्साइड लेकर अपना भोजन (ग्लूकोज) बनाते हैं और हमें ऑक्सीजन देते हैं।",
                "rural_example": "जैसे घर के चूल्हे में लकड़ी, आग और पानी से खाना बनता है, वैसे ही नीम का पेड़ धूप और पानी से अपनी हरी पत्तियों की रसोई में भोजन बनाता है।",
                "key_takeaway": "पत्तियों में मौजूद क्लोरोफिल धूप को सोखता है और पौधे के लिए भोजन पकाता है।",
                "audio_text": "पौधे सूर्य के प्रकाश और पानी की मदद से अपनी पत्तियों में खाना बनाते हैं। इस प्रक्रिया को प्रकाश संश्लेषण कहते हैं।"
            },
            "force": {
                "title": "बल और दाब (Force and Pressure)",
                "explanation": "किसी वस्तु को खींचना या धकेलना 'बल' कहलाता है। जब यह बल किसी सतह के क्षेत्रफल पर पड़ता है, तो उसे 'दाब' (Pressure) कहते हैं।",
                "rural_example": "खेत में ट्रैक्टर के पहिये बहुत चौड़े बनाए जाते हैं ताकि उनका क्षेत्रफल बढ़े और जमीन पर दबाव कम पड़े, जिससे ट्रैक्टर गीली मिट्टी में नहीं धंसता।",
                "key_takeaway": "क्षेत्रफल जितना बड़ा होगा, दाब उतना ही कम होगा। इसीलिए कुदाल की धार पतली रखी जाती है ताकि ज्यादा दाब लगे।",
                "audio_text": "बल का मतलब धक्का या खिंचाव है। चौड़े पहिये जमीन पर कम दबाव डालते हैं इसलिए ट्रैक्टर कीचड़ में नहीं फंसता।"
            }
        },
        "en": {
            "fractions": {
                "title": "Understanding Fractions Simply",
                "explanation": "A fraction represents equal parts of a whole item. The numerator (top) shows how many parts you have, while the denominator (bottom) shows total equal parts.",
                "rural_example": "Imagine dividing a fresh roti equally among 4 brothers and sisters. Each child receives 1/4 of the roti.",
                "key_takeaway": "Fractions only work when parts are divided strictly equally.",
                "audio_text": "A fraction represents equal parts of a whole, like sharing one roti equally among four children."
            },
            "photosynthesis": {
                "title": "How Plants Cook Food: Photosynthesis",
                "explanation": "Green plants make their own food using sunlight, water from the soil, and carbon dioxide from the air. In return, they release fresh oxygen for us to breathe.",
                "rural_example": "Just like a solar cooker on the village terrace uses sunlight to prepare dal, the green leaves of the banyan tree absorb sunlight to create plant food.",
                "key_takeaway": "Chlorophyll gives leaves their green color and traps the sunlight needed for photosynthesis.",
                "audio_text": "Photosynthesis is the natural process where green leaves use sunlight and water to produce nutrition."
            }
        }
    }

    async def generate_explanation(
        self,
        concept_title: str,
        context: str,
        language: str = "hi"
    ) -> Dict[str, Any]:
        lang_key = language if language in ["hi", "en"] else "hi"
        key = "fractions"
        c_lower = (concept_title + " " + context).lower()

        if "photo" in c_lower or "प्रकाश" in c_lower or "plant" in c_lower or "पौधे" in c_lower:
            key = "photosynthesis"
        elif "force" in c_lower or "बल" in c_lower or "दाब" in c_lower or "pressure" in c_lower or "motion" in c_lower:
            key = "force"
        elif "percent" in c_lower or "प्रतिशत" in c_lower or "लाभ" in c_lower or "profit" in c_lower:
            key = "percentages"

        template = self.EXPLANATION_TEMPLATES.get(lang_key, self.EXPLANATION_TEMPLATES["hi"]).get(key)
        if not template:
            template = self.EXPLANATION_TEMPLATES["hi"]["fractions"]

        return {
            "title": template["title"],
            "explanation": template["explanation"],
            "rural_example": template["rural_example"],
            "key_takeaway": template["key_takeaway"],
            "audio_text": template["audio_text"],
            "language": language
        }

    async def chat_doubt(
        self,
        user_query: str,
        syllabus_context: str,
        source_chapter: str,
        language: str = "hi"
    ) -> Dict[str, Any]:
        q_lower = user_query.lower()
        
        # Safety guardrails: reject inappropriate, harmful or totally non-syllabus queries
        inappropriate_words = ["hack", "bomb", "weapon", "kill", "drug", "alcohol", "hate"]
        if any(w in q_lower for w in inappropriate_words):
            reply = "मैं केवल आपकी स्कूल की पढ़ाई, गणित और विज्ञान के सवालों में मदद कर सकता हूँ। कृपया अपनी किताब से जुड़ा सवाल पूछें।" if language == "hi" else "I can only assist with your school syllabus subjects like Math and Science. Please ask a curriculum-related question."
            return {
                "reply": reply,
                "source_chapter": "VidyaSaathi Safety Rules",
                "audio_text": reply,
                "safety_passed": False
            }

        # Curriculum-grounded responses
        if "stomata" in q_lower or "रंध्र" in q_lower or "पत्ते" in q_lower or "leaf" in q_lower or "breath" in q_lower:
            reply_hi = "पत्तियों की निचली सतह पर छोटे-छोटे छिद्र होते हैं जिन्हें 'स्टोमेटा' (रंध्र) कहते हैं। पौधे इन्हीं छिद्रों से कार्बन डाइऑक्साइड अंदर लेते हैं और ऑक्सीजन बाहर छोड़ते हैं।"
            reply_en = "Stomata are tiny microscopic pores present mostly on the underside of leaves. Plants take in carbon dioxide and release oxygen and water vapor through stomata."
            reply = reply_hi if language == "hi" else reply_en
            chapter = "Class 8 Science: Photosynthesis and Plant Nutrition"
        elif "friction" in q_lower or "घर्षण" in q_lower or "slip" in q_lower:
            reply_hi = "घर्षण (Friction) वह विरोधी बल है जो दो सतहों के आपस में रगड़ने पर गति को रोकता है। इसी बल के कारण हम कच्ची सड़क पर बिना फिसले चल पाते हैं।"
            reply_en = "Friction is the opposing force that resists sliding motion when two surfaces touch. It enables us to walk steadily on village roads without slipping."
            reply = reply_hi if language == "hi" else reply_en
            chapter = "Class 8 Science: Force, Pressure, and Motion"
        elif "fraction" in q_lower or "भिन्न" in q_lower or "जोड़" in q_lower:
            reply_hi = "भिन्न को जोड़ने के लिए दोनों का 'हर' (Denominator) एक समान होना चाहिए। जैसे 1/4 + 2/4 = 3/4 होता है।"
            reply_en = "To add fractions, ensure their denominators are identical. For example, 1/4 + 2/4 equals 3/4."
            reply = reply_hi if language == "hi" else reply_en
            chapter = "Class 8 Mathematics: Fractions and Rational Numbers"
        elif "percent" in q_lower or "प्रतिशत" in q_lower or "लाभ" in q_lower:
            reply_hi = "प्रतिशत निकालने के लिए हिस्से को 100 से गुणा किया जाता है। जैसे 50 में से 25 अंक मिलने पर (25/50) * 100 = 50% होता है।"
            reply_en = "To calculate percentage, divide the part by total and multiply by 100. For instance, 25 out of 50 equals 50%."
            reply = reply_hi if language == "hi" else reply_en
            chapter = "Class 8 Mathematics: Percentages and Commercial Math"
        else:
            # Grounded in retrieved syllabus snippet if available
            if syllabus_context and len(syllabus_context.strip()) > 30:
                first_sentence = syllabus_context.strip().split(".")[0] + "."
                reply_hi = f"आपकी किताब के अनुसार: {first_sentence} अगर आपको कोई विशेष शब्द समझना हो तो बताएं।"
                reply_en = f"According to your syllabus chapter: {first_sentence} Feel free to ask if you need a simpler rural example."
                reply = reply_hi if language == "hi" else reply_en
                chapter = source_chapter or "NCERT Class 8 Syllabus"
            else:
                reply_hi = "माफ़ कीजिये, मुझे इस विषय की पूरी जानकारी नहीं है। कृपया अपनी कक्षा 8 गणित या विज्ञान की किताब से कोई सवाल पूछें।"
                reply_en = "I am not completely sure about that. Please ask a question related to your Class 8 Math or Science syllabus."
                reply = reply_hi if language == "hi" else reply_en
                chapter = "Syllabus Inquiry"

        return {
            "reply": reply,
            "source_chapter": chapter,
            "audio_text": reply,
            "safety_passed": True
        }

    async def generate_questions(
        self,
        topic_name: str,
        subject: str,
        class_level: int,
        difficulty: str,
        language: str,
        syllabus_context: str,
        count: int = 3
    ) -> List[Dict[str, Any]]:
        # High quality generated questions
        questions = []
        is_hindi = language == "hi"

        if "fraction" in topic_name.lower() or "भिन्न" in topic_name:
            pool = [
                {
                    "text": "यदि एक खेत के 8 बराबर भाग किए जाएँ और 3 भागों में गेहूँ बोया जाए, तो गेहूँ का भाग भिन्न में क्या होगा?" if is_hindi else "If a field is divided into 8 equal parts and wheat is sown in 3 parts, what fraction of the field has wheat?",
                    "options": ["3/8", "5/8", "8/3", "1/8"] if is_hindi else ["3/8", "5/8", "8/3", "1/8"],
                    "correct_index": 0,
                    "difficulty": difficulty,
                    "language": language,
                    "explanation": "कुल 8 हिस्सों में से 3 हिस्से चुने गए, इसलिए भिन्न 3/8 है।" if is_hindi else "3 parts out of 8 equal parts represents the fraction 3/8."
                },
                {
                    "text": "1/2 और 1/4 का योग (जोड़) क्या होगा?" if is_hindi else "What is the sum of 1/2 and 1/4?",
                    "options": ["3/4", "2/6", "1/6", "2/4"] if is_hindi else ["3/4", "2/6", "1/6", "2/4"],
                    "correct_index": 0,
                    "difficulty": difficulty,
                    "language": language,
                    "explanation": "1/2 = 2/4. अब 2/4 + 1/4 = 3/4." if is_hindi else "Convert 1/2 to 2/4. Then 2/4 + 1/4 = 3/4."
                },
                {
                    "text": "3/5 का व्युत्क्रम (reciprocal) क्या होगा?" if is_hindi else "What is the reciprocal of 3/5?",
                    "options": ["5/3", "-3/5", "1/5", "3/10"] if is_hindi else ["5/3", "-3/5", "1/5", "3/10"],
                    "correct_index": 0,
                    "difficulty": difficulty,
                    "language": language,
                    "explanation": "अंश और हर को आपस में बदलने पर व्युत्क्रम 5/3 बनता है।" if is_hindi else "Flipping numerator and denominator gives 5/3."
                }
            ]
        elif "photo" in topic_name.lower() or "प्रकाश" in topic_name:
            pool = [
                {
                    "text": "पौधों की पत्तियों में पाए जाने वाले हरे वर्णक का नाम क्या है?" if is_hindi else "What is the name of the green pigment found in plant leaves?",
                    "options": ["क्लोरोफिल (Chlorophyll)", "हीमोग्लोबिन", "स्टार्च", "सेल्युलोज"] if is_hindi else ["Chlorophyll", "Hemoglobin", "Starch", "Cellulose"],
                    "correct_index": 0,
                    "difficulty": difficulty,
                    "language": language,
                    "explanation": "क्लोरोफिल सूर्य के प्रकाश को अवशोषित करता है।" if is_hindi else "Chlorophyll absorbs solar energy for photosynthesis."
                },
                {
                    "text": "प्रकाश संश्लेषण के दौरान पौधे कौन सी गैस बाहर छोड़ते हैं?" if is_hindi else "Which gas is released by plants during photosynthesis?",
                    "options": ["ऑक्सीजन (Oxygen)", "कार्बन डाइऑक्साइड", "नाइट्रोजन", "मीथेन"] if is_hindi else ["Oxygen", "Carbon dioxide", "Nitrogen", "Methane"],
                    "correct_index": 0,
                    "difficulty": difficulty,
                    "language": language,
                    "explanation": "पौधे CO2 ग्रहण करते हैं और प्राणवायु ऑक्सीजन छोड़ते हैं।" if is_hindi else "Plants absorb CO2 and release oxygen."
                },
                {
                    "text": "पत्तियों में गैसों के आदान-प्रदान के लिए कौन से सूक्ष्म छिद्र होते हैं?" if is_hindi else "Which tiny pores facilitate gas exchange in leaves?",
                    "options": ["स्टोमेटा (रंध्र)", "जाइलम", "फ्लोएम", "जड़"] if is_hindi else ["Stomata", "Xylem", "Phloem", "Root hair"],
                    "correct_index": 0,
                    "difficulty": difficulty,
                    "language": language,
                    "explanation": "स्टोमेटा पत्तियों की निचली सतह पर स्थित छोटे छिद्र हैं।" if is_hindi else "Stomata are the tiny leaf pores."
                }
            ]
        else:
            pool = [
                {
                    "text": f"{topic_name} से जुड़ा एक महत्वपूर्ण अभ्यास प्रश्न" if is_hindi else f"An essential practice question on {topic_name}",
                    "options": ["विकल्प अ (सही)", "विकल्प ब", "विकल्प स", "विकल्प द"] if is_hindi else ["Option A (Correct)", "Option B", "Option C", "Option D"],
                    "correct_index": 0,
                    "difficulty": difficulty,
                    "language": language,
                    "explanation": "यह NCERT पाठ्यक्रम पर आधारित संकल्पना है।" if is_hindi else "This is grounded in the NCERT syllabus concept."
                }
            ]

        # Return requested count
        while len(questions) < count:
            for item in pool:
                questions.append(item)
                if len(questions) >= count:
                    break

        return questions[:count]

    async def generate_lesson_plan(
        self,
        topic_name: str,
        subject: str,
        class_level: int,
        duration_minutes: int,
        objectives: str = "",
        rural_context: str = "",
        language: str = "hi",
        syllabus_context: str = ""
    ) -> Dict[str, Any]:
        is_hindi = language == "hi"

        # Topic-tailored content
        if "fraction" in topic_name.lower() or "भिन्न" in topic_name:
            obj_list = [
                "विद्यार्थी भिन्न के अंश और हर की संकल्पना को स्पष्ट समझ सकेंगे।" if is_hindi else "Students will understand numerators and denominators clearly.",
                "समान हिस्सों में विभाजन के गणितीय नियमों को दैनिक उदाहरणों से जोड़ सकेंगे।" if is_hindi else "Connect equal-part division to daily village examples.",
                "समतुल्य भिन्नों (Equivalent Fractions) की पहचान कर सकेंगे।" if is_hindi else "Identify and simplify equivalent fractions."
            ]
            hook = (
                "शिक्षक कक्षा में एक रोटी या कागज की वृत्ताकार चपाती दिखाकर शुरुआत करेंगे: 'यदि खेत में काम करने वाले 4 मजदूरों में 1 रोटी बराबर बांटनी हो, तो प्रत्येक को कितना मिलेगा?' इससे छात्रों में 'समान हिस्से' की जिज्ञासा जागेगी।"
                if is_hindi else
                "Teacher begins with a circular paper roti: 'If one fresh roti has to be shared equally among 4 farm workers, how much does each receive?' This introduces the core concept of equal division."
            )
            steps = [
                {
                    "step_number": 1,
                    "title": "अवधारणा परिचय (Concept Introduction)" if is_hindi else "Concept Introduction",
                    "duration": "10 मिनट" if is_hindi else "10 mins",
                    "teacher_action": "श्यामपट्ट पर भिन्न की परिभाषा एवं अंश (Numerator) तथा हर (Denominator) का अर्थ लिखना।" if is_hindi else "Write fraction definition and clarify numerator vs denominator on the board.",
                    "student_activity": "छात्र अपनी कॉपियों में 1/2, 1/4 और 3/4 के चित्र बनाएंगे।" if is_hindi else "Students sketch 1/2, 1/4, and 3/4 circle diagrams in notebooks."
                },
                {
                    "step_number": 2,
                    "title": "समतुल्य भिन्न प्रदर्शन (Equivalent Fractions Demo)" if is_hindi else "Equivalent Fractions Demo",
                    "duration": "15 मिनट" if is_hindi else "15 mins",
                    "teacher_action": "कागज की पट्टियों को मोड़कर दिखाना कि 1/2 और 2/4 का मान बिल्कुल समान है।" if is_hindi else "Demonstrate with paper strips that 1/2 and 2/4 cover the exact same area.",
                    "student_activity": "छात्र अपने सहपाठियों के साथ 2/6 और 1/3 की तुलना करेंगे।" if is_hindi else "Pairs compare 2/6 and 1/3 using folded paper strips."
                },
                {
                    "step_number": 3,
                    "title": "समस्या समाधान व अभ्यास (Guided Practice)" if is_hindi else "Guided Practice",
                    "duration": "12 मिनट" if is_hindi else "12 mins",
                    "teacher_action": "मंडी में अनाज की बोरियों के 3 उदाहरण हल कराना।" if is_hindi else "Solve 3 contextual village market grain division problems.",
                    "student_activity": "छात्र जोड़े में 2 अभ्यास प्रश्न तुरंत हल करेंगे।" if is_hindi else "Students solve practice problems in pairs."
                }
            ]
            activity = {
                "title": "कागज की रोटी गतिविधि (Paper Roti Sharing Activity)" if is_hindi else "Paper Roti Sharing Activity",
                "materials": "पुराने अखबार या कॉपियों के पन्ने, पेंसिल" if is_hindi else "Scrap notebook paper, pencil, scale",
                "instructions": "प्रत्येक समूह को एक गोल कागज देकर 1/2, 1/4, और 1/8 में मोड़ने को कहें। उन्हें हर हिस्से पर भिन्न का नाम लिखने को कहें।" if is_hindi else "Each group folds circular papers into 1/2, 1/4, and 1/8 and labels each quadrant.",
                "expected_outcome": "छात्र समझ पाएंगे कि हर (denominator) जितना बड़ा होगा, प्रत्येक हिस्सा उतना ही छोटा होगा।" if is_hindi else "Students intuitively grasp that larger denominators create smaller individual portions."
            }
            misconceptions = [
                {
                    "misconception": "छात्र सोचते हैं कि 1/8 बड़ा है क्योंकि 8 बड़ा अंक है।" if is_hindi else "Students assume 1/8 is larger than 1/4 because 8 > 4.",
                    "clarification": "उन्हें दिखाएं कि 1 रोटी को 8 लोगों में बांटने पर टुकड़ा 4 लोगों में बांटने से छोटा होता है।" if is_hindi else "Clarify that dividing a whole into 8 pieces produces smaller pieces than dividing into 4."
                }
            ]
            assessments = [
                {
                    "question": "यदि खेत के 5 बराबर भागों में से 2 में सरसों बोई जाए, तो सरसों का भिन्न क्या है?" if is_hindi else "If mustard is sown in 2 out of 5 equal field plots, what is the fraction?",
                    "expected_answer": "2/5"
                },
                {
                    "question": "3/4 में अंश क्या है और हर क्या है?" if is_hindi else "In the fraction 3/4, what is the numerator and what is the denominator?",
                    "expected_answer": "अंश = 3, हर = 4" if is_hindi else "Numerator = 3, Denominator = 4"
                }
            ]
            hw = "घर जाकर 2 ऐसी चीजें ढूंढें जिन्हें बराबर हिस्सों में बांटा जाता है (जैसे गुड़ की डली या खेत का रकबा) और उनके भिन्न लिखें।" if is_hindi else "Identify 2 objects divided at home (like jaggery cubes or farm plots) and write down their fractional shares."
        else:
            obj_list = [
                f"{topic_name} की मूल संकल्पना को दैनिक जीवन से जोड़कर समझना।" if is_hindi else f"Understand the core concept of {topic_name} with everyday analogies.",
                f"NCERT कक्षा {class_level} के अनुसार मुख्य सूत्रों एवं नियमों को याद रखना।" if is_hindi else f"Memorize and apply NCERT Class {class_level} rules and definitions.",
                "कक्षा के अभ्यास प्रश्नों को आत्मविश्वास से हल करना।" if is_hindi else "Confidently solve NCERT curriculum exercise questions."
            ]
            hook = (
                f"शिक्षक गाँव के दैनिक परिवेश (कृषि, पानी, सौर ऊर्जा) से जुड़ा एक जीवंत प्रश्न पूछकर {topic_name} का पाठ आरंभ करेंगे।"
                if is_hindi else
                f"The teacher introduces {topic_name} by referencing a familiar rural setting such as farming, water irrigation, or solar energy."
            )
            steps = [
                {
                    "step_number": 1,
                    "title": "संकल्पना का परिचय (Introduction & Context)" if is_hindi else "Introduction & Context",
                    "duration": "10 मिनट" if is_hindi else "10 mins",
                    "teacher_action": f"{topic_name} की सरल परिभाषा बोर्ड पर लिखना।" if is_hindi else f"Write simple definition and key rules of {topic_name} on board.",
                    "student_activity": "छात्र मुख्य शब्दों को अपनी कॉपी में नोट करेंगे।" if is_hindi else "Students copy definitions and key vocabulary."
                },
                {
                    "step_number": 2,
                    "title": "व्यावहारिक प्रदर्शन (Practical Demonstration)" if is_hindi else "Practical Demonstration",
                    "duration": "20 मिनट" if is_hindi else "20 mins",
                    "teacher_action": "दो सरल उदाहरणों के माध्यम से सिद्धांत का प्रमाण देना।" if is_hindi else "Demonstrate key principles with 2 straightforward examples.",
                    "student_activity": "छात्र शिक्षक के साथ कदम-दर-कदम प्रश्नों को हल करेंगे।" if is_hindi else "Students follow along step-by-step."
                },
                {
                    "step_number": 3,
                    "title": "समीक्षा एवं सारांश (Review & Wrap-up)" if is_hindi else "Review & Wrap-up",
                    "duration": "10 मिनट" if is_hindi else "10 mins",
                    "teacher_action": "मुख्य बिंदुओं की पुनरावृत्ति एवं शंका समाधान।" if is_hindi else "Recap key takeaways and answer student doubts.",
                    "student_activity": "विद्यार्थी 2 त्वरित मौखिक प्रश्नों के उत्तर देंगे।" if is_hindi else "Students respond to quick verbal check questions."
                }
            ]
            activity = {
                "title": f"{topic_name} समूह अन्वेषण (Group Exploration Activity)" if is_hindi else f"{topic_name} Group Activity",
                "materials": "कक्षा का ब्लैकबोर्ड, चॉक, नोटबुक" if is_hindi else "Blackboard, chalk, notebooks",
                "instructions": "4-4 छात्रों के समूह बनाकर उन्हें एक परिस्थिति दें और हल निकालने को कहें।" if is_hindi else "Divide class into small groups to analyze and solve a scenario together.",
                "expected_outcome": "सहपाठी अधिगम (Peer learning) के माध्यम से छात्रों का आत्मविश्वास बढ़ेगा।" if is_hindi else "Students build confidence through peer-to-peer discussion."
            }
            misconceptions = [
                {
                    "misconception": "छात्र केवल सूत्र रटते हैं और उसके पीछे का कारण नहीं समझते।" if is_hindi else "Students memorize formulas without understanding the physical mechanism.",
                    "clarification": "हमेशा व्यावहारिक उदाहरण देकर सूत्र का अर्थ समझाएं।" if is_hindi else "Anchor the formula to a concrete physical or numerical scenario."
                }
            ]
            assessments = [
                {
                    "question": f"{topic_name} की मुख्य विशेषता क्या है?" if is_hindi else f"What is the most crucial characteristic of {topic_name}?",
                    "expected_answer": "NCERT पाठ्यपुस्तक आधारित परिभाषा।" if is_hindi else "NCERT textbook standard definition."
                }
            ]
            hw = f"पाठ्यपुस्तक के अभ्यास प्रश्न 1 से 3 हल करें।" if is_hindi else "Solve textbook exercise questions 1 through 3."

        return {
            "topic_name": topic_name,
            "subject": subject,
            "class_level": class_level,
            "duration_minutes": duration_minutes,
            "language": language,
            "ai_engine": "MockProvider (Offline Resilient Mode)",
            "objectives": obj_list,
            "rural_hook": hook,
            "teaching_steps": steps,
            "classroom_activity": activity,
            "common_misconceptions": misconceptions,
            "quick_assessments": assessments,
            "homework": hw
        }
