---
title: WebGPU Game of Life
date: 2023-12-3
categories: [Projects, WebGPU]
tags: [Computer Graphics, C++, Web]
---

This is [Conway's Game of Life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life) using [WebGPU](https://www.w3.org/TR/webgpu/) for the browser. It utilizes the device's native GPU API for its render and compute pipelines.

This is derived from Google's [Your first WebGPU app](https://codelabs.developers.google.com/your-first-webgpu-app) tutorial series where WebGPU is introduced in the context of a real application.

I'd like to extend this app to allow dynamic input parameters, and add a drawing mode to experiment with different shapes. For now, refreshing the page generates a new random configuration.

___

<body>
  <canvas id="Canvas" width="512" height="512" style="width: 80%; height: 80%">
        Please use a browser that supports "canvas"
    </canvas>
    <script src="/webgpu/main.js"></script>
    <script>window.onload = main</script>
</body>
 

