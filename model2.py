import cv2
from fer import FER

# Initialize webcam (0 is usually the default camera)
cap = cv2.VideoCapture(0)

# Initialize FER model
detector = FER(mtcnn=True)

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        print("Failed to grab frame")
        break

    # Detect emotions
    result = detector.detect_emotions(frame)
    if result:
        # Get the dominant emotion
        dominant_emotion, score = detector.top_emotion(frame)
        print(f"Dominant Emotion: {dominant_emotion}, Score: {score}")

        # Draw emotion on the frame
        cv2.putText(frame, f"{dominant_emotion} ({score:.2f})", (50, 50), 
                    cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2, cv2.LINE_AA)

    # Display the video feed with emotion overlay
    cv2.imshow("Real-Time Emotion Recognition", frame)

    # Break loop on 'q' key press
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()