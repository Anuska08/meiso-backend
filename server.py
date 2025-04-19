# server.py (Flask Backend)
from flask import Flask, Response
import cv2
from fer import FER

app = Flask(__name__)
detector = FER(mtcnn=True)

def generate_frames():
    cap = cv2.VideoCapture(0)
    while True:
        ret, frame = cap.read()
        if not ret: break
        result = detector.detect_emotions(frame)
        if result:
            emotion, score = detector.top_emotion(frame)
            cv2.putText(frame, f"{emotion} ({score:.2f})", (50,50), 
                        cv2.FONT_HERSHEY_SIMPLEX, 1, (0,255,0), 2)
        _, jpeg = cv2.imencode('.jpg', frame)
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + jpeg.tobytes() + b'\r\n')

@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), 
                    mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__=="__main__":
    app.run(debug='true')
