# GZsubway-canvas

根据的是百度提供的坐标，canvas的坐标是大的坐标在后面，所以跟实际生活方向相反。所以canvas里的北方在下方，实际生活中北方在上方。

因为根据的是真实坐标，所以跟广州地铁提供的地图不一样。

左侧地图一种写法，右侧地图另一种写法。左侧可以下拉菜单选择线路查看路线，还可以查询站名属于哪个路线；右侧是全地图。

---

补充：

绘制的位置和offsetCal、defaultCal相关，这是我经过计算/微调得到的计算方式。

看mess.js里所有的经纬度就可以发现，都是113.xxx，23.xxx，绘制出来会在一个位置附近。

那么，就需要将这些经纬度数据进行放大，才会得到页面那样的效果。

不同城市的经纬度不同，那么对应的计算方式就需要相应的调整。
