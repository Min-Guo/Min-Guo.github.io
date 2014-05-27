---
layout: post
title: Tic-Tac-Toe
date: 2014-05-24 19:21
draft: true
---
![tic-tac-toe](/images/tic-tac-toe.jpg)
Here is a small game [tic-tac-toe](/tic-tac-toe) written by myself, check [the repositor](https://github.com/Min-Guo/TicTacToe).

---
### Basic coding steps:

1. Convert 3*3 table to one dimension array boardStatus that represents the status of the table.
2. Once player click a dom, then update the array boardStatus and insert an "O".
3. Check the player's moving result. If there have already been three "O" on horizontal, vertical and diagonal direction, alert player win and reset the game.
4. If computer does not win ,check the computer's moving result again. If there have already been two "X" on horizontal, vertical and diagonal direction. The computer occupies the empty position to make it win.
5. If computer cannot take the win step, check the player's moves prevent the player occupies the three dom on horizontal, vertical and diagonal direction.
6. If both 5 and 6 does not satisfy, generate a randomId for computer.
7. Check whether the computer win or not using the same method mentioned in 3. 