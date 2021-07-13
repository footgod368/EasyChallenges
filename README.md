## Overview
- Finish MVP, you can play this game by entering "elm make src/Main.elm" in this directory and open index.html, or 
  use makefile directly.
- In this scene, the **black block** is you, the **Green block** is savepoint, you need to jump to the **red block**, which is the   endpoint. You may be trapped at most 3 times. If you touch the red line at the buttom, you can press **R** to go back to the last   savepoint.
- Finish (according to roadmap)
  - core unit: `player`, `event`, `brick`, `needle`.
  - core function: `structure`, `viewChange`, `collision`.
  - additional unit: `notice board`.
  - One single level
- Haven't finish

### Details
- The structure of the game is well designed, see details in roadmap
- Fix many bugs during the development, which consumes lots of time, bugs namely
  - Walking on the ground will sink down
  - Walking ont the ground is half speed of when jumping
  - Colliding the wall while jumping will make the jumping speed only half
  - Cannot jump at the edge of the brick
  - Can climb wall by pressing jump button a lot
  - High frequency of pressing jump button leads to error