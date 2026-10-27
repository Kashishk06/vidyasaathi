import os
import re
from pathlib import Path
from typing import List, Dict, Any
from app.config import settings

class SyllabusRetriever:
    """
    Lightweight, robust syllabus retriever using TF-IDF / vector search over
    chunked NCERT/State Board syllabus documents in backend/data/syllabus/.
    Runs completely offline for rural/low-connectivity environments.
    """
    def __init__(self, syllabus_dir: str = settings.SYLLABUS_DIR):
        self.syllabus_dir = Path(syllabus_dir)
        self.chunks: List[Dict[str, Any]] = []
        self.vectorizer = None
        self.tfidf_matrix = None
        self._initialize()

    def _initialize(self):
        self.chunks = []
        if not self.syllabus_dir.exists():
            return

        for file_path in self.syllabus_dir.glob("*.txt"):
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    content = f.read()
                
                # Split content into chapter sections or paragraphs
                sections = re.split(r'\n(?=##\s+)', content)
                for sec in sections:
                    sec = sec.strip()
                    if not sec:
                        continue
                    
                    # Extract chapter name if present
                    first_line = sec.split("\n")[0]
                    chapter_name = first_line.replace("#", "").strip() if first_line.startswith("#") else file_path.stem
                    
                    # Further split large sections into manageable paragraphs
                    paragraphs = sec.split("\n\n")
                    for p in paragraphs:
                        p_clean = p.strip()
                        if len(p_clean) > 40:
                            self.chunks.append({
                                "text": p_clean,
                                "chapter": chapter_name,
                                "source": file_path.name
                            })
            except Exception as e:
                print(f"[Retriever] Warning loading {file_path}: {e}")

        if not self.chunks:
            # Fallback basic knowledge if files couldn't be loaded
            self.chunks.append({
                "text": "Fractions represent parts of a whole. Adding fractions requires a common denominator.",
                "chapter": "Class 8 Mathematics: Fractions",
                "source": "fallback"
            })

        # Try building TF-IDF index
        try:
            from sklearn.feature_extraction.text import TfidfVectorizer
            corpus = [c["text"] for c in self.chunks]
            self.vectorizer = TfidfVectorizer(stop_words="english")
            self.tfidf_matrix = self.vectorizer.fit_transform(corpus)
        except Exception as e:
            print(f"[Retriever] Note: Using lexical overlap matcher ({e})")
            self.vectorizer = None
            self.tfidf_matrix = None

    def retrieve(self, query: str, top_k: int = 3) -> List[Dict[str, Any]]:
        """
        Retrieves top_k most relevant syllabus chunks for a given query.
        """
        if not self.chunks:
            return []

        if self.vectorizer is not None and self.tfidf_matrix is not None:
            try:
                from sklearn.metrics.pairwise import cosine_similarity
                query_vec = self.vectorizer.transform([query])
                scores = cosine_similarity(query_vec, self.tfidf_matrix).flatten()
                top_indices = scores.argsort()[::-1][:top_k]
                
                results = []
                for idx in top_indices:
                    item = dict(self.chunks[idx])
                    item["score"] = float(scores[idx])
                    results.append(item)
                return results
            except Exception:
                pass

        # Fallback keyword overlap scoring
        query_words = set(re.findall(r'\w+', query.lower()))
        scored = []
        for c in self.chunks:
            words = set(re.findall(r'\w+', c["text"].lower()))
            overlap = len(query_words.intersection(words))
            score = overlap / max(1, len(query_words))
            scored.append((score, c))
        
        scored.sort(key=lambda x: x[0], reverse=True)
        results = []
        for score, c in scored[:top_k]:
            item = dict(c)
            item["score"] = float(score)
            results.append(item)
        return results

retriever = SyllabusRetriever()
