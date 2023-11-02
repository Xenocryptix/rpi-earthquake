#Initialize the display
from RPLCD import *
from time import sleep
from RPLCD.i2c import CharLCD

lcd = CharLCD('PCF8574', 0x27)
lcd.backlight_enabled = True
lcd.cursor_pos = (0,0)

def write_str(x,y,string):
    lcd.cursor_pos = (x,y)
    lcd.write_string(string)
