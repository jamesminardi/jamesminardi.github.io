---
title: MIPS Processor (Non-Technical)
date: 2023-12-3
categories: [Projects, MIPS Processor]
tags: [Computer Architecture, VHDL, Assembly, Optimization, ModelSim, Quartus Prime]
---


> This is a non-technical description of my MIPS processor project. To read more from a technical perspective, check out [MIPS Processor (Technical)](../MIPSProcessorTechnical).
{: .prompt-info }


### About
This writeup showcases a simple overview of three different processor designs: a single-cycle design, a software-scheduled pipeline, and a hardware-scheduled pipeline. Each processor underwent careful design, implementation, and performance analysis, highlighting the practical applications and tradeoffs involved in computer architecture.

The primary objective was to create functioning MIPS assembly processors with schematic designs, control spreadsheets, and VHDL implementation. The single-cycle processor, built first, introduced us to novel concepts in computer architecture design. Subsequent processors, based on the single-cycle design, aimed to optimize performance through pipeline strategies and hazard mitigation.


### Skills Acquired:
During the project, I honed my skills in RTL design, VHDL coding, and performance benchmarking. I also gained experience in identifying and mitigating performance bottlenecks, such as the number of no-operation instructions (NOPs) in the software-scheduled pipeline and the lack of forwarding paths for branch and jump register instructions in the hardware-scheduled pipeline.

### Real-World Application:
The skills acquired from this project have broad applications in the field of computer engineering, particularly in the design and optimization of processors. Understanding the trade-offs involved in different design decisions is a crucial skill to have in the field of computer architecture. Moreover, the ability to benchmark and optimize processor performance is just as important for developing efficient computing systems.

### Challenges Faced:
I faced several challenges during the project, including difficulties with unique assembly instructions and testing. I learned the importance of spending time on design before jumping into coding and the value of continuous testing throughout the development process. These challenges provided valuable lessons that will influence my approach to future projects.




