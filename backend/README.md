# TB Detection Backend

This is the FastAPI backend for the TB Detection system using ResNet50.

## Setup

1.  **Install Dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

2.  **Ensure Model is Present**:
    The backend expects the model to be at `../model/OGbest_model.keras` relative to `main.py`.

## Running the Server

Start the server using Uvicorn:
```bash
uvicorn backend.main:app --reload
```
Or if you are inside the `backend` directory:
```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`.
You can access the interactive documentation at `http://localhost:8000/docs`.

## API Endpoints

- `GET /health`: Check if the server is running.
- `GET /model-info`: Get metadata about the ResNet50 model.
- `POST /predict`: Upload an image to get a prediction, confidence, preprocessing steps (base64), and Grad-CAM visualizations.
