import RPi.GPIO as GPIO
import smbus
import threading
import math
from ed.utils.modules.LCD import write_str

# some MPU6050 Registers and their Address
PWR_MGMT_1 = 0x6B
SMPLRT_DIV = 0x19
CONFIG = 0x1A
GYRO_CONFIG = 0x1B
INT_ENABLE = 0x38
ACCEL_XOUT = 0x3B
ACCEL_YOUT = 0x3D
ACCEL_ZOUT = 0x3F
GYRO_XOUT = 0x43
GYRO_YOUT = 0x45
GYRO_ZOUT = 0x47

bus = smbus.SMBus(1)  # or bus = smbus.SMBus(0) for older version boards
Device_Address = 0x68  # MPU6050 device address
filter_coeff = 0.1
filtered_shake = 0


def MPU_Init():
    GPIO.setmode(GPIO.BCM)
    GPIO.setwarnings(False)
    bus.write_byte_data(Device_Address, SMPLRT_DIV, 7)  # write to sample rate register
    bus.write_byte_data(
        Device_Address, PWR_MGMT_1, 1
    )  # Write to power management register
    bus.write_byte_data(Device_Address, CONFIG, 0)  # Write to Configuration register
    bus.write_byte_data(
        Device_Address, GYRO_CONFIG, 24
    )  # Write to Gyro configuration register
    bus.write_byte_data(
        Device_Address, INT_ENABLE, 1
    )  # Write to interrupt enable register


def read_raw_data(addr):
    high = bus.read_byte_data(Device_Address, addr)
    low = bus.read_byte_data(Device_Address, addr + 1)
    value = (high << 8) | low
    if value > 32768:
        value = value - 65536
    return value


def get_magnitude(x, y, z):
    global filtered_shake
    shake = math.sqrt(x * x + y * y + z * z)
    shake -= 0.981
    shake *= shake
    filtered_shake = (shake * filter_coeff) + (filtered_shake * (1 - filter_coeff))
    return filtered_shake * 10

readings_lock = threading.Lock()
readings = {
    "ax": 0.0,
    "ay": 0.0,
    "az": 0.0,
    "gx": 0.0,
    "gy": 0.0,
    "gz": 0.0,
    "mag": 0.0,
}


def read():
    global readings
    MPU_Init()
    print("sensor initialized")

    while True:
        acc_x = read_raw_data(ACCEL_XOUT)
        acc_y = read_raw_data(ACCEL_YOUT)
        acc_z = read_raw_data(ACCEL_ZOUT)
        gyro_x = read_raw_data(GYRO_XOUT)
        gyro_y = read_raw_data(GYRO_YOUT)
        gyro_z = read_raw_data(GYRO_ZOUT)

        with readings_lock:
            readings["ax"] = acc_x / 16384.0
            readings["ay"] = acc_y / 16384.0
            readings["az"] = acc_z / 16384.0
            readings["gx"] = gyro_x / 131.0
            readings["gy"] = gyro_y / 131.0
            readings["gz"] = gyro_z / 131.0
            readings["mag"] = get_magnitude(
                readings["ax"], readings["ay"], readings["az"]
            )

            # Print to LCD
            write_str(0, 0, f"ax:{readings['ax']:.2f}")
            write_str(1, 0, f"ay:{readings['ay']:.2f}")
            write_str(2, 0, f"az:{readings['az']:.2f}")
            write_str(3, 0, f"mag:{readings['mag']:.2f}")


def read_accel():
    with readings_lock:
        return readings.copy()
