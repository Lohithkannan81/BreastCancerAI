print("--- INITIALIZING TRAIN SCRIPT ---")
import os
import sys

# 1. Check Libraries
try:
    print("1. Importing TensorFlow... (This can take 10-30 seconds)")
    import tensorflow as tf
    from tensorflow.keras.models import Sequential
    from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense, Dropout, Input
    from tensorflow.keras.preprocessing.image import ImageDataGenerator
    from tensorflow.keras.callbacks import EarlyStopping
    print(f"   Success! TensorFlow Version: {tf.__version__}")
except ImportError as e:
    print(f"\nCRITICAL ERROR: TensorFlow not found. Please run: pip install tensorflow\nDetails: {e}")
    sys.exit()

# --- CONFIGURATION ---
IMG_WIDTH, IMG_HEIGHT = 224, 224
BATCH_SIZE = 32
EPOCHS = 5
TRAIN_DIR = 'dataset/train'
TEST_DIR = 'dataset/test'
MODEL_SAVE_PATH = 'models/mammogram_cnn.h5'

def create_model():
    print("   Building CNN Architecture...")
    model = Sequential([
        Input(shape=(IMG_WIDTH, IMG_HEIGHT, 3)),
        
        # Conv Block 1
        Conv2D(32, (3, 3), activation='relu'),
        MaxPooling2D(2, 2),
        
        # Conv Block 2
        Conv2D(64, (3, 3), activation='relu'),
        MaxPooling2D(2, 2),
        
        # Flatten & Dense
        Flatten(),
        Dense(64, activation='relu'),
        Dropout(0.5),
        Dense(1, activation='sigmoid')
    ])
    
    model.compile(optimizer='adam', 
                  loss='binary_crossentropy', 
                  metrics=['accuracy'])
    return model

def main():
    print("\n2. Checking Dataset...")
    
    # Check if folders exist
    if not os.path.exists(TRAIN_DIR):
        print(f"   ERROR: Training folder not found at {TRAIN_DIR}")
        return

    # Count images
    num_benign = len(os.listdir(os.path.join(TRAIN_DIR, 'benign')))
    num_malignant = len(os.listdir(os.path.join(TRAIN_DIR, 'malignant')))
    print(f"   Found {num_benign} Benign and {num_malignant} Malignant images in Train.")

    if num_benign == 0 or num_malignant == 0:
        print("   ERROR: One of the classes is empty! Check your sorting.")
        return

    print("\n3. Preprocessing Data...")
    train_datagen = ImageDataGenerator(rescale=1./255)
    test_datagen = ImageDataGenerator(rescale=1./255)

    train_generator = train_datagen.flow_from_directory(
        TRAIN_DIR,
        target_size=(IMG_WIDTH, IMG_HEIGHT),
        batch_size=BATCH_SIZE,
        class_mode='binary'
    )

    # Check if test folder exists, otherwise use train for validation
    if os.path.exists(TEST_DIR):
        print("   Using Test folder for validation.")
        validation_generator = test_datagen.flow_from_directory(
            TEST_DIR,
            target_size=(IMG_WIDTH, IMG_HEIGHT),
            batch_size=BATCH_SIZE,
            class_mode='binary'
        )
    else:
        print("   Warning: Test folder not found. Using Training data for validation (not recommended).")
        validation_generator = train_generator

    print("\n4. Starting Training Loop...")
    model = create_model()
    
    # Create models folder if missing
    os.makedirs('models', exist_ok=True)

    history = model.fit(
        train_generator,
        epochs=EPOCHS,
        validation_data=validation_generator
    )

    print("\n5. Saving Model...")
    model.save(MODEL_SAVE_PATH)
    print(f"   SUCCESS! Model saved to {MODEL_SAVE_PATH}")

if __name__ == "__main__":
    main()