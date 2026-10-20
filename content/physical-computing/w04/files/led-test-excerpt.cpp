// From led-test.ino: test the two sticks separately.
// 16 RGB pixels in series; each stick has 8.
case '1':
      pixels.clear(); pixels.fill(pixels.Color(24,0,0),0,8); pixels.show(); break;
    case '2':
      pixels.clear(); pixels.fill(pixels.Color(0,24,0),8,8); pixels.show(); break;
