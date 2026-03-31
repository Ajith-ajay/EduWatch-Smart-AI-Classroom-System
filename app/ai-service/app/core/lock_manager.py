import time

class LockManager:

    def __init__(self, confirm_duration=60):
        self.confirm_duration = confirm_duration
        self.start_time = None
        self.locked = False

    def update(self, condition_met):

        if self.locked:
            return True

        if condition_met:
            if self.start_time is None:
                self.start_time = time.time()

            elif time.time() - self.start_time >= self.confirm_duration:
                self.locked = True
                return True
        else:
            self.start_time = None

        return False

    def reset(self):
        self.start_time = None
        self.locked = False