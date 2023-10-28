from time import sleep
from MPU6050 import read_accel
from buzzer import activate_buzz

while True:
    acc = read_accel()
    print(acc)
    sleep(1)