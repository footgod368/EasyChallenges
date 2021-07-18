#!/bin/bash
sed -i "s/import $1/import Menu.$1 as $1/g" `grep . -rl ./src`
