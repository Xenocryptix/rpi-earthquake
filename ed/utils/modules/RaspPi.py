# Import necessary libraries
from RPLCD import CharLCD
from RPLCD.i2c import CharLCD as I2CLCD
import RPi.GPIO as GPIO
from smbus2 import SMBus


import json
import time

# Initialize the LCD display
lcd = I2CLCD('PCF8574', 0x27)
lcd.backlight_enabled = True
lcd.clear()

# Initialize the MPU6050 sensor
bus = SMBus(1)
Device_Address = 0x68

# Some MPU6050 Registers and their Address
ACCEL_XOUT = 0x3B
ACCEL_YOUT = 0x3D
ACCEL_ZOUT = 0x3F
GYRO_XOUT = 0x43
GYRO_YOUT = 0x45
GYRO_ZOUT = 0x47


def read_raw_data(addr):
    high = bus.read_byte_data(Device_Address, addr)
    low = bus.read_byte_data(Device_Address, addr + 1)
    value = ((high << 8) | low)
    if value > 32768:
        value = value - 65536
    return value

#Disable warnings (optional)
GPIO.setwarnings(False)

#Select GPIO mode
GPIO.setmode(GPIO.BCM)

# Set the PWM frequency and duty cycle
frequency = 2000  # You can adjust this frequency
duty_cycle = 50  # You can adjust this duty cycle (0% to 100%)


#Set buzzer - pin 23 as output
buzzer = 5 
GPIO.setup(buzzer,GPIO.OUT)

# Initialize the PWM signal
pwm = GPIO.PWM(buzzer, frequency)

def activate_buzz():
    GPIO.output(buzzer,GPIO.HIGH)


try:
    while True:
        # Read Accelerometer raw value
        acc_x = read_raw_data(ACCEL_XOUT)
        acc_y = read_raw_data(ACCEL_YOUT)
        acc_z = read_raw_data(ACCEL_ZOUT)
        # Read Gyroscope raw value
        gyro_x = read_raw_data(GYRO_XOUT)
        gyro_y = read_raw_data(GYRO_YOUT)
        gyro_z = read_raw_data(GYRO_ZOUT)

        # Convert to meaningful values
        Ax = acc_x / 16384.0
        Ay = acc_y / 16384.0
        Az = acc_z / 16384.0
        Gx = gyro_x / 131.0
        Gy = gyro_y / 131.0
        Gz = gyro_z / 131.0

        # Create a dictionary with the data
        data = {
            'Ax': Ax,
            'Ay': Ay,
            'Az': Az,
            'Gx': Gx,
            'Gy': Gy,
            'Gz': Gz,
        }

        # Format the data as a string
        data_str = json.dumps(data, indent=4)

        # Clear the LCD
        lcd.clear()

        # Display the data on the LCD
        lcd.cursor_pos = (0, 0)
        lcd.write_string(f'Gx: {Gx:.2f}')

        lcd.cursor_pos = (1, 0)
        lcd.write_string(f'Gy: {Gy:.2f}')

        lcd.cursor_pos = (2, 0)
        lcd.write_string(f'Gz: {Gz:.2f}')

        if(abs(Gx) > 3 or abs(Gy) > 3 or abs(Gz) > 3):
            lcd.cursor_pos = (3, 0)
            lcd.write_string("EARTHQUAKE DETECTOR!")
            pwm.start(duty_cycle)
        else:
            lcd.cursor_pos = (3, 0)
            lcd.write_string("NO EARTHQUAKE DETECTED")
            pwm.stop()  # Stop the buzzer when no earthquake is detected    

        
        # Sleep for a while (adjust the sleep time as needed)
        time.sleep(1)

except KeyboardInterrupt:
    # Clean up and exit on Ctrl+C
    lcd.clear()
    lcd.close()

