# -*- coding:utf-8 -*-
# author: Shichen Liu

import cv2
import numpy as np
import json

src = ['heart.png', 'star.png', 'tsinghua.png']
label = ['heart', 'star', 'THU']
res = []

for (i, s) in enumerate(src):
    img = cv2.imread(s, cv2.CV_LOAD_IMAGE_GRAYSCALE)
    img = cv2.resize(img, (100, 60))
    THRESHOLD = 200
    im = np.array(img) < THRESHOLD
    print im.shape
    im = np.hstack((im + 0).tolist()).tolist()
    res.append({'name': label[i], 'map': im})

res = json.dumps(res)
with open('map.json', 'w') as f:
    f.write(res)
