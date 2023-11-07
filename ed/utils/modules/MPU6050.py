#Include the library files
import RPi.GPIO as GPIO
import smbus 
import json
from time import sleep
import threading
import math
from ed import socketio
import random

#some MPU6050 Registers and their Address
PWR_MGMT_1   = 0x6B
SMPLRT_DIV   = 0x19
CONFIG       = 0x1A
GYRO_CONFIG  = 0x1B
INT_ENABLE   = 0x38
ACCEL_XOUT = 0x3B
ACCEL_YOUT = 0x3D
ACCEL_ZOUT = 0x3F
GYRO_XOUT  = 0x43
GYRO_YOUT  = 0x45
GYRO_ZOUT  = 0x47

bus = smbus.SMBus(1) # or bus = smbus.SMBus(0) for older version boards
Device_Address = 0x68 # MPU6050 device address

def MPU_Init():
    # Setup GPIO pins
    GPIO.setmode(GPIO.BCM)
    GPIO.setwarnings(False)
    # Set the servo motor pin as output pin
    GPIO.setup(4,GPIO.OUT)

    pwm = GPIO.PWM(4,50)
    pwm.start(0)
    
    #write to sample rate register
    bus.write_byte_data(Device_Address, SMPLRT_DIV, 7)

    #Write to power management register
    bus.write_byte_data(Device_Address, PWR_MGMT_1, 1)

    #Write to Configuration register
    bus.write_byte_data(Device_Address, CONFIG, 0)

    #Write to Gyro configuration register
    bus.write_byte_data(Device_Address, GYRO_CONFIG, 24)

    #Write to interrupt enable register
    bus.write_byte_data(Device_Address, INT_ENABLE, 1)

def read_raw_data(addr):
    #Accelero and Gyro value are 16-bit
    high = bus.read_byte_data(Device_Address, addr)
    low = bus.read_byte_data(Device_Address, addr+1)

    #concatenate higher and lower value
    value = ((high << 8) | low)
    
    #to get signed value from mpu6050
    if(value > 32768):
            value = value - 65536
    return value
    
readings_lock = threading.Lock()
readings = {
    'ax': 0.0,
    'ay': 0.0,
    'az': 0.0,
    'gx': 0.0,
    'gy': 0.0,
    'gz': 0.0,
    'mag': 0.0
}

def read():
    global readings  # Add this line to ensure we are using the global variable

    MPU_Init()
    print("sensor initialized")
    # from ed.utils.modules.LCD import write_str

    while True:
        acc_x = read_raw_data(ACCEL_XOUT)
        acc_y = read_raw_data(ACCEL_YOUT)
        acc_z = read_raw_data(ACCEL_ZOUT)
        gyro_x = read_raw_data(GYRO_XOUT)
        gyro_y = read_raw_data(GYRO_YOUT)
        gyro_z = read_raw_data(GYRO_ZOUT)

        with readings_lock:
            readings['ax'] = acc_x / 16384.0
            readings['ay'] = acc_y / 16384.0
            readings['az'] = acc_z / 16384.0
            readings['gx'] = gyro_x / 131.0
            readings['gy'] = gyro_y / 131.0
            readings['gz'] = gyro_z / 131.0
            readings['mag'] = get_vector_acc(readings['ax'], readings['ay'], readings['az'] - 0.98)

            #Print to LCD
            # write_str(0, 0, f"ax:{readings['ax']:.2f}")
            # write_str(1, 0, f"ay:{readings['ay']:.2f}")
            # write_str(2, 0, f"az:{readings['az']:.2f}")
            # write_str(3, 0, f"mag:{readings['mag']:.2f}")
        


def read_accel():
    with readings_lock:
        return readings.copy()
    
def get_vector_acc(x, y, z):
    return math.sqrt(x*x + y*y + z*z)
