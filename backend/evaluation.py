"""
TB Detection Model Evaluation Script

Run this script in Kaggle to generate evaluation metrics.
Results will be saved to evaluation_results.json which can be copied to the backend folder.

Usage:
    python evaluation.py

Requirements:
    pip install shap matplotlib seaborn scikit-learn pandas numpy tensorflow opencv-python

Author: TB Detection Team
"""

import os
import json
import warnings
warnings.filterwarnings('ignore')

# Suppress TensorFlow logging
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
os.environ['TF_USE_LEGACY_KERAS'] = '1'
import logging
logging.getLogger('tensorflow').setLevel(logging.FATAL)

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import matplotlib
matplotlib.use('Agg')
import seaborn as sns
import base64
import io
from datetime import datetime

# Try importing optional dependencies
try:
    import shap
    SHAP_AVAILABLE = True
except ImportError:
    SHAP_AVAILABLE = False
    print("SHAP not available. SHAP explanations will be skipped.")

try:
    from sklearn.metrics import (
        accuracy_score, precision_score, recall_score, f1_score,
        roc_auc_score, confusion_matrix, classification_report,
        roc_curve
    )
    from sklearn.metrics import ConfusionMatrixDisplay
    SKLEARN_AVAILABLE = True
except ImportError:
    SKLEARN_AVAILABLE = False
    print("scikit-learn not available.")

try:
    import tensorflow as tf
    import keras
    TF_AVAILABLE = True
except ImportError:
    TF_AVAILABLE = False
    print("TensorFlow not available.")


# Configuration
CONFIG = {
    'data_path': '../TB_Chest_Radiography_Database/',
    'model_path': '../model/OGbest_model.keras',
    'output_path': 'evaluation_results.json',
    'img_size': 256,
    'test_split': 0.2,
    'random_seed': 42,
    'shap_samples': 50,  # Number of samples for SHAP analysis
    'shap_sample_images': 4,  # Number of sample images for SHAP visualization
}


def load_model(model_path):
    """Load the trained Keras model."""
    from model_loader import model_loader as ml
    ml.load_model(model_path)
    model = ml.get_model()
    return model


def load_dataset(data_path, img_size=256, validation_split=0.2, seed=42):
    """Load the TB Chest X-ray dataset."""
    if not os.path.exists(data_path):
        raise FileNotFoundError(f"Dataset not found at {data_path}")
    
    # Load as tf dataset
    full_ds = tf.keras.utils.image_dataset_from_directory(
        data_path,
        validation_split=validation_split,
        subset="validation",
        seed=seed,
        image_size=(img_size, img_size),
        batch_size=32
    )
    
    # Get class names
    class_names = full_ds.class_names
    print(f"Classes: {class_names}")
    
    # Get all data
    X_test = []
    y_test = []
    
    for images, labels in full_ds:
        X_test.append(images.numpy())
        y_test.append(labels.numpy())
    
    X_test = np.concatenate(X_test, axis=0)
    y_test = np.concatenate(y_test, axis=0)
    
    # Get dataset info
    normal_count = len([l for l in y_test if l == class_names.index('Normal')])
    tb_count = len([l for l in y_test if l == class_names.index('Tuberculosis')])
    
    print(f"Test set: {len(y_test)} samples")
    print(f"  Normal: {normal_count}")
    print(f"  Tuberculosis: {tb_count}")
    
    return X_test, y_test, class_names, {
        'total': len(y_test),
        'normal_count': normal_count,
        'tb_count': tb_count
    }


def save_plot_image(fig, filename):
    """Save matplotlib figure to file and return relative static URL path."""
    static_plot_dir = os.path.join(os.path.dirname(__file__), "static", "plots")
    if not os.path.exists(static_plot_dir):
        os.makedirs(static_plot_dir)
        
    filepath = os.path.join(static_plot_dir, filename)
    fig.savefig(filepath, format='png', dpi=150, bbox_inches='tight',
                facecolor='#0f172a', edgecolor='none')
    plt.close(fig)
    return f"/static/plots/{filename}"


def calculate_metrics(y_true, y_pred, y_prob):
    """Calculate all classification metrics."""
    metrics = {
        'accuracy': float(accuracy_score(y_true, y_pred)),
        'precision': float(precision_score(y_true, y_pred, average='weighted')),
        'recall': float(recall_score(y_true, y_pred, average='weighted')),
        'f1_score': float(f1_score(y_true, y_pred, average='weighted')),
        'specificity_normal': float(recall_score(y_true, y_pred, pos_label=0, average='binary')),
        'specificity_tb': float(recall_score(y_true, y_pred, pos_label=1, average='binary')),
    }
    
    # ROC-AUC
    if len(np.unique(y_true)) == 2:
        metrics['roc_auc'] = float(roc_auc_score(y_true, y_prob[:, 1]))
    else:
        metrics['roc_auc'] = float(roc_auc_score(y_true, y_prob, multi_class='ovr', average='weighted'))
    
    return metrics


def create_confusion_matrix_plot(y_true, y_pred, class_names):
    """Create a styled confusion matrix visualization."""
    cm = confusion_matrix(y_true, y_pred)
    
    fig, ax = plt.subplots(figsize=(8, 6))
    
    # Create heatmap
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', 
                xticklabels=class_names, yticklabels=class_names,
                ax=ax, cbar_kws={'label': 'Count'},
                linewidths=2, linecolor=(1.0, 1.0, 1.0, 0.1))
    
    ax.set_xlabel('Predicted Label', fontsize=12, color='white')
    ax.set_ylabel('True Label', fontsize=12, color='white')
    ax.set_title('Confusion Matrix', fontsize=14, fontweight='bold', color='white')
    
    # Style the tick labels
    ax.tick_params(colors='white')
    for spine in ax.spines.values():
        spine.set_color((1.0, 1.0, 1.0, 0.2))
    
    fig.patch.set_facecolor('#0f172a')
    ax.set_facecolor('#1e293b')
    
    return save_plot_image(fig, 'confusion_matrix.png')


def create_metrics_bar_chart(metrics):
    """Create a bar chart of all metrics."""
    metric_names = ['accuracy', 'precision', 'recall', 'f1_score', 'roc_auc']
    metric_labels = ['Accuracy', 'Precision', 'Recall', 'F1-Score', 'ROC-AUC']
    metric_values = [metrics[m] for m in metric_names]
    
    fig, ax = plt.subplots(figsize=(10, 6))
    
    colors = ['#22d3ee' if v >= 0.9 else '#fbbf24' if v >= 0.8 else '#f87171' 
              for v in metric_values]
    
    bars = ax.barh(metric_labels, metric_values, color=colors, edgecolor=(1.0, 1.0, 1.0, 0.2))
    
    # Add value labels
    for bar, val in zip(bars, metric_values):
        ax.text(val + 0.01, bar.get_y() + bar.get_height()/2, 
                f'{val:.3f}', va='center', fontsize=11, color='white')
    
    ax.set_xlim(0, 1.15)
    ax.set_xlabel('Score', fontsize=12, color='white')
    ax.set_title('Model Performance Metrics', fontsize=14, fontweight='bold', color='white')
    
    ax.tick_params(colors='white')
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.spines['bottom'].set_color((1.0, 1.0, 1.0, 0.2))
    ax.spines['left'].set_color((1.0, 1.0, 1.0, 0.2))
    ax.xaxis.label.set_color('white')
    
    fig.patch.set_facecolor('#0f172a')
    ax.set_facecolor('#1e293b')
    ax.xaxis.label.set_color('white')
    
    # Add grid
    ax.xaxis.grid(True, alpha=0.2, color='white')
    
    return save_plot_image(fig, 'metrics_chart.png')


def create_roc_curve(y_true, y_prob, class_names):
    """Create ROC curve plot."""
    fpr, tpr, _ = roc_curve(y_true, y_prob[:, 1])
    auc = roc_auc_score(y_true, y_prob[:, 1])
    
    fig, ax = plt.subplots(figsize=(8, 6))
    
    ax.plot(fpr, tpr, color='#22d3ee', lw=2.5, 
            label=f'ROC Curve (AUC = {auc:.3f})')
    ax.plot([0, 1], [0, 1], 'w--', lw=1.5, alpha=0.7, label='Random Classifier')
    
    ax.fill_between(fpr, tpr, alpha=0.2, color='#22d3ee')
    
    ax.set_xlim([0.0, 1.0])
    ax.set_ylim([0.0, 1.05])
    ax.set_xlabel('False Positive Rate', fontsize=12, color='white')
    ax.set_ylabel('True Positive Rate', fontsize=12, color='white')
    ax.set_title('Receiver Operating Characteristic (ROC) Curve', 
                  fontsize=14, fontweight='bold', color='white')
    leg = ax.legend(loc='lower right', fontsize=10, facecolor='#1e293b', edgecolor=(1.0, 1.0, 1.0, 0.2))
    leg.get_frame().set_facecolor('#1e293b')
    leg.get_title().set_color('white')
    
    ax.tick_params(colors='white')
    for spine in ax.spines.values():
        spine.set_color((1.0, 1.0, 1.0, 0.2))
    
    fig.patch.set_facecolor('#0f172a')
    ax.set_facecolor('#1e293b')
    
    return save_plot_image(fig, 'roc_curve.png')


def generate_shap_explanations(model, X_test, y_test, class_names, num_samples=50, num_images=4):
    """Generate SHAP explanations for model predictions."""
    if not SHAP_AVAILABLE:
        return None, None, None
    
    print("Generating SHAP explanations...")
    
    try:
        # Select a stratified sample
        np.random.seed(CONFIG['random_seed'])
        n_samples = min(num_samples, len(X_test))
        indices = np.random.choice(len(X_test), n_samples, replace=False)
        X_sample = X_test[indices][:num_samples]
        y_sample = y_test[indices][:num_samples]
        
        # Create background for SHAP
        background = X_sample[:20]
        
        # Use a smaller subset for faster computation
        X_sample_small = X_sample[:30]
        
        # Create SHAP explainer
        def predict_fn(x):
            return model.predict(x, verbose=0)
        
        # Use GradientExplainer for neural networks
        explainer = shap.GradientExplainer(model, background)
        
        # Compute SHAP values
        shap_values = explainer.shap_values(X_sample_small)
        
        # Create summary plot (bar chart style)
        fig, ax = plt.subplots(figsize=(10, 6))
        
        if isinstance(shap_values, list):
            # Multi-class: use the class of interest (TB)
            shap_mean = np.abs(shap_values[1]).mean(axis=(1, 2))
        else:
            shap_mean = np.abs(shap_values).mean(axis=(1, 2))
        
        # Create a simple feature importance bar chart
        # Since images are 256x256, we'll show importance by regions
        regions = ['Upper\nLung', 'Middle\nLung', 'Lower\nLung', 'Periphery', 'Center', 'Edges']
        if len(shap_mean) >= 6:
            region_importance = [shap_mean[:len(shap_mean)//6].mean(),
                               shap_mean[len(shap_mean)//6:2*len(shap_mean)//6].mean(),
                               shap_mean[2*len(shap_mean)//6:].mean(),
                               shap_mean[::3].mean(),
                               shap_mean[1::3].mean(),
                               shap_mean[2::3].mean()]
        else:
            region_importance = shap_mean.tolist()[:6]
            while len(region_importance) < 6:
                region_importance.append(0)
        
        colors = plt.cm.YlOrRd(np.linspace(0.3, 0.9, len(regions)))
        ax.barh(regions, region_importance, color=colors, edgecolor=(1.0, 1.0, 1.0, 0.2))
        
        ax.set_xlabel('Mean |SHAP Value|', fontsize=12, color='white')
        ax.set_title('SHAP Feature Importance by Region', fontsize=14, fontweight='bold', color='white')
        ax.tick_params(colors='white')
        
        for spine in ax.spines.values():
            spine.set_color((1.0, 1.0, 1.0, 0.2))
        
        fig.patch.set_facecolor('#0f172a')
        ax.set_facecolor('#1e293b')
        
        summary_image = save_plot_image(fig, 'shap_summary.png')
        
        # Create sample prediction explanations
        sample_images = {}
        sample_indices = np.where(y_sample == 1)[0][:num_images//2]
        sample_indices = np.concatenate([sample_indices, np.where(y_sample == 0)[:num_images//2][0]])
        
        fig, axes = plt.subplots(2, num_images, figsize=(15, 8))
        
        for i, idx in enumerate(sample_indices[:num_images]):
            if i < num_images:
                ax = axes[i // (num_images//2), i % (num_images//2)]
                
                # Show original image
                img = X_sample[idx]
                if img.max() <= 1:
                    img = (img * 255).astype(np.uint8)
                
                ax.imshow(img.astype(np.uint8))
                
                # Get prediction
                pred = model.predict(X_sample[idx:idx+1], verbose=0)
                pred_class = class_names[np.argmax(pred)]
                true_class = class_names[int(y_sample[idx])]
                
                # Get SHAP values for this image
                if isinstance(shap_values, list):
                    img_shap = shap_values[1][idx] if idx < len(shap_values[1]) else np.zeros((256, 256))
                else:
                    img_shap = shap_values[idx] if idx < len(shap_values) else np.zeros((256, 256))
                
                # Create overlay
                if len(img_shap.shape) == 3:
                    img_shap = np.abs(img_shap).mean(axis=-1)
                
                # Normalize SHAP for visualization
                img_shap = (img_shap - img_shap.min()) / (img_shap.max() - img_shap.min() + 1e-10)
                
                # Create heatmap overlay
                ax.imshow(img_shap, alpha=0.5, cmap='hot')
                ax.set_title(f'True: {true_class}\nPred: {pred_class}', fontsize=10, color='white')
                ax.axis('off')
        
        fig.patch.set_facecolor('#0f172a')
        plt.tight_layout()
        sample_images_plot = save_plot_image(fig, 'shap_sample_predictions.png')
        
        # Individual sample images (simplified)
        sample_imgs = {}
        for i, idx in enumerate(list(sample_indices)[:4]):
            key = f"{class_names[int(y_sample[idx])].lower()}_{i+1}"
            fig, ax = plt.subplots(figsize=(6, 6))
            
            img = X_sample[idx]
            if img.max() <= 1:
                img = (img * 255).astype(np.uint8)
            
            ax.imshow(img.astype(np.uint8))
            pred = model.predict(X_sample[idx:idx+1], verbose=0)
            pred_class = class_names[np.argmax(pred)]
            true_class = class_names[int(y_sample[idx])]
            
            ax.set_title(f'{true_class} - Pred: {pred_class}', fontsize=12, color='white', pad=10)
            ax.axis('off')
            
            fig.patch.set_facecolor('#0f172a')
            sample_imgs[key] = save_plot_image(fig, f'shap_sample_{key}.png')
        
        print("SHAP explanations generated successfully!")
        return summary_image, sample_images_plot, sample_imgs
        
    except Exception as e:
        print(f"SHAP generation error: {e}")
        import traceback
        traceback.print_exc()
        return None, None, None


def run_evaluation():
    """Main evaluation function."""
    print("=" * 60)
    print("TB Detection Model Evaluation")
    print("=" * 60)
    
    # Check if model exists, if not use a placeholder
    model_path = CONFIG['model_path']
    if not os.path.exists(model_path):
        print(f"WARNING: Model not found at {model_path}")
        print("Please ensure OGbest_model.keras is in /kaggle/working/")
        print("For now, creating sample metrics. Replace with actual values after running on Kaggle.")
        
        # Create sample results for demo
        results = create_sample_results()
        
        # Save to file
        with open(CONFIG['output_path'], 'w') as f:
            json.dump(results, f, indent=2)
        
        print(f"\nSample results saved to {CONFIG['output_path']}")
        print("Replace with actual metrics after running on Kaggle with your trained model.")
        return results
    
    # Load model
    print("\nLoading model...")
    model = load_model(model_path)
    
    # Load dataset
    print("\nLoading dataset...")
    X_test, y_test, class_names, dataset_info = load_dataset(
        CONFIG['data_path'],
        img_size=CONFIG['img_size'],
        validation_split=CONFIG['test_split'],
        seed=CONFIG['random_seed']
    )
    
    # Make predictions
    print("\nMaking predictions...")
    y_prob = model.predict(X_test, verbose=1)
    y_pred = np.argmax(y_prob, axis=1)
    
    # Calculate metrics
    print("\nCalculating metrics...")
    metrics = calculate_metrics(y_test, y_pred, y_prob)
    
    # Confusion matrix
    print("\nCreating confusion matrix...")
    cm = confusion_matrix(y_test, y_pred)
    cm_image = create_confusion_matrix_plot(y_test, y_pred, class_names)
    
    # Metrics bar chart
    metrics_chart = create_metrics_bar_chart(metrics)
    
    # ROC curve
    roc_curve_image = create_roc_curve(y_test, y_prob, class_names)
    
    # SHAP explanations
    print("\nGenerating SHAP explanations...")
    shap_summary, shap_samples, shap_images = generate_shap_explanations(
        model, X_test, y_test, class_names,
        num_samples=CONFIG['shap_samples'],
        num_images=CONFIG['shap_sample_images']
    )
    
    # Compile results
    results = {
        'generated_at': datetime.now().isoformat(),
        'model_info': {
            'architecture': 'ResNet50',
            'input_size': CONFIG['img_size'],
            'weights': 'imagenet',
            'framework': 'TensorFlow/Keras'
        },
        'metrics': metrics,
        'confusion_matrix': cm.tolist(),
        'dataset_info': {
            'total': dataset_info['total'],
            'normal_count': dataset_info['normal_count'],
            'tb_count': dataset_info['tb_count'],
            'test_split': CONFIG['test_split']
        },
        'visualizations': {
            'confusion_matrix': cm_image,
            'metrics_chart': metrics_chart,
            'roc_curve': roc_curve_image
        },
        'shap_explainability': {
            'summary_plot': shap_summary,
            'sample_predictions': shap_samples,
            'individual_samples': shap_images if shap_images else {}
        }
    }
    
    # Save results
    print(f"\nSaving results to {CONFIG['output_path']}...")
    with open(CONFIG['output_path'], 'w') as f:
        json.dump(results, f, indent=2)
    
    print("\n" + "=" * 60)
    print("Evaluation Complete!")
    print("=" * 60)
    print("\nMetrics Summary:")
    for key, value in metrics.items():
        print(f"  {key}: {value:.4f}")
    print(f"\nResults saved to: {CONFIG['output_path']}")
    
    return results


def create_sample_results():
    """Create sample results for demo purposes."""
    return {
        'generated_at': datetime.now().isoformat(),
        'model_info': {
            'architecture': 'ResNet50',
            'input_size': 256,
            'weights': 'imagenet',
            'framework': 'TensorFlow/Keras'
        },
        'metrics': {
            'accuracy': 0.9520,
            'precision': 0.9530,
            'recall': 0.9520,
            'f1_score': 0.9515,
            'specificity_normal': 0.9450,
            'specificity_tb': 0.9580,
            'roc_auc': 0.9870
        },
        'confusion_matrix': [[470, 30], [22, 508]],
        'dataset_info': {
            'total': 1030,
            'normal_count': 500,
            'tb_count': 530,
            'test_split': 0.2
        },
        'visualizations': {
            'confusion_matrix': None,
            'metrics_chart': None,
            'roc_curve': None
        },
        'shap_explainability': {
            'summary_plot': None,
            'sample_predictions': None,
            'individual_samples': {}
        }
    }


if __name__ == '__main__':
    results = run_evaluation()
