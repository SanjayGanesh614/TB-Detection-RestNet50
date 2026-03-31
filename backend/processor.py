import cv2
import numpy as np
import tensorflow as tf
import keras
from PIL import Image
import io
import base64
import matplotlib.cm as cm

class ImageProcessor:
    def __init__(self, target_size=(256, 256)):
        self.target_size = target_size

    def to_base64(self, img_array):
        """Convert numpy array (0-255) to base64 string."""
        img = Image.fromarray(img_array.astype('uint8'))
        buffered = io.BytesIO()
        img.save(buffered, format="PNG")
        return base64.b64encode(buffered.getvalue()).decode('utf-8')

    def resize(self, img):
        """Resize image to target size."""
        return cv2.resize(img, self.target_size)

    def enhance(self, img):
        """Apply CLAHE enhancement."""
        if len(img.shape) == 3:
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        else:
            gray = img
        
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
        enhanced = clahe.apply(gray)
        return cv2.cvtColor(enhanced, cv2.COLOR_GRAY2BGR)

    def normalize(self, img):
        """Normalize image to [0, 1]."""
        return img.astype('float32') / 255.0

    def denoise(self, img):
        """Apply Gaussian denoising."""
        return cv2.GaussianBlur(img, (3, 3), 0)

    def make_gradcam_heatmap(self, img_array, model, last_conv_layer_name):
        """Generate Grad-CAM heatmap using manual layer-by-layer tracing (Robust for Keras 3 Sequential)."""
        
        # Ensure we have the base model (ResNet50) if wrapped in Sequential
        main_model = model
        if hasattr(model, 'layers') and len(model.layers) > 0:
            if hasattr(model.layers[0], 'layers'):
                main_model = model.layers[0]

        # 1. Target identify the target conv layer object
        target_layer = None
        try:
            target_layer = main_model.get_layer(last_conv_layer_name)
        except (ValueError, AttributeError):
            for layer in reversed(main_model.layers):
                if 'conv' in layer.name.lower() and hasattr(layer, 'output_shape') and len(layer.output_shape) == 4:
                    target_layer = layer
                    break
        
        if not target_layer:
            raise ValueError("Could not find suitable convolution layer for Grad-CAM.")

        # 2. TRACING: Manually run the model through the tape to define the relationship
        with tf.GradientTape() as tape:
            # Start from the input
            x = img_array
            conv_activations = None
            
            # Since the model is Sequential (Base + Head), we trace through it
            # Case 1: Sequential model with base model as layer 0
            if id(model) == id(main_model):
                # If they are the same (already flat), trace all
                for layer in model.layers:
                    x = layer(x)
                    if layer == target_layer:
                        conv_activations = x
                        tape.watch(conv_activations)
            else:
                # Trace base first
                for layer in main_model.layers:
                    x = layer(x)
                    if layer == target_layer:
                        conv_activations = x
                        tape.watch(conv_activations)
                
                # Trace the rest of the top-level layers (pooling, dense, etc) in the sequential model
                for i in range(1, len(model.layers)):
                    x = model.layers[i](x)
            
            # Final output is now x
            if conv_activations is None:
                raise ValueError("Missed the target layer during tracing.")
                
            top_pred_index = tf.argmax(x[0])
            top_class_channel = x[:, top_pred_index]

        # 3. Calculate gradients w.r.t the intermediate activations we captured
        grads = tape.gradient(top_class_channel, conv_activations)
        
        # 4. Standard Grad-CAM synthesis
        pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))
        conv_output = conv_activations[0]
        heatmap = conv_output @ pooled_grads[..., tf.newaxis]
        heatmap = tf.squeeze(heatmap).numpy()

        # ReLU and normalize
        heatmap = np.maximum(heatmap, 0) / (np.max(heatmap) + 1e-10)
        return heatmap

    def save_and_display_gradcam(self, img, heatmap, alpha=0.4):
        """Overlay heatmap on the enhanced visuals."""
        heatmap = np.uint8(255 * heatmap)
        jet = cm.get_cmap("jet")
        jet_colors = jet(np.arange(256))[:, :3]
        jet_heatmap = jet_colors[heatmap]

        jet_heatmap = keras.utils.array_to_img(jet_heatmap)
        jet_heatmap = jet_heatmap.resize((img.shape[1], img.shape[0]))
        jet_heatmap = keras.utils.img_to_array(jet_heatmap)

        superimposed_img = jet_heatmap * alpha + img
        superimposed_img = np.clip(superimposed_img, 0, 255).astype('uint8')

        return jet_heatmap.astype('uint8'), superimposed_img

    def run_pipeline(self, img_bytes, model):
        """
        Kaggle-Aligned Pipeline: 
        1. Model Path (Inference): Receives strictly RAW original pixels (resized via TF) to match training.
        2. Visual Path (Clinician): Receives ENHANCED (CLAHE/Denoised) pixels for clinical review.
        NOTE: The preprocessed visual image is strictly for the frontend and is NEVER sent to the model for inference.
        """
        # --- INITIAL DECODING ---
        nparr = np.frombuffer(img_bytes, np.uint8)
        bgr_img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if bgr_img is None:
            raise ValueError("Invalid image file")
        
        # Original RGB for consistent representation and model input base
        rgb_original = cv2.cvtColor(bgr_img, cv2.COLOR_BGR2RGB)

        # --- PATH 1: MODEL INFERENCE (RAW PIXELS) ---
        # This path matches the Kaggle training distribution precisely: [0, 255] range + Bilinear Resize.
        tf_img = tf.convert_to_tensor(rgb_original, dtype=tf.float32)
        tf_raw_resized = tf.image.resize(tf_img, self.target_size, method='bilinear')
        input_tensor = tf.expand_dims(tf_raw_resized, axis=0)

        # --- PATH 2: VISUAL ENHANCEMENT (FRONTEND DISPLAY) ---till
        resized_visual = cv2.resize(bgr_img, self.target_size)
        enhanced_visual = self.enhance(resized_visual)
        denoised_visual = self.denoise(enhanced_visual)
        visual_output_rgb = cv2.cvtColor(denoised_visual, cv2.COLOR_BGR2RGB)

        # --- PREDICTION ---
        # Inference is performed using ONLY the raw tensor (input_tensor).
        preds = model.predict(input_tensor)
        class_idx = np.argmax(preds[0])
        confidence = float(np.max(preds[0]))
        label = "Tuberculosis" if class_idx == 1 else "Normal"

        # --- DIAGNOSTIC OVERLAY (GRAD-CAM) ---
        # Heatmap is generated from the raw inference input (matching the model's logic)
        # then overlayed on the enhanced visual (matching the clinician's perspective).
        last_conv_layer_name = "conv5_block3_out"
        try:
            heatmap = self.make_gradcam_heatmap(input_tensor, model, last_conv_layer_name)
            jet_heatmap, overlay = self.save_and_display_gradcam(visual_output_rgb, heatmap)
            grad_cam_b64 = self.to_base64(jet_heatmap)
            overlay_b64 = self.to_base64(overlay)
        except Exception as e:
            print(f"Grad-CAM error: {e}")
            grad_cam_b64 = None
            overlay_b64 = None

        return {
            "prediction": label,
            "confidence": confidence,
            "class_index": int(class_idx),
            "preprocessing_steps": {
                "original": self.to_base64(rgb_original),
                "resized": self.to_base64(cv2.cvtColor(resized_visual, cv2.COLOR_BGR2RGB)),
                "enhanced": self.to_base64(cv2.cvtColor(enhanced_visual, cv2.COLOR_BGR2RGB)),
                "denoised": self.to_base64(visual_output_rgb),
                "normalized": self.to_base64(tf_raw_resized.numpy()),
                "model_input": self.to_base64(tf_raw_resized.numpy())
            },
            "grad_cam": grad_cam_b64,
            "overlay": overlay_b64
        }

    def generate_shap_explanation(self, img_bytes, model):
        """Generate SHAP heatmap overlay for an uploaded image."""
        try:
            import shap
            import matplotlib.pyplot as plt
            import matplotlib
            matplotlib.use('Agg')
        except ImportError:
            raise ImportError("Please install shap and matplotlib to use explainability features.")

        nparr = np.frombuffer(img_bytes, np.uint8)
        bgr_img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if bgr_img is None:
            raise ValueError("Invalid image file")
            
        rgb_original = cv2.cvtColor(bgr_img, cv2.COLOR_BGR2RGB)
        
        # Format for ResNet50 input (matches inference logic)
        tf_img = tf.convert_to_tensor(rgb_original, dtype=tf.float32)
        tf_raw_resized = tf.image.resize(tf_img, self.target_size, method='bilinear')
        input_tensor = tf.expand_dims(tf_raw_resized, axis=0)
        
        # Create a background reference of zeros
        # Using a small batch of 2 zero-tensors
        background = np.zeros((2, self.target_size[0], self.target_size[1], 3), dtype=np.float32)
        
        explainer = shap.GradientExplainer(model, background)
        
        shap_values = explainer.shap_values(input_tensor.numpy())
        
        if isinstance(shap_values, list):
            # Index 1 corresponds to TB 
            img_shap = shap_values[1][0] 
        else:
            img_shap = shap_values[0]

        if len(img_shap.shape) == 3:
            img_shap = np.abs(img_shap).mean(axis=-1)
            
        img_shap = (img_shap - img_shap.min()) / (img_shap.max() - img_shap.min() + 1e-10)
        
        fig, ax = plt.subplots(figsize=(6, 6))
        
        display_img = rgb_original
        if display_img.shape[:2] != self.target_size:
            display_img = cv2.resize(display_img, self.target_size)
        
        ax.imshow(display_img)
        ax.imshow(img_shap, alpha=0.5, cmap='hot')
        ax.axis('off')
        
        fig.patch.set_facecolor('#0f172a')
        
        buf = io.BytesIO()
        fig.savefig(buf, format='png', dpi=150, bbox_inches='tight', facecolor='#0f172a', edgecolor='none')
        buf.seek(0)
        img_encoded = base64.b64encode(buf.getvalue()).decode('utf-8')
        plt.close(fig)
        
        return img_encoded

processor = ImageProcessor()
