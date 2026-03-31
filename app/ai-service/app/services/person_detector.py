from ultralytics import YOLO
import cv2

model = YOLO("yolov8n.pt")

def detect_person(frame):

    results = model(frame, verbose=False)
    person_detected = False

    height, width, _ = frame.shape
    best_y1 = height  # Track highest person in frame
    best_box = None

    for result in results:
        for box in result.boxes:

            class_id = int(box.cls[0])

            if class_id == 0:  # person class
                x1, y1, x2, y2 = map(int, box.xyxy[0])

                # Filter: check if this person is standing at the front of the class.
                # Since the camera is at the back, students normally occupy the lower half.
                if y1 < height * 0.6: 
                    if y1 < best_y1:
                        best_y1 = y1
                        best_box = (x1, y1, x2, y2)

    if best_box is not None:
        person_detected = True
        x1, y1, x2, y2 = best_box
        cv2.rectangle(frame, (x1,y1),(x2,y2),(0,255,0),2)
        cv2.putText(frame, "Teacher Zone", (x1,y1-10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0,255,0),2)

    return person_detected, frame