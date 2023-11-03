import RPi.GPIO as GPIO
from time import sleep
from ed.utils.modules.MPU6050 import read_accel

buzzer = 5                  # Set buzzer - pin 23 as output
GPIO.setwarnings(False)     # Disable warnings (optional)
GPIO.setmode(GPIO.BCM)      # Select GPIO mode

# Set the PWM frequency and duty cycle
frequency = 2000
duty_cycle = 70

def buzz_init():
    GPIO.setup(buzzer,GPIO.OUT)
    # Initialize the PWM signal
    global bzr
    bzr = GPIO.PWM(buzzer, frequency)

def activate_buzz():
    bzr.start(duty_cycle)

def deactivate_buzz():
    bzr.stop()