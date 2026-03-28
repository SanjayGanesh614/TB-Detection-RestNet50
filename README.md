# TB Detection using ResNet50

This repository contains a deep learning project for detecting Tuberculosis from chest X-ray images using transfer learning with the ResNet50 architecture.

## Repository Contents

- `tb-detection-using-resnet50.ipynb`: The main notebook for training and inference. Optimized for Kaggle.
- `model/strip_optimizer_kaggle.py`: A standalone script to reduce model size specifically in Kaggle environments.
- `model/strip_optimizer.py`: Original script for local use.
- `model/OGbest_model.keras`: The trained model checkpoint.

## Running on Kaggle

1. **Upload Notebook**: Import `tb-detection-using-resnet50.ipynb` into a new Kaggle Notebook.
2. **Add Data**: Ensure the "Tuberculosis (TB) Chest X-ray Database" is added to your notebook.
3. **Run Cells**: The notebook is pre-configured to use Kaggle paths (`/kaggle/input/...`).
4. **Exporting**: Use the "Strip Optimizer" cell in the notebook or the `strip_optimizer_kaggle.py` script to generate a compact model file for deployment.

## Features

- **Transfer Learning**: Uses ResNet50 with ImageNet weights.
- **Model Optimization**: Integrated logic to strip optimizer state, reducing model size by ~60% for easier sharing.
- **Scoping Fixes**: Corrected variable mismatches for reliable prediction.
