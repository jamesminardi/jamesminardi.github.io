---
title: Terrain Generation
date: 2024-1-25
categories: [Projects, WebGPU]
tags: [Computer Graphics, C++, Web, Windows, Linux]
---

> Project is WIP
{: .prompt-warning }

## About
This write-up showcases an in depth exploration of procedural terrain generation that I completed as an independent study during the Spring 2024 semester. I chose to develop in C++ using the [WebGPU](https://www.w3.org/TR/webgpu) graphics API.

### Learning Outcomes


### What is WebGPU?

WebGPU is the modern successor to [WebGL](https://www.khronos.org/webgl/), providing far better compatibility with modern GPUs, support for GP GPU computations, and access for more advanced GPU features on the web. C++ implementations of the API, such as Google's [Dawn](https://dawn.googlesource.com/dawn) or [WGPU-native](https://wgpu.rs/) can be used to write cross-platform desktop applications and still build to the web using Emscripten. WebGPU has several layers of abstraction, but most notably it adapts to the device's native GPU API including DirectX, Vulkan, OpenGL, and Metal. Overall, WebGPU has a similar learning curve, more modern GPU features, and greater device compatibility compared to OpenGL/WebGL.

### Roadmap

1. Camera Controller (zoom, click to drag, etc.)
2. Dev GUI
2. Generate plane meshes of configurable sizes
3. Adjust mesh using noise as a heightmap 
   - Explore Value, Perlin, Simplex, and Cubic noise varieties.
   - Sample multiple noises at once (Fractional Brownian Motion)
   - Adjust noises individually including scale, amplitude, etc.
4. Color map the terrain based on height, steepness, etc.
5. Dynamically load and unload chunks of terrain
6. Dynamically adjust level of detail a quadtree, clip maps, etc.
7. Cull the terrain using frustum and occlusion
8. Atmospheric effects
   - Lighting
   - Skybox
9. Vegetation
10. Water
11. Post Processing Effects


## Week 0: Learning WebGPU

During my first week, I spent most of my time learning the API. I first created a color picker with an accurate color wheel to select from. I then created a 3d rotating cube to exercise the use of uniforms and projection.

I learned several things during this part, including how to debug buffer data, meshes, and textures on the GPU using [RenderDoc](https://renderdoc.org/).

![img_1.png](img_1.png)

At this point a camera controller can now be built.

## Week 1: Camera Controller

There are many different kinds of cameras that can be implemented:
- First person
- Turntable
- Trackball

For the purposes of this project, a turntable will be used. A turntable camera orbits around a focus point that it remains centered on. Unlike a trackball camera that orbits without any notion of "up", a turntable camera has a fixed up vector.

A `Window` class is used to manage GLFW's input callbacks. Upon execution, it will call the application's corresponding input method allowing for rotation and zoom using the mouse.

For example:
```cpp
void Window::glfwScrollCallback(GLFWwindow *window, double xOffset, double yOffset) {
  auto* app = reinterpret_cast<Application*>(glfwGetWindowUserPointer(window));
  if (app) {
    app->onScroll( {xOffset, yOffset} );
  }
}
```

```cpp
void Application::onScroll(vec2 scrollOffset) {
  camera.zoom += camera.scrollSensitivity * scrollOffset.y);
  camera.zoom = clamp(camera.zoom, -2.0f, 2.0f);
  camera.updateViewMatrix();
}
 ```


The camera is defined using [spherical coordinates](https://en.wikipedia.org/wiki/Spherical_coordinate_system) (r, theta, phi), where `r` is the distance to the center, `theta` is the rotation about the vertical y-axis, and `phi` is the rotation about the horizontal plane.

These values are then converted to cartesian coordinates (x, y, z), corresponding to the camera's position. The GLM function `lookAt` is then used to rotate the camera towards a fixed point (in this case the world origin).

## Week 2: The Plane


## References

The following references were used in the development in this project:

### WebGPU
- [WebGPU C++ Guide](https://eliemichel.github.io/LearnWebGPU/)

### Noise

- [Nvidia GPU Gems 2: Chapter 26. Implementing Improved Perlin Noise](https://developer.nvidia.com/gpugems/gpugems2/part-iii-high-quality-rendering/chapter-26-implementing-improved-perlin-noise)
- [Job Talle, Cubic Noise](https://jobtalle.com/cubic_noise.html)
- Fractional Brownian Noise
  - [Procedural Fractal Terrains](https://www.classes.cs.uchicago.edu/archive/2015/fall/23700-1/final-project/MusgraveTerrain00.pdf)
  - [Inigo Quilez, Fractional Brownian Motion](https://iquilezles.org/articles/fbm/)

### Fine Detail
- [Hans Theobald Beyer, Implementation of a method for hydraulic erosion](https://www.firespark.de/resources/downloads/implementation%20of%20a%20methode%20for%20hydraulic%20erosion.pdf)
- [Water erosion on heightmap terrain](https://ranmantaru.com/blog/2011/10/08/water-erosion-on-heightmap-terrain/)
- [Job Talle, Simulating Hydraulic Erosion](https://jobtalle.com/simulating_hydraulic_erosion.html)
- 

### Level of Detail
 - [SimonDev, QuadTree LOD](https://www.youtube.com/watch?v=YO_A5w_fxRQ)
 - [Nvidia GPU Gems 2: Chapter 2. Terrain Rendering Using GPU-Based Geometry Clipmaps](https://developer.nvidia.com/gpugems/gpugems2/part-i-geometric-complexity/chapter-2-terrain-rendering-using-gpu-based-geometry)

### Terrain culling: Frustum, occlusion
 - [Nvidia GPU Gems: Chapter 29, Efficient Occlusion Culling](https://developer.nvidia.com/gpugems/gpugems/part-v-performance-and-practicalities/chapter-29-efficient-occlusion-culling#:~:text=Occlusion%20culling%20increases%20rendering%20performance,query%20and%20early%2Dz%20rejection.)
 - [Nvidia GPU Gems 2: Chapter 6, Hardware Occlusion Queries Made Useful](https://developer.nvidia.com/gpugems/gpugems2/part-i-geometric-complexity/chapter-6-hardware-occlusion-queries-made-useful)

### Vegetation
- [Nvidia GPU Gems 2: Chapter 1, Toward Photorealism in Virtual Botany](https://developer.nvidia.com/gpugems/gpugems2/part-i-geometric-complexity/chapter-1-toward-photorealism-virtual-botany)
- [Responsive real-time grass rendering for general 3d scenes](https://dl.acm.org/doi/10.1145/3023368.3023380)
