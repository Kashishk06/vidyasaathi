import json
from datetime import datetime, timedelta, timezone
from app.database import engine, SessionLocal, Base
from app.models.models import User, ClassRoom, Enrollment, Topic, Question, Attempt, Mastery, ParentStudent
from app.auth import get_password_hash

def seed_database():
    print("[Seed] Resetting and creating database tables...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    default_password_hash = get_password_hash("password123")

    print("[Seed] Creating Teacher and Students...")
    # 1. Teacher
    teacher = User(
        name="सुनीता शर्मा (Sunita Sharma)",
        phone_or_email="teacher@vidyasaathi.in",
        password_hash=default_password_hash,
        role="teacher",
        class_level=8,
        language="hi"
    )
    db.add(teacher)
    db.commit()
    db.refresh(teacher)

    # 2. Classroom
    classroom = ClassRoom(
        name="कक्षा 8 - ज्ञान निकेतन (Class 8-A)",
        join_code="VSA801",
        teacher_id=teacher.id
    )
    db.add(classroom)
    db.commit()
    db.refresh(classroom)

    # 3. 5 Students
    students_data = [
        {"name": "आरव पटेल (Aarav Patel)", "contact": "aarav@vidyasaathi.in", "lang": "hi"},
        {"name": "मीरा बाई (Meera Bai)", "contact": "meera@vidyasaathi.in", "lang": "hi"},
        {"name": "राजेश कुमार (Rajesh Kumar)", "contact": "rajesh@vidyasaathi.in", "lang": "en"},
        {"name": "अनन्या रॉय (Ananya Roy)", "contact": "ananya@vidyasaathi.in", "lang": "hi"},
        {"name": "सुरेश गोंड (Suresh Gond)", "contact": "suresh@vidyasaathi.in", "lang": "hi"},
    ]

    students = []
    for s_info in students_data:
        student = User(
            name=s_info["name"],
            phone_or_email=s_info["contact"],
            password_hash=default_password_hash,
            role="student",
            class_level=8,
            language=s_info["lang"]
        )
        db.add(student)
        db.commit()
        db.refresh(student)
        students.append(student)

        # Enroll into classroom
        enrollment = Enrollment(student_id=student.id, classroom_id=classroom.id)
        db.add(enrollment)

    # 4. Parent / Guardian (Linked to Aarav Patel)
    parent = User(
        name="रमेश पटेल (Ramesh Patel - Parent)",
        phone_or_email="parent@vidyasaathi.in",
        password_hash=default_password_hash,
        role="parent",
        language="hi"
    )
    db.add(parent)
    db.commit()
    db.refresh(parent)

    # Link parent to first student (Aarav)
    parent_link = ParentStudent(parent_id=parent.id, student_id=students[0].id)
    db.add(parent_link)

    # 5. Super Admin
    super_admin = User(
        name="महा-प्रशासक (Super Admin)",
        phone_or_email="superadmin@vidyasaathi.in",
        password_hash=default_password_hash,
        role="super_admin",
        language="hi"
    )
    db.add(super_admin)
    db.commit()

    print("[Seed] Creating Topics...")
    topics_meta = [
        {"subject": "Math", "chapter": "Chapter 1: Fractions and Rational Numbers", "name": "Fractions (भिन्न)"},
        {"subject": "Math", "chapter": "Chapter 2: Percentages and Commercial Math", "name": "Percentages (प्रतिशत)"},
        {"subject": "Math", "chapter": "Chapter 3: Algebra Basics and Simple Equations", "name": "Algebra Basics (बीजगणित)"},
        {"subject": "Math", "chapter": "Chapter 4: Geometry Basics and Mensuration", "name": "Geometry Basics (ज्यामिति)"},
        {"subject": "Science", "chapter": "Chapter 1: Photosynthesis and Plant Nutrition", "name": "Photosynthesis (प्रकाश संश्लेषण)"},
        {"subject": "Science", "chapter": "Chapter 2: Force, Pressure, and Motion", "name": "Force and Motion (बल और गति)"},
    ]

    topic_objs = {}
    for t_data in topics_meta:
        topic = Topic(
            subject=t_data["subject"],
            class_level=8,
            chapter=t_data["chapter"],
            name=t_data["name"]
        )
        db.add(topic)
        db.commit()
        db.refresh(topic)
        topic_objs[t_data["name"]] = topic

    print("[Seed] Creating 10+ questions per topic (Hindi & English)...")

    # Comprehensive question bank with rural examples
    questions_data = [
        # --- TOPIC 1: Fractions (भिन्न) ---
        {
            "topic": "Fractions (भिन्न)",
            "text": "यदि एक खेत को 4 बराबर हिस्सों में बाँटकर 1 हिस्से में सरसों बोई गई, तो सरसों का हिस्सा भिन्न में क्या होगा?",
            "options": ["1/4", "1/2", "3/4", "4/1"],
            "correct_index": 0,
            "difficulty": "easy",
            "language": "hi",
            "explanation": "कुल बराबर हिस्से 4 हैं, जिनमें से 1 हिस्से में सरसों है। इसलिए भिन्न 1/4 (एक चौथाई) है।"
        },
        {
            "topic": "Fractions (भिन्न)",
            "text": "A farmer divides 1 bag of wheat seeds equally among 3 workers. What fraction does each worker receive?",
            "options": ["1/3", "3/1", "2/3", "1/2"],
            "correct_index": 0,
            "difficulty": "easy",
            "language": "en",
            "explanation": "Dividing 1 whole bag into 3 equal portions gives 1/3 to each worker."
        },
        {
            "topic": "Fractions (भिन्न)",
            "text": "2/5 और 1/5 को जोड़ने पर क्या प्राप्त होगा?",
            "options": ["3/5", "3/10", "2/10", "1/5"],
            "correct_index": 0,
            "difficulty": "easy",
            "language": "hi",
            "explanation": "जब हर (denominator) समान हो, तो केवल अंशों को जोड़ते हैं: 2 + 1 = 3। उत्तर 3/5 है।"
        },
        {
            "topic": "Fractions (भिन्न)",
            "text": "What is the value of 1/2 + 1/4?",
            "options": ["3/4", "2/6", "1/6", "2/4"],
            "correct_index": 0,
            "difficulty": "medium",
            "language": "en",
            "explanation": "Convert 1/2 to common denominator 2/4. Then 2/4 + 1/4 = 3/4."
        },
        {
            "topic": "Fractions (भिन्न)",
            "text": "3/4 में से 1/4 घटाने पर क्या बचेगा?",
            "options": ["2/4 (या 1/2)", "1/4", "3/8", "2/8"],
            "correct_index": 0,
            "difficulty": "medium",
            "language": "hi",
            "explanation": "3/4 - 1/4 = (3 - 1)/4 = 2/4। इसे सरल करने पर 1/2 (आधा) बनता है।"
        },
        {
            "topic": "Fractions (भिन्न)",
            "text": "What is the result of multiplying (2/3) * (3/4)?",
            "options": ["1/2", "5/7", "6/7", "2/4"],
            "correct_index": 0,
            "difficulty": "medium",
            "language": "en",
            "explanation": "(2*3) / (3*4) = 6/12 = 1/2."
        },
        {
            "topic": "Fractions (भिन्न)",
            "text": "5/6 का व्युत्क्रम (reciprocal या उल्टा) क्या होगा?",
            "options": ["6/5", "-5/6", "1/6", "5/1"],
            "correct_index": 0,
            "difficulty": "easy",
            "language": "hi",
            "explanation": "किसी भिन्न का व्युत्क्रम अंश और हर की अदला-बदली करके निकाला जाता है: 5/6 का व्युत्क्रम 6/5 है।"
        },
        {
            "topic": "Fractions (भिन्न)",
            "text": "If (3/4) of a village water tank holds 600 liters, what is the total capacity of the tank?",
            "options": ["800 liters", "750 liters", "900 liters", "650 liters"],
            "correct_index": 0,
            "difficulty": "hard",
            "language": "en",
            "explanation": "Let total capacity be C. (3/4)*C = 600 -> C = (600 * 4) / 3 = 800 liters."
        },
        {
            "topic": "Fractions (भिन्न)",
            "text": "2/3 को 4/9 से भाग (divide) करने पर क्या परिणाम मिलेगा?",
            "options": ["3/2", "8/27", "6/12", "1/3"],
            "correct_index": 0,
            "difficulty": "hard",
            "language": "hi",
            "explanation": "(2/3) / (4/9) = (2/3) * (9/4) = 18/12 = 3/2 (डेढ़)।"
        },
        {
            "topic": "Fractions (भिन्न)",
            "text": "Which fraction is the largest among 2/3, 3/4, and 1/2?",
            "options": ["3/4", "2/3", "1/2", "All are equal"],
            "correct_index": 0,
            "difficulty": "medium",
            "language": "en",
            "explanation": "Converting to decimals: 3/4 = 0.75, 2/3 = 0.66, 1/2 = 0.50. So 3/4 is largest."
        },

        # --- TOPIC 2: Percentages (प्रतिशत) ---
        {
            "topic": "Percentages (प्रतिशत)",
            "text": "100 में से 25 को प्रतिशत के रूप में कैसे लिखा जाएगा?",
            "options": ["25%", "2.5%", "0.25%", "250%"],
            "correct_index": 0,
            "difficulty": "easy",
            "language": "hi",
            "explanation": "प्रतिशत का अर्थ ही 'प्रति सौ' होता है। 100 में से 25 = 25%।"
        },
        {
            "topic": "Percentages (प्रतिशत)",
            "text": "Convert the fraction 3/5 into a percentage.",
            "options": ["60%", "35%", "50%", "75%"],
            "correct_index": 0,
            "difficulty": "easy",
            "language": "en",
            "explanation": "To convert fraction to percentage, multiply by 100: (3/5) * 100 = 60%."
        },
        {
            "topic": "Percentages (प्रतिशत)",
            "text": "एक किसान ने 500 रुपये में खाद खरीदी और 600 रुपये में बेची। उसे कितने प्रतिशत लाभ हुआ?",
            "options": ["20%", "25%", "15%", "10%"],
            "correct_index": 0,
            "difficulty": "medium",
            "language": "hi",
            "explanation": "लाभ = 600 - 500 = 100 रुपये। लाभ % = (100 / 500) * 100 = 20%।"
        },
        {
            "topic": "Percentages (प्रतिशत)",
            "text": "What is 15% of 200 quintals of rice?",
            "options": ["30 quintals", "25 quintals", "15 quintals", "35 quintals"],
            "correct_index": 0,
            "difficulty": "medium",
            "language": "en",
            "explanation": "(15/100) * 200 = 15 * 2 = 30 quintals."
        },
        {
            "topic": "Percentages (प्रतिशत)",
            "text": "यदि किसी वस्तु का अंकित मूल्य 1000 रुपये है और उस पर 10% की छूट है, तो विक्रय मूल्य क्या होगा?",
            "options": ["900 रुपये", "910 रुपये", "850 रुपये", "950 रुपये"],
            "correct_index": 0,
            "difficulty": "medium",
            "language": "hi",
            "explanation": "छूट = 10% of 1000 = 100 रुपये। विक्रय मूल्य = 1000 - 100 = 900 रुपये।"
        },
        {
            "topic": "Percentages (प्रतिशत)",
            "text": "If Ramesh scored 40 out of 50 in science test, what is his percentage?",
            "options": ["80%", "75%", "85%", "90%"],
            "correct_index": 0,
            "difficulty": "easy",
            "language": "en",
            "explanation": "(40/50) * 100 = 40 * 2 = 80%."
        },
        {
            "topic": "Percentages (प्रतिशत)",
            "text": "गांव की आबादी 2000 से बढ़कर 2200 हो गई। आबादी में कितने प्रतिशत वृद्धि हुई?",
            "options": ["10%", "20%", "5%", "12%"],
            "correct_index": 0,
            "difficulty": "hard",
            "language": "hi",
            "explanation": "वृद्धि = 2200 - 2000 = 200। वृद्धि % = (200 / 2000) * 100 = 10%।"
        },
        {
            "topic": "Percentages (प्रतिशत)",
            "text": "A shopkeeper bought a solar lamp for Rs 800 and sold it at a 10% loss. What was the selling price?",
            "options": ["Rs 720", "Rs 750", "Rs 700", "Rs 680"],
            "correct_index": 0,
            "difficulty": "hard",
            "language": "en",
            "explanation": "Loss = 10% of 800 = 80. Selling price = 800 - 80 = Rs 720."
        },
        {
            "topic": "Percentages (प्रतिशत)",
            "text": "0.45 को प्रतिशत में बदलें।",
            "options": ["45%", "4.5%", "0.45%", "450%"],
            "correct_index": 0,
            "difficulty": "easy",
            "language": "hi",
            "explanation": "दशमलव को प्रतिशत में बदलने के लिए 100 से गुणा करें: 0.45 * 100 = 45%।"
        },
        {
            "topic": "Percentages (प्रतिशत)",
            "text": "In a village school of 300 students, 60% are girls. How many boys are there in the school?",
            "options": ["120 boys", "150 boys", "180 boys", "100 boys"],
            "correct_index": 0,
            "difficulty": "hard",
            "language": "en",
            "explanation": "Boys percentage = 100% - 60% = 40%. Number of boys = (40/100) * 300 = 120."
        },

        # --- TOPIC 3: Algebra Basics (बीजगणित) ---
        {
            "topic": "Algebra Basics (बीजगणित)",
            "text": "समीकरण x + 5 = 12 में x का मान क्या होगा?",
            "options": ["7", "6", "17", "5"],
            "correct_index": 0,
            "difficulty": "easy",
            "language": "hi",
            "explanation": "x = 12 - 5 = 7।"
        },
        {
            "topic": "Algebra Basics (बीजगणित)",
            "text": "Solve for y: 2y = 16.",
            "options": ["8", "14", "18", "4"],
            "correct_index": 0,
            "difficulty": "easy",
            "language": "en",
            "explanation": "Divide both sides by 2: y = 16 / 2 = 8."
        },
        {
            "topic": "Algebra Basics (बीजगणित)",
            "text": "यदि 3x - 4 = 11 हो, तो x का मान क्या है?",
            "options": ["5", "3", "7", "4"],
            "correct_index": 0,
            "difficulty": "medium",
            "language": "hi",
            "explanation": "3x = 11 + 4 = 15 -> x = 15 / 3 = 5।"
        },
        {
            "topic": "Algebra Basics (बीजगणित)",
            "text": "If a pencil costs x rupees and an eraser costs 5 rupees, what is the total cost of 3 pencils and 1 eraser?",
            "options": ["3x + 5", "3 + 5x", "8x", "15x"],
            "correct_index": 0,
            "difficulty": "medium",
            "language": "en",
            "explanation": "3 pencils cost 3*x. Adding eraser gives expression 3x + 5."
        },
        {
            "topic": "Algebra Basics (बीजगणित)",
            "text": "समीकरण 5m - 10 = 2m + 8 में m का मान निकालें।",
            "options": ["6", "4", "5", "8"],
            "correct_index": 0,
            "difficulty": "hard",
            "language": "hi",
            "explanation": "5m - 2m = 8 + 10 -> 3m = 18 -> m = 18 / 3 = 6।"
        },
        {
            "topic": "Algebra Basics (बीजगणित)",
            "text": "Solve the equation: x / 4 = 6.",
            "options": ["24", "10", "2", "1.5"],
            "correct_index": 0,
            "difficulty": "easy",
            "language": "en",
            "explanation": "Multiply both sides by 4: x = 6 * 4 = 24."
        },
        {
            "topic": "Algebra Basics (बीजगणित)",
            "text": "व्यंजक 2(x + 3) का प्रसारित रूप (expanded form) क्या होगा?",
            "options": ["2x + 6", "2x + 3", "x + 6", "5x"],
            "correct_index": 0,
            "difficulty": "medium",
            "language": "hi",
            "explanation": "कोष्ठक के प्रत्येक पद को 2 से गुणा करें: 2*x + 2*3 = 2x + 6।"
        },
        {
            "topic": "Algebra Basics (बीजगणित)",
            "text": "The perimeter of a square is 4x. If perimeter is 36 cm, what is the side length x?",
            "options": ["9 cm", "8 cm", "6 cm", "12 cm"],
            "correct_index": 0,
            "difficulty": "medium",
            "language": "en",
            "explanation": "4x = 36 -> x = 36 / 4 = 9 cm."
        },
        {
            "topic": "Algebra Basics (बीजगणित)",
            "text": "यदि किसी संख्या के दोगुने में 7 जोड़ने पर 25 मिलता है, तो वह संख्या क्या है?",
            "options": ["9", "8", "11", "7"],
            "correct_index": 0,
            "difficulty": "hard",
            "language": "hi",
            "explanation": "समीकरण: 2x + 7 = 25 -> 2x = 18 -> x = 9।"
        },
        {
            "topic": "Algebra Basics (बीजगणित)",
            "text": "Solve: 4(x - 2) = 16.",
            "options": ["6", "4", "8", "5"],
            "correct_index": 0,
            "difficulty": "hard",
            "language": "en",
            "explanation": "x - 2 = 16 / 4 = 4 -> x = 4 + 2 = 6."
        },

        # --- TOPIC 4: Geometry Basics (ज्यामिति) ---
        {
            "topic": "Geometry Basics (ज्यामिति)",
            "text": "एक आयताकार (rectangular) खेत की लंबाई 20 मीटर और चौड़ाई 10 मीटर है। इसका परिमाप (Perimeter) क्या होगा?",
            "options": ["60 मीटर", "200 वर्ग मीटर", "30 मीटर", "50 मीटर"],
            "correct_index": 0,
            "difficulty": "easy",
            "language": "hi",
            "explanation": "परिमाप = 2 * (लंबाई + चौड़ाई) = 2 * (20 + 10) = 2 * 30 = 60 मीटर।"
        },
        {
            "topic": "Geometry Basics (ज्यामिति)",
            "text": "What is the area of a square field with side length 8 meters?",
            "options": ["64 sq meters", "32 meters", "16 sq meters", "48 sq meters"],
            "correct_index": 0,
            "difficulty": "easy",
            "language": "en",
            "explanation": "Area of square = side * side = 8 * 8 = 64 sq meters."
        },
        {
            "topic": "Geometry Basics (ज्यामिति)",
            "text": "त्रिभुज के तीनों आंतरिक कोणों का योग कितना होता है?",
            "options": ["180°", "360°", "90°", "270°"],
            "correct_index": 0,
            "difficulty": "easy",
            "language": "hi",
            "explanation": "किसी भी त्रिभुज के तीनों कोणों का कुल योग हमेशा 180 डिग्री होता है।"
        },
        {
            "topic": "Geometry Basics (ज्यामिति)",
            "text": "What is the circumference formula of a circle with radius r?",
            "options": ["2 * pi * r", "pi * r^2", "4 * pi * r", "pi * d^2"],
            "correct_index": 0,
            "difficulty": "medium",
            "language": "en",
            "explanation": "Circumference of a circle is 2 * pi * r, while area is pi * r^2."
        },
        {
            "topic": "Geometry Basics (ज्यामिति)",
            "text": "यदि एक समकोण त्रिभुज (right-angled triangle) का आधार 6 सेमी और ऊँचाई 8 सेमी है, तो उसका क्षेत्रफल क्या होगा?",
            "options": ["24 वर्ग सेमी", "48 वर्ग सेमी", "14 वर्ग सेमी", "28 वर्ग सेमी"],
            "correct_index": 0,
            "difficulty": "medium",
            "language": "hi",
            "explanation": "क्षेत्रफल = 1/2 * आधार * ऊँचाई = 1/2 * 6 * 8 = 24 वर्ग सेमी।"
        },
        {
            "topic": "Geometry Basics (ज्यामिति)",
            "text": "An angle measuring 45 degrees is classified as which type of angle?",
            "options": ["Acute angle", "Right angle", "Obtuse angle", "Straight angle"],
            "correct_index": 0,
            "difficulty": "easy",
            "language": "en",
            "explanation": "An angle less than 90 degrees is an acute angle."
        },
        {
            "topic": "Geometry Basics (ज्यामिति)",
            "text": "एक वृत्ताकार कुएं का व्यास (diameter) 14 मीटर है। इसकी परिधि (circumference) क्या होगी? (pi = 22/7)",
            "options": ["44 मीटर", "28 मीटर", "154 वर्ग मीटर", "88 मीटर"],
            "correct_index": 0,
            "difficulty": "hard",
            "language": "hi",
            "explanation": "त्रिज्या r = 14/2 = 7 मीटर। परिधि = 2 * (22/7) * 7 = 44 मीटर।"
        },
        {
            "topic": "Geometry Basics (ज्यामिति)",
            "text": "How many meters of barbed wire are required to fence a square garden of side 25 meters with 2 rounds of wire?",
            "options": ["200 meters", "100 meters", "50 meters", "250 meters"],
            "correct_index": 0,
            "difficulty": "hard",
            "language": "en",
            "explanation": "Perimeter = 4 * 25 = 100 meters. 2 rounds require 100 * 2 = 200 meters."
        },
        {
            "topic": "Geometry Basics (ज्यामिति)",
            "text": "एक चतुर्भुज (quadrilateral) के चारों कोणों का योग कितना होता है?",
            "options": ["360°", "180°", "540°", "270°"],
            "correct_index": 0,
            "difficulty": "medium",
            "language": "hi",
            "explanation": "किसी भी चतुर्भुज के चारों अंतःकोणों का योग हमेशा 360 डिग्री होता है।"
        },
        {
            "topic": "Geometry Basics (ज्यामिति)",
            "text": "The length of a room is 5 m and breadth is 4 m. How many 1m x 1m square tiles are needed to cover the floor?",
            "options": ["20 tiles", "18 tiles", "25 tiles", "9 tiles"],
            "correct_index": 0,
            "difficulty": "medium",
            "language": "en",
            "explanation": "Floor area = 5 * 4 = 20 sq meters. Tile area = 1 sq meter. Tiles required = 20 / 1 = 20."
        },

        # --- TOPIC 5: Photosynthesis (प्रकाश संश्लेषण) ---
        {
            "topic": "Photosynthesis (प्रकाश संश्लेषण)",
            "text": "हरे पौधे भोजन बनाने के लिए सूर्य के प्रकाश के अलावा वायुमंडल से कौन सी गैस लेते हैं?",
            "options": ["कार्बन डाइऑक्साइड (CO2)", "ऑक्सीजन (O2)", "नाइट्रोजन (N2)", "हीलियम"],
            "correct_index": 0,
            "difficulty": "easy",
            "language": "hi",
            "explanation": "पौधे प्रकाश संश्लेषण के दौरान पत्तियों के रंध्रों से कार्बन डाइऑक्साइड ग्रहण करते हैं।"
        },
        {
            "topic": "Photosynthesis (प्रकाश संश्लेषण)",
            "text": "Which substance in leaves is responsible for absorbing solar energy?",
            "options": ["Chlorophyll", "Hemoglobin", "Cellulose", "Keratin"],
            "correct_index": 0,
            "difficulty": "easy",
            "language": "en",
            "explanation": "Chlorophyll is the green pigment in chloroplasts that absorbs sunlight energy."
        },
        {
            "topic": "Photosynthesis (प्रकाश संश्लेषण)",
            "text": "पौधों में जड़ों द्वारा अवशोषित जल को पत्तियों तक ले जाने वाली नलिकाओं को क्या कहते हैं?",
            "options": ["जाइलम (Xylem)", "फ्लोएम (Phloem)", "स्टोमेटा", "क्लोरोप्लास्ट"],
            "correct_index": 0,
            "difficulty": "medium",
            "language": "hi",
            "explanation": "जाइलम ऊतक मिट्टी से पानी और खनिजों को पत्तियों तक पहुँचाने का कार्य करता है।"
        },
        {
            "topic": "Photosynthesis (प्रकाश संश्लेषण)",
            "text": "What is the primary gas released into the atmosphere as a byproduct of photosynthesis?",
            "options": ["Oxygen", "Carbon dioxide", "Methane", "Hydrogen"],
            "correct_index": 0,
            "difficulty": "easy",
            "language": "en",
            "explanation": "Plants split water molecules during photosynthesis and release oxygen (O2)."
        },
        {
            "topic": "Photosynthesis (प्रकाश संश्लेषण)",
            "text": "पत्तियों की सतह पर गैसों के आदान-प्रदान के लिए पाए जाने वाले छोटे छिद्रों को क्या कहते हैं?",
            "options": ["रंध्र (स्टोमेटा)", "क्लोरोफिल", "जड़ रोम", "शिराएँ"],
            "correct_index": 0,
            "difficulty": "easy",
            "language": "hi",
            "explanation": "स्टोमेटा पत्तियों की निचली सतह पर स्थित सूक्ष्म छिद्र होते हैं जिनसे गैसों का विनिमय होता है।"
        },
        {
            "topic": "Photosynthesis (प्रकाश संश्लेषण)",
            "text": "In which form do plants primarily store the excess glucose produced during photosynthesis?",
            "options": ["Starch", "Protein", "Fat", "Vitamins"],
            "correct_index": 0,
            "difficulty": "medium",
            "language": "en",
            "explanation": "Plants convert synthesized glucose into insoluble starch for long-term storage in leaves, stems, and tubers."
        },
        {
            "topic": "Photosynthesis (प्रकाश संश्लेषण)",
            "text": "यदि किसी पौधे को कई दिनों तक पूरी तरह अंधेरे कमरे में रख दिया जाए, तो क्या होगा?",
            "options": ["प्रकाश संश्लेषण रुक जाएगा और पत्तियाँ पीली पड़ जाएँगी", "पौधा तेजी से बढ़ेगा", "पौधा अधिक ऑक्सीजन छोड़ेगा", "कोई बदलाव नहीं होगा"],
            "correct_index": 0,
            "difficulty": "medium",
            "language": "hi",
            "explanation": "सूर्य के प्रकाश के बिना प्रकाश संश्लेषण संभव नहीं है, भोजन न बनने से पत्तियाँ पीली पड़ जाती हैं।"
        },
        {
            "topic": "Photosynthesis (प्रकाश संश्लेषण)",
            "text": "Which tissue transports the prepared food from leaves to other growing parts of the plant?",
            "options": ["Phloem", "Xylem", "Cortex", "Epidermis"],
            "correct_index": 0,
            "difficulty": "medium",
            "language": "en",
            "explanation": "Phloem vessels transport manufactured food (sucrose) bidirectionally across the plant body."
        },
        {
            "topic": "Photosynthesis (प्रकाश संश्लेषण)",
            "text": "प्रकाश संश्लेषण की सही रासायनिक समीकरण क्या दर्शाती है?",
            "options": ["6CO2 + 6H2O + प्रकाश -> C6H12O6 + 6O2", "C6H12O6 + 6O2 -> 6CO2 + 6H2O", "CO2 + H2O -> CO2 + O2", "CO2 + N2 -> ग्लूकोज"],
            "correct_index": 0,
            "difficulty": "hard",
            "language": "hi",
            "explanation": "कार्बन डाइऑक्साइड और पानी सूर्य के प्रकाश में मिलकर ग्लूकोज और ऑक्सीजन बनाते हैं।"
        },
        {
            "topic": "Photosynthesis (प्रकाश संश्लेषण)",
            "text": "Why do farmers avoid overcrowded sowing and ensure proper spacing between crop rows?",
            "options": ["To ensure each plant receives adequate sunlight, air, and soil moisture", "To reduce seeds cost only", "To increase weeds", "Because tractors require wide rows"],
            "correct_index": 0,
            "difficulty": "hard",
            "language": "en",
            "explanation": "Adequate spacing ensures individual plants get maximum sunlight for photosynthesis without shading neighbors."
        },

        # --- TOPIC 6: Force and Motion (बल और गति) ---
        {
            "topic": "Force and Motion (बल और गति)",
            "text": "अंतर्राष्ट्रीय मानक (SI) प्रणाली में 'बल' (Force) का मात्रक क्या है?",
            "options": ["न्यूटन (Newton)", "पास्कल", "जूल", "मीटर"],
            "correct_index": 0,
            "difficulty": "easy",
            "language": "hi",
            "explanation": "बल का SI मात्रक न्यूटन (N) होता है।"
        },
        {
            "topic": "Force and Motion (बल और गति)",
            "text": "Which of the following is an example of a contact force?",
            "options": ["Friction", "Gravitational force", "Magnetic force", "Electrostatic force"],
            "correct_index": 0,
            "difficulty": "easy",
            "language": "en",
            "explanation": "Frictional force requires physical physical contact between two surfaces."
        },
        {
            "topic": "Force and Motion (बल और गति)",
            "text": "पेड़ से पका हुआ आम जमीन की ओर क्यों गिरता है?",
            "options": ["गुरुत्वाकर्षण बल के कारण", "चुंबकीय बल के कारण", "घर्षण बल के कारण", "वायुमंडलीय दाब के कारण"],
            "correct_index": 0,
            "difficulty": "easy",
            "language": "hi",
            "explanation": "पृथ्वी प्रत्येक वस्तु को अपने केंद्र की ओर गुरुत्वाकर्षण बल से खींचती है।"
        },
        {
            "topic": "Force and Motion (बल और गति)",
            "text": "Why are tractor tires made very wide compared to regular car tires?",
            "options": ["To increase surface area and reduce pressure, preventing sinking in mud", "To make them look bigger", "To increase speed", "To save rubber"],
            "correct_index": 0,
            "difficulty": "medium",
            "language": "en",
            "explanation": "Pressure = Force / Area. Wider tires increase area, reducing pressure so the tractor does not sink in wet fields."
        },
        {
            "topic": "Force and Motion (बल और गति)",
            "text": "कुल्हाड़ी या फावड़े की धार को तेज (पतली) क्यों रखा जाता है?",
            "options": ["क्षेत्रफल घटाकर दाब बढ़ाने के लिए ताकि कटाई आसान हो", "वजन बढ़ाने के लिए", "ताकि उस पर जंग न लगे", "दिखने में अच्छा लगे"],
            "correct_index": 0,
            "difficulty": "medium",
            "language": "hi",
            "explanation": "धार पतली होने से संपर्क क्षेत्रफल कम होता है, जिससे समान बल लगाने पर भी अधिक दाब उत्पन्न होता है।"
        },
        {
            "topic": "Force and Motion (बल और गति)",
            "text": "What is the formula to calculate speed?",
            "options": ["Speed = Distance / Time", "Speed = Distance * Time", "Speed = Time / Distance", "Speed = Force * Area"],
            "correct_index": 0,
            "difficulty": "easy",
            "language": "en",
            "explanation": "Speed is defined as the distance covered per unit of time (meters/second or km/hour)."
        },
        {
            "topic": "Force and Motion (बल और गति)",
            "text": "गीली मिट्टी या बर्फ पर चलना सूखा पक्की सड़क की तुलना में कठिन क्यों होता है?",
            "options": ["गीली सतह पर घर्षण (friction) बहुत कम हो जाता है", "गुरुत्वाकर्षण बढ़ जाता है", "वायु का दाब घट जाता है", "जमीन ऊपर उठने लगती है"],
            "correct_index": 0,
            "difficulty": "medium",
            "language": "hi",
            "explanation": "चलने के लिए पैरों और जमीन के बीच घर्षण की आवश्यकता होती है। गीली मिट्टी पर घर्षण कम होने से पैर फिसलते हैं।"
        },
        {
            "topic": "Force and Motion (बल और गति)",
            "text": "If a force of 100 Newtons is applied on an area of 2 square meters, what is the resulting pressure?",
            "options": ["50 Pascals", "200 Pascals", "25 Pascals", "100 Pascals"],
            "correct_index": 0,
            "difficulty": "medium",
            "language": "en",
            "explanation": "Pressure = Force / Area = 100 N / 2 m^2 = 50 Pascals (N/m^2)."
        },
        {
            "topic": "Force and Motion (बल और गति)",
            "text": "बैलगाड़ी के पहियों के धुरों (axles) में बॉल-बेयरिंग (ball bearings) क्यों लगाए जाते हैं?",
            "options": ["घर्षण कम करके पहिये को आसानी से घुमाने के लिए", "पहिये का वजन बढ़ाने के लिए", "पहिये को मजबूत दिखाने के लिए", "पहिये को रोकने के लिए"],
            "correct_index": 0,
            "difficulty": "hard",
            "language": "hi",
            "explanation": "रोलिंग घर्षण स्लाइडिंग घर्षण से काफी कम होता है, इसलिए बेयरिंग लगाने से घर्षण बहुत कम हो जाता है।"
        },
        {
            "topic": "Force and Motion (बल और गति)",
            "text": "A bullock cart travels 30 kilometers in 3 hours. What is its average speed?",
            "options": ["10 km/h", "15 km/h", "90 km/h", "5 km/h"],
            "correct_index": 0,
            "difficulty": "easy",
            "language": "en",
            "explanation": "Speed = Distance / Time = 30 km / 3 hours = 10 km/h."
        }
    ]

    saved_questions = []
    for q_data in questions_data:
        topic_obj = topic_objs[q_data["topic"]]
        q = Question(
            topic_id=topic_obj.id,
            text=q_data["text"],
            options_json=json.dumps(q_data["options"]),
            correct_index=q_data["correct_index"],
            difficulty=q_data["difficulty"],
            language=q_data["language"],
            explanation=q_data["explanation"],
            status="approved",
            source="curated"
        )
        db.add(q)
        saved_questions.append(q)

    # Add 2 pending questions for Teacher Review demonstration
    pending_q1 = Question(
        topic_id=topic_objs["Fractions (भिन्न)"].id,
        text="[AI Generated] यदि एक तरबूज को 8 बराबर फांकों में काटा जाए और 3 फांकें खा ली जाएँ, तो कितना हिस्सा बचा?",
        options_json=json.dumps(["5/8", "3/8", "1/2", "8/5"]),
        correct_index=0,
        difficulty="easy",
        language="hi",
        explanation="8 में से 3 फांकें खाने के बाद 5 फांकें बचेंगी, इसलिए बचा हुआ हिस्सा 5/8 है।",
        status="pending",
        source="ai_generated"
    )
    pending_q2 = Question(
        topic_id=topic_objs["Photosynthesis (प्रकाश संश्लेषण)"].id,
        text="[AI Generated] Which organelle inside plant leaf cells performs photosynthesis?",
        options_json=json.dumps(["Chloroplast", "Mitochondria", "Ribosome", "Nucleus"]),
        correct_index=0,
        difficulty="medium",
        language="en",
        explanation="Chloroplasts contain chlorophyll and are the sites of photosynthesis.",
        status="pending",
        source="ai_generated"
    )
    db.add(pending_q1)
    db.add(pending_q2)
    db.commit()

    print("[Seed] Creating sample attempts and realistic masteries for dashboard...")
    now = datetime.now(timezone.utc)

    # Seed attempts and masteries for each student
    # Student 1: Aarav Patel (High Performer)
    # Student 2: Meera Bai (Medium Performer)
    # Student 3: Rajesh Kumar (Struggling with Fractions)
    # Student 4: Ananya Roy (Strong in Science, learning Math)
    # Student 5: Suresh Gond (Inactive, no attempts in 4 days)

    student_profiles = [
        {"student": students[0], "base_acc": 0.85, "active_days": 1, "attempts_count": 18},
        {"student": students[1], "base_acc": 0.65, "active_days": 1, "attempts_count": 14},
        {"student": students[2], "base_acc": 0.45, "active_days": 2, "attempts_count": 10},
        {"student": students[3], "base_acc": 0.70, "active_days": 2, "attempts_count": 12},
        {"student": students[4], "base_acc": 0.40, "active_days": 5, "attempts_count": 4},  # Inactive
    ]

    for p in student_profiles:
        st = p["student"]
        acc = p["base_acc"]
        count = p["attempts_count"]
        days_ago = p["active_days"]

        # Sample attempts
        for i in range(count):
            q = saved_questions[i % len(saved_questions)]
            is_corr = (i % 10) < int(acc * 10)
            chosen_idx = q.correct_index if is_corr else (q.correct_index + 1) % 4
            time_offset = timedelta(days=days_ago, minutes=i * 5)
            attempt_time = now - time_offset

            att = Attempt(
                student_id=st.id,
                question_id=q.id,
                selected_index=chosen_idx,
                is_correct=is_corr,
                time_taken=15 + (i % 25),
                created_at=attempt_time
            )
            db.add(att)

        # Set mastery for each topic realistically
        for t_name, t_obj in topic_objs.items():
            if "Fraction" in t_name:
                m_score = acc * 0.7  # Often weaker
            elif "Science" in t_obj.subject:
                m_score = min(0.95, acc * 1.1)
            else:
                m_score = acc

            mastery = Mastery(
                student_id=st.id,
                topic_id=t_obj.id,
                score=round(max(0.1, min(0.95, m_score)), 2),
                updated_at=now - timedelta(days=days_ago)
            )
            db.add(mastery)

    db.commit()
    db.close()
    print("[Seed] Database seed completed successfully!")
    print("--------------------------------------------------")
    print("1. Student Login:     aarav@vidyasaathi.in      / password123")
    print("2. Teacher Login:     teacher@vidyasaathi.in    / password123")
    print("3. Parent Login:      parent@vidyasaathi.in     / password123")
    print("4. Super Admin Login: superadmin@vidyasaathi.in / password123")
    print("Classroom Join Code:  VSA801")
    print("--------------------------------------------------")

if __name__ == "__main__":
    seed_database()
