from transformers import BertTokenizer, BertForSequenceClassification
import torch

class BertNLPModel:
    def __init__(self):
        self.tokenizer = BertTokenizer.from_pretrained('/nlptown/bert-base-multilingual-uncased-sentiment')
        self.model = BertForSequenceClassification.from_pretrained('/nlptown/bert-base-multilingual-uncased-sentiment')

    def analyze_text(self, text):
        inputs = self.tokenizer(text, return_tensors='pt', padding=True, truncation=True)
        with torch.no_grad():
            outputs = self.model(**inputs)
            logits = outputs.logits
            probabilities = torch.softmax(logits, dim=-1)
            prediction = torch.argmax(probabilities, dim=-1)
        return prediction.item(), probabilities.numpy().tolist()
