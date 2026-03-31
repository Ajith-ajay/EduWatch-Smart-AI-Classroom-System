import time
from services.teaching_activity_engine import TeachingActivityEngine

def run_simulation():
    engine = TeachingActivityEngine()
    
    print("Simulating Back-Facing Teacher (Writing on Board)")
    print("--------------------------------------------------")
    
    # Simulate 12 frames of activity (teacher at board)
    for i in range(12):
        # We assume TeacherSessionManager keeps teacher=True
        teacher = True
        
        # Raised arm to write
        gesture = True
        
        # Explaining
        speech = True 
        
        # Standing in teacher zone
        person = True
        
        # Face not visible, looking at board
        facing_forward = False
        head_state = "LOOKING_SIDE"
        
        score, status, color = engine.update(
            teacher, gesture, speech, person, facing_forward, head_state
        )
        
        print(f"Frame {i+1} | Score: {score:.2f} | Status: {status}")
        time.sleep(0.1)

if __name__ == "__main__":
    run_simulation()
