import sounddevice as sd

device_index = 9  # your WASAPI mic

device_info = sd.query_devices(device_index)
print(device_info)
