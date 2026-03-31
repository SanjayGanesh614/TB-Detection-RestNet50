# AGENTS.md - TB Detection RestNet50

## Project Overview

TB Detection system using ResNet50 for classifying chest X-rays as Normal or Tuberculosis.

## Tech Stack

- **Frontend**: React 18, Vite, TailwindCSS, Framer Motion, React Three Fiber
- **Backend**: Python, FastAPI, TensorFlow 2.15, OpenCV, NumPy
- **ML**: Keras ResNet50 model (256x256 input)

## Commands

### Backend

```bash
cd backend
pip install -r requirements.txt          # Install dependencies
python main.py                          # Start server (port 8000)
```

### Frontend

```bash
cd frontend
npm install                             # Install dependencies
npm run dev                            # Dev server
npm run build                          # Production build
npm run preview                        # Preview production build
```

### Running a Single Test

```bash
# Backend - run specific Python test
python -m pytest tests/test_model.py -v

# Frontend - run single test file
npm test -- --testPathPattern="Home.test.jsx"
```

## Code Style

### Python (Backend)

- 4-space indentation
- snake_case for functions/variables
- PascalCase for classes
- Max line length: 120 characters
- Type hints encouraged for function signatures
- Docstrings for public functions using triple quotes

```python
def load_model(path: str) -> keras.Model:
    """Load Keras model from path.
    
    Args:
        path: Path to .keras model file
        
    Returns:
        Loaded model instance
    """
    pass
```

### JavaScript/React (Frontend)

- 2-space indentation
- camelCase for variables/functions
- PascalCase for React components
- kebab-case for filenames
- PropTypes or TypeScript interfaces for component props
- Use functional components with hooks

```jsx
// Good
const HomePage = ({ onPredict }) => {
  return <div>...</div>;
};

export default HomePage;
```

### CSS

- TailwindCSS utility classes preferred
- Custom CSS in index.css for global styles
- Use CSS variables for theme colors

## Project Structure

```
├── backend/
│   ├── main.py           # FastAPI app, routes
│   ├── model_loader.py   # TensorFlow model loading
│   ├── processor.py      # Image preprocessing & prediction
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable React components
│   │   ├── pages/        # Page components
│   │   ├── App.jsx       # Main app component
│   │   └── main.jsx      # Entry point
│   └── package.json
├── model/
│   └── OGbest_model.keras
└── tb-detection-using-resnet50.ipynb
```

## API Endpoints

- `GET /health` - Health check
- `GET /model-info` - Model metadata
- `POST /predict` - Upload image for prediction (multipart/form-data)

## Error Handling

- FastAPI: Use HTTPException for client errors, try/except for server errors
- React: Handle API errors with try/catch, display user-friendly messages
- Log errors with traceback for debugging

## Imports

### Python
```python
# Standard library first, then third-party, then local
import os
from typing import Optional

from fastapi import FastAPI
from PIL import Image

from model_loader import model_loader
```

### JavaScript
```jsx
// React imports first, then third-party, then local
import React, { useState } from 'react';
import { motion } from 'framer-motion';

import Navbar from './components/Navbar';
```

## Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Python functions | snake_case | `load_model()` |
| Python classes | PascalCase | `ModelLoader` |
| Python constants | UPPER_SNAKE | `MAX_FILE_SIZE` |
| React components | PascalCase | `HomePage` |
| React props | camelCase | `onClick`, `isLoading` |
| CSS classes | kebab-case (Tailwind) | `flex-row`, `text-center` |
| Files | kebab-case | `home-page.jsx`, `model_loader.py` |

## Git Conventions

- Branch naming: `feature/description`, `fix/bug-description`
- Commit messages: imperative mood, 72 char max
  - `feat: add prediction history page`
  - `fix: handle empty image upload`
  - `chore: update TensorFlow version`

## Important Notes

- Model file: `model/OGbest_model.keras` (~10MB)
- Input size: 256x256 pixels
- Output classes: `["Normal", "Tuberculosis"]`
- CORS enabled for all origins in development
- Use `TF_USE_LEGACY_KERAS=1` environment variable
