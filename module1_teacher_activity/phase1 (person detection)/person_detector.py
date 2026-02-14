from ultralytics import YOLO
import cv2

model = YOLO("yolov8n.pt")

def detect_person(frame):

    results = model(frame, verbose=False)

    person_detected = False

    for result in results:
        for box in result.boxes:

            class_id = int(box.cls[0])

            if class_id == 0:  # person class

                person_detected = True

                x1, y1, x2, y2 = map(int, box.xyxy[0])

                cv2.rectangle(frame, (x1,y1),(x2,y2),(0,255,0),2)
                cv2.putText(frame, "Teacher", (x1,y1-10),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0,255,0),2)

    return person_detected, frame