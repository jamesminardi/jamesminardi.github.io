---
title: "SR Design: Pupil Detection System"
date: 2024-11-2
categories: [Projects]
tags: [Computer Vision, Machine Learning, C++, Python, FPGA, Xilinx Vivado, AMBA (AXI)]
pin: false
---

> For more details on this project, check our [team website](https://sdmay25-01.sd.ece.iastate.edu/).
{: .prompt-info }

## Problem Statement

People with mobility and cognitive impairments, such as Cerebral Palsy, face significant challenges in maintaining independence and safety. Traditional wheelchairs often lack the advanced technologies needed to support these users, leaving gaps in autonomy, communication, and safety. Healthcare professionals and caregivers also struggle with the absence of real-time alerts for medical emergencies like seizures, increasing the risk of delayed responses. These challenges not only affect the quality of life for wheelchair-bound individuals but also limit opportunities for proactive care.

Our senior design client wants to address these issues by developing assistive wheelchair technologies with features such as advanced mobility assistance and real-time seizure detection. This system aims to increase wheelchair user autonomy, improve safety, and reduce caregiver stress. Our team is collaborating with the client to develop a subsystem that detects, locates, and presents information about the user’s eyes in real time that will be used in future iterations of the client’s vision.

## Description
This project focuses on using an embedded camera sensor, computer vision, and machine learning on and FPGA to detect and track a user's eye movements with high accuracy and low latency. The ultimate goal is to provide foundational technology for future teams to build upon.

I am primarily responsible for the hardware integration of the FPGA, Tensil.ai tools, and camera sensor, and display port configuration. I am also contributing to the use of Tensil.ai to compile our ML model. This requires an understanding of the hardware and software interfaces and ability to synthesize and implement the design onto the FPGA.

### Skills Gained
- FPGA programming with Xilinx Vivado
- Integration of machine learning models in embedded systems
- High-speed data processing and debugging for real-time applications
- Hybrid agile-waterfall project management

### Hardware

<img src="/assets/srdesign/ultra96_topology.png" style="width:100%; height:100%; display:block; float:none; margin-left:auto; margin-right:auto; border:3px solid white;" alt="">

- [Ultra96-V2](https://www.avnet.com/wps/portal/us/products/avnet-boards/avnet-board-families/ultra96-v2/) FPGA with JTAG and Daughter card
- IMX219 Camera Sensor
- Display Monitor

### Systems

- MIPI Controller for Camera Sensor
- Region of interest computer vision algorithm for eye detection
- Camera configurable cropping algorithm
- Semantic segmentation ML model for pupil detection
- Tensil.ai for ML model conversion to FPGA
- Display port controller for monitor output







