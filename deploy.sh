#!/bin/bash

cd build
zip -r mmb_table.zip *
scp mmb_table.zip psorokin.ru:~
ssh psorokin.ru 'cd ~/mmb_result && rm -rf * && cp ~/mmb_table.zip .&& unzip mmb_table.zip'
cd ..
