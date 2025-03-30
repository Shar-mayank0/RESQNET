import torch
from transformers import BertTokenizer, BertForSequenceClassification, Trainer, TrainingArguments
from sklearn.model_selection import train_test_split
import logging
from .models import FormattedDisasterData

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class DisasterDataset(torch.utils.data.Dataset):
    def __init__(self, texts, labels, tokenizer, max_length=512):
        self.texts = texts
        self.labels = labels
        self.tokenizer = tokenizer
        self.max_length = max_length

    def __len__(self):
        return len(self.texts)

    def __getitem__(self, idx):
        text = self.texts[idx]
        label = self.labels[idx]
        encoding = self.tokenizer(
            text,
            add_special_tokens=True,
            max_length=self.max_length,
            padding='max_length',
            truncation=True,
            return_tensors='pt'
        )
        return {
            'input_ids': encoding['input_ids'].flatten(),
            'attention_mask': encoding['attention_mask'].flatten(),
            'labels': torch.tensor(label, dtype=torch.long)
        }

def train_bert_model(disaster_type: str, location: str):
    """
    Train a BERT model on the formatted disaster data
    """
    try:
        # Load data
        formatted_data = FormattedDisasterData.objects.filter(disaster_type=disaster_type, location=location)
        texts = [data.combined_text for data in formatted_data]
        labels = [int(data.get_metadata()["severity"]) for data in formatted_data]  # Use helper method

        # Split data
        train_texts, val_texts, train_labels, val_labels = train_test_split(texts, labels, test_size=0.2, random_state=42)

        # Initialize tokenizer and model
        tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
        model = BertForSequenceClassification.from_pretrained('bert-base-uncased', num_labels=11)  # 0-10 severity levels

        # Create datasets
        train_dataset = DisasterDataset(train_texts, train_labels, tokenizer)
        val_dataset = DisasterDataset(val_texts, val_labels, tokenizer)

        # Define training arguments
        training_args = TrainingArguments(
            output_dir='./bert_results',
            num_train_epochs=3,
            per_device_train_batch_size=8,
            per_device_eval_batch_size=8,
            warmup_steps=500,
            weight_decay=0.01,
            logging_dir='./bert_logs',
            logging_steps=10,
            evaluation_strategy="epoch",
            save_strategy="epoch",
            load_best_model_at_end=True,
        )

        # Initialize trainer
        trainer = Trainer(
            model=model,
            args=training_args,
            train_dataset=train_dataset,
            eval_dataset=val_dataset,
        )

        # Train the model
        trainer.train()

        # Save the model
        model.save_pretrained(f"./bert_model_{disaster_type}_{location}")
        tokenizer.save_pretrained(f"./bert_model_{disaster_type}_{location}")

        # Predict on validation set to get the best data sets
        predictions = trainer.predict(val_dataset)
        predicted_labels = predictions.predictions.argmax(-1)
        best_indices = sorted(range(len(predicted_labels)), key=lambda i: predicted_labels[i], reverse=True)[:2]  # Top 2 severity

        best_data = [formatted_data[i] for i in best_indices]
        logger.info(f"Successfully trained BERT model and selected {len(best_data)} best data sets")
        return best_data

    except Exception as e:
        logger.error(f"Error training BERT model: {str(e)}")
        raise

# Test the trainer
if __name__ == "__main__":
    best_data = train_bert_model("flood", "East District")
    print([data.combined_text for data in best_data])
