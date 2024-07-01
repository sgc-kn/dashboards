import pandas as pd
import sys

df = pd.read_csv('data/merged_speed.csv')
ss = df.query('index == 42')

ss.to_csv(sys.stdout, index=False)
