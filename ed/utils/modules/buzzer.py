import RPi.GPIO as GPIO
from time import sleep
from MPU6050 import read_accel

#Disable warnings (optional)
GPIO.setwarnings(False)

#Select GPIO mode
GPIO.setmode(GPIO.BCM)

#Set buzzer - pin 23 as output
buzzer = 5 
GPIO.setup(buzzer,GPIO.OUT)

def activate_buzz():
    print("Earthquake detected")
    GPIO.output(buzzer,GPIO.HIGH)
    sleep(0.5)
    GPIO.output(buzzer,GPIO.LOW)
    sleep(0.5)

while True:
    accel = read_accel()
    if (abs(accel.Gx) > 3 | abs(accel.Gy) > 3 | abs(accel.Gz) > 3):
        activate_buzz()
    sleep(1)