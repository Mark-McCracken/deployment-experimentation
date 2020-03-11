#/usr/bin/python

import random

randomColorFloat = random.random()
errorRate = random.random() * 0.45
latency = random.randint(100, 1500)

print(f"""
Color Value is {randomColorFloat}
Error Rate is {errorRate}
Latency is {latency}
""")


with open("/random-numbers/latency.dat", "a") as f:
    f.write(f"{latency}")

with open("/random-numbers/errorrate.dat", "a") as f:
    f.write(f"{errorRate}")

with open("/random-numbers/randomColorFloat.dat", "a") as f:
    f.write(f"{randomColorFloat}")
