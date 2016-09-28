# -*- coding:utf-8 -*-
# author: Shichen Liu

import cv2
import numpy as np
import json

src = ['heart.png', 'star.png', 'tsinghua.png']
label = ['heart', 'star', 'funny']
res = []

for (i, s) in enumerate(src):
    img = cv2.imread(s, cv2.CV_LOAD_IMAGE_GRAYSCALE)
    img = cv2.resize(img, (100, 60))
    THRESHOLD = 200
    im = np.array(img) < THRESHOLD
    print im.shape
    im = np.hstack((im + 0).tolist()).tolist()
    res.append({'name': label[i], 'map': im})

funny = np.zeros([60, 100], dtype=int)
ones = [[10, 10], 
		[10, 11],
		[11, 10],
		[11, 11],
		[10, 60],
		[9, 61],
		[9, 62],
		[10, 63],
		[11, 62],
		[11, 61],
		[30, 20],
		[30, 21],
		[30, 22],
		[40, 70],
		[40, 69], 
		[39, 71],
		[41, 70],
		[41, 71]]
for pair in ones:
	funny[pair[0], pair[1]] = 1

res[-1]['map'] = np.hstack(funny.tolist()).tolist()

res = json.dumps(res)
with open('map.json', 'w') as f:
    f.write(res)
