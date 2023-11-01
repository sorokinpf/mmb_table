#!/bin/bash

cd build
zip -r mmb_table.zip *
scp mmb_table.zip root@mmb-stats.psorokin.ru:~
ssh root@mmb-stats.psorokin.ru 'cd /var/www/html  && rm -rf * && cp ~/mmb_table.zip .&& unzip mmb_table.zip'
cd ..
