import pandas as pd
from datasets import load_dataset
import json
import os

# Load dataset from Hugging Face because it's a small dataset
dataset = load_dataset('Tobi-Bueck/customer-support-tickets', split='train')
df = dataset.to_pandas()

# Basic processing: parse if needed, but here no date
# For simplicity, generate metrics

metrics = {
    'total_tickets': len(df),
    'priority_counts': df['priority'].value_counts().to_dict(),
    'type_counts': df['type'].value_counts().to_dict(),
    'queue_counts': df['queue'].value_counts().to_dict(),
    'language_counts': df['language'].value_counts().to_dict(),
}

# Save to processed/metrics.json
os.makedirs('processed', exist_ok=True)
with open('processed/metrics.json', 'w') as f:
    json.dump(metrics, f, indent=2)

print("Metrics generated and saved.")