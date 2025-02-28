import spacy
from sentence_transformers import SentenceTransformer
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

nlp = spacy.load("en_core_web_sm")

st_model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')

def preprocess_text(text):
    """
    Use spaCy to preprocess text
    """
    doc = nlp(text.lower())
    tokens = [token.lemma_ for token in doc if not token.is_stop and token.is_alpha]
    return " ".join(tokens)

def text_to_vector(text):
    """
    Use SentenceTransformers to vectorize text
    """
    processed = preprocess_text(text)
    embedding = st_model.encode([processed])
    return embedding[0].tolist()

def compute_similarities(query_vec, event_vecs):
    """
    Compute simiarity between query text and event text
    """
    query_arr = np.array([query_vec])
    event_arr = np.array(event_vecs)

    similarities = cosine_similarity(query_arr, event_arr)
    return similarities[0]
