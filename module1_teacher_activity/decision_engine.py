def decide(person, gesture, voice):

    if person and gesture and voice:
        return "TEACHING ACTIVE", (0,255,0)

    elif person and gesture:
        return "TEACHING LIKELY", (0,255,255)

    elif person:
        return "TEACHER PRESENT", (255,0,0)

    else:
        return "NO TEACHER", (0,0,255)
