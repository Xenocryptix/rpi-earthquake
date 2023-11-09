import RPi.GPIO as GPIO
import time

# Set the GPIO pin number to which the toggle switch is connected
toggle_switch_pin = 13


def switch_init():
    global toggle_switch_pin
    GPIO.setmode(GPIO.BCM)
    toggle_switch_pin = 13
    GPIO.setup(toggle_switch_pin, GPIO.IN, pull_up_down=GPIO.PUD_UP)


def read_switch():
    switch_state = GPIO.input(toggle_switch_pin)
    if switch_state == GPIO.HIGH:
        # print("Toggle switch is closed")
        return True
    else:
        # print("Toggle switch is opened")
        return False


if __name__ == "__main__":
    switch_init()
    try:
        while True:
            read_switch()
            # Wait for a short duration to avoid rapid polling
            time.sleep(0.1)
    except KeyboardInterrupt:
        # Clean up GPIO settings on keyboard interrupt
        GPIO.cleanup()
