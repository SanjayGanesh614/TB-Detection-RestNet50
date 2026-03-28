## Product Documentation

**System:** Lung TB Detection with Preprocessing Visualization and Explainability
**Type:** Image classification + digital image processing + explainable AI

---

## 1. Overview

This system allows a user to upload a chest X-ray image and receive:

* A classification result (Tuberculosis or Normal)
* A confidence score
* A step-by-step visualization of preprocessing operations
* A Grad-CAM heatmap showing model attention

The system is designed to demonstrate both **Digital Image Processing (DIP)** concepts and **deep learning inference**, with a strong emphasis on interpretability.

---

## 2. Objectives

The system aims to:

* Provide accurate binary classification of chest X-rays
* Visually demonstrate preprocessing transformations applied to images
* Improve interpretability using heatmaps
* Present results in a structured and understandable format

---

## 3. System Architecture

The system is divided into three main layers:

### 3.1 Input Layer

Handles user image upload and validation.

### 3.2 Processing Layer

Contains:

* Preprocessing pipeline
* Model inference
* Explainability module (Grad-CAM)

### 3.3 Output Layer

Displays:

* Intermediate preprocessing steps
* Final prediction
* Confidence score
* Heatmap visualization

---

## 4. End-to-End Workflow

1. User uploads an image
2. Image is validated and stored temporarily
3. Preprocessing pipeline is executed step-by-step
4. Each preprocessing stage is saved for visualization
5. Final processed image is passed to the model
6. Model outputs prediction and confidence
7. Grad-CAM is generated using model internals
8. All outputs are returned to the frontend

---

## 5. Backend API Design

### 5.1 POST /predict

**Purpose:**
Runs the full pipeline including preprocessing, prediction, and Grad-CAM.

**Input:**

* Image file (multipart/form-data)

**Processing:**

* Validate image format
* Run preprocessing pipeline
* Perform model inference
* Generate Grad-CAM

**Output:**

```json
{
  "prediction": "Tuberculosis",
  "confidence": 0.97,
  "preprocessing_steps": {
    "original": "<image>",
    "resized": "<image>",
    "enhanced": "<image>",
    "normalized": "<image>"
  },
  "grad_cam": "<heatmap_image>",
  "overlay": "<overlay_image>"
}
```

---

### 5.2 GET /health

**Purpose:**
Check if backend is running.

**Output:**

```json
{
  "status": "ok"
}
```

---

### 5.3 GET /model-info

**Purpose:**
Provide metadata about the model.

**Output:**

```json
{
  "model": "ResNet50",
  "input_size": "256x256",
  "classes": ["Normal", "Tuberculosis"]
}
```

---

## 6. Preprocessing Pipeline Design

The preprocessing pipeline is a critical part of the system and must be implemented as a sequence of clearly defined transformations. Each transformation should produce an output that is stored and displayed.

---

### 6.1 Step 1: Original Image

**Purpose:**
Preserve the raw input for comparison.

**Requirement:**

* No modification
* Store as baseline

---

### 6.2 Step 2: Resize

**Purpose:**
Ensure uniform input size for the model.

**Details:**

* Resize image to 256 × 256
* Maintain aspect ratio if needed, otherwise use direct resizing

**Output:**

* Resized image

---

### 6.3 Step 3: Normalization

**Purpose:**
Scale pixel values to a consistent range.

**Details:**

* Convert pixel values from [0, 255] to [0, 1]
* Required for stable neural network input

**Display Note:**

* For visualization, convert back to displayable format

---

### 6.4 Step 4: Contrast Enhancement (CLAHE)

**Purpose:**
Enhance local contrast in X-ray images.

**Details:**

* Convert image to grayscale
* Apply adaptive histogram equalization
* Improve visibility of subtle patterns such as lesions

**Output:**

* Enhanced grayscale image

---

### 6.5 Step 5: Optional Denoising

**Purpose:**
Reduce noise while preserving important edges.

**Options:**

* Gaussian filtering
* Median filtering

**Note:**
This step is optional but useful for demonstration of DIP concepts.

---

## 7. Preprocessing Layer Requirements

To implement preprocessing effectively:

* Each step must be **modular and independent**
* Each output must be **stored separately**
* Outputs must be **convertible to display format**
* Maintain consistent data flow between steps

The pipeline should follow:

```text
Original → Resize → Enhance → Normalize → Model Input
```

---

## 8. Model Inference

**Model Type:**
Transfer learning model based on ResNet50

**Input:**

* Preprocessed image (256 × 256 × 3)

**Output:**

* Probability distribution over two classes

**Post-processing:**

* Select class with highest probability
* Extract confidence score

---

## 9. Grad-CAM Module

**Purpose:**
Provide visual explanation of model decisions.

**Process Overview:**

* Identify final convolutional layer
* Compute gradients of prediction with respect to feature maps
* Generate importance weights
* Create heatmap
* Overlay heatmap on original image

**Output:**

* Heatmap image
* Overlay visualization

---

## 10. Frontend Display Requirements

The UI should present results in a structured layout:

### Section 1: Input

* Uploaded image preview

### Section 2: Preprocessing

* Original image
* Resized image
* Enhanced image
* Normalized image

### Section 3: Prediction

* Label (TB or Normal)
* Confidence score

### Section 4: Explainability

* Grad-CAM heatmap
* Overlay image

---

## 11. Performance Considerations

* Preprocessing should be lightweight and fast
* Model inference should complete within seconds
* Images should be compressed before returning to frontend
* Avoid unnecessary recomputation

---

## 12. Limitations

* Model trained on limited dataset
* Not suitable for clinical diagnosis
* Sensitive to input quality and resolution
* Grad-CAM provides approximate explanations, not exact reasoning

---

## 13. Future Enhancements

* Add lung segmentation before classification
* Support batch processing
* Add PDF report generation
* Deploy as cloud API
* Add multi-class classification (TB, Pneumonia, Normal)

---

## 14. Summary

This system combines:

* Digital image preprocessing
* Deep learning classification
* Explainable AI

into a single pipeline that is both **technically strong** and **visually demonstrable**, making it suitable for academic evaluation and practical demonstration.
