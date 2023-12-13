---
title: MIPS Processor (Technical)
date: 2023-12-3
categories: [Projects, MIPS Processor]
tags: [Computer Architecture, VHDL, Assembly, Optimization, ModelSim, Quartus Prime]
---

> This is a technical description of my MIPS processor project. To read from a non-technical perspective, check out [MIPS Processor (Non-Technical)](../MIPSProcessorNonTechnical).
{: .prompt-info }

> WIP
{: .prompt-warning }

## About
This write-up showcases an in depth exploration of three different processor designs: a [single-cycle design](https://github.com/jamesminardi/mips-single-cycle-processor), a [software-scheduled pipeline](https://github.com/jamesminardi/mips-pipeline-processor), and a [hardware-scheduled pipeline](https://github.com/jamesminardi/mips-pipeline-processor). Each processor underwent careful design, implementation, and performance analysis, highlighting the practical applications and tradeoffs involved in computer architecture.

The primary objective was to create functioning MIPS assembly processors with schematic designs, control spreadsheets, and VHDL implementation. The single-cycle processor, built first, introduced us to novel concepts in computer architecture design. The design, components, and tests were all created from scratch, and  subsequent processors based on the single-cycle design aimed to optimize performance through pipeline strategies and hazard mitigation.

A set of test benches were compiled in order to determine the performance of each of the three processor designs. Each one demonstrates a set of advantages and disadvantages that must be considered when choosing one implementation over another.

#### [View the source code](https://github.com/jamesminardi/mips-pipeline-processor) 

## 2 Instruction Set
**Produce**: Change registers or memory

**Consume**: Access registers or memory

<img src="/assets/processor/instruction_set.png" style="width:80%; height:80%; margin:0;" alt="">

### Control Logic

<img src="/assets/processor/control_logic.png" style="width:100%; height:100%; margin:0;" alt="">




## 3 Single-Cycle Processor
### 3.1 Design
### 3.2 HW Optimization
### 3.2 Benchmarks
<img src="/assets/processor/ss_benchmark.png" style="width:80%; height:80%; margin:0;" alt="">

|   **Test**   | **# Instr** | **# Cycles** | **CPI** | **Cycle Time** | **Ex Time** |
|:------------:|:-----------:|:------------:|:-------:|:--------------:|:-----------:|
|    _Base_    |     36      |      36      |  1.00   |     49.80      |    1,793    |
| _Bubblesort_ |     380     |     380      |  1.00   |     49.80      |   18,924    |
|  _Grendel_   |    2,115    |    2,114     |  1.00   |     49.80      |   105,327   |
|              |             |              |         |      *ns*      |    *ns*     |


## 4 Software Scheduled Pipeline Processor
### 4.1 Design
### 4.2 HW Optimization
### 4.3 Benchmarks
<img src="/assets/processor/sw_benchmark.png" style="width:80%; height:80%; margin:0;" alt="">

|   **Test**   | **# Instr** | **# Cycles** | **CPI** | **Cycle Time** | **Ex Time** |
|:------------:|:-----------:|:------------:|:-------:|:--------------:|:-----------:|
|    _Base_    |     111     |     120      |  1.08   |     17.91      |    2,147    |
| _Bubblesort_ |     936     |     1213     |  1.30   |     17.91      |   21,793    |
|  _Grendel_   |    5,957    |    6,937     |  1.16   |     17.91      |   123,760   |
|              |             |              |         |      _ns_      |    _ns_     |



## 5 Hardware Scheduled Pipeline Processor
### 5.1 Design
#### 5.1.1 Design Diagram
<img src="/assets/processor/hardware_diagram.jpg" style="width:90%; height:90%; margin:0;" alt="">

#### 5.1.2 Data Hazard Avoidance
<img src="/assets/processor/data_hazard.png" style="width:90%; height:90%; margin:0;" alt="">

#### 5.1.3 Control Hazard Avoidance
<img src="/assets/processor/control_hazard.png" style="width:90%; height:90%; margin:0;" alt="">

### 5.2 HW Optimization
### 5.3 Benchmarks
<img src="/assets/processor/hw_benchmark.png" style="width:80%; height:80%; margin:0;" alt="">

|   **Test**   | **# Instr** | **# Cycles** | **CPI** | **Cycle Time** | **Ex Time** |
|:------------:|:-----------:|:------------:|:-------:|:--------------:|:-----------:|
|    _Base_    |     36      |      46      |  1.28   |     20.42      |     941     |
| _Bubblesort_ |     380     |     682      |  1.79   |     20.42      |    13890    |
|  _Grendel_   |    2,115    |    3,191     |  1.51   |     	20.42     |    65214    |
|              |             |              |         |      _ns_      |    _ns_     |


## 6 Software Optimization




## 7 Analysis
<img src="/assets/processor/full_benchmark.png" style="width:80%; height:80%; margin:0;" alt="">

### 7.1 Execution Times
<img src="/assets/processor/test_bench.png" style="width:90%; height:90%; margin:0;" alt="">

### 7.2 Branch Sequence Test

<img src="/assets/processor/branch_benchmark.png" style="width:80%; height:80%; margin:0;" alt="">

|   **Test**    | **# Instr** | **# Cycles** | **CPI** | **Cycle Time** | **Ex Time** |
|:-------------:|:-----------:|:------------:|:-------:|:--------------:|:-----------:|
| _SingleCycle_ |     41      |      40      |  0.98   |     49.80      |    2,001    |
|  _Hardware_   |     41      |     120      |  2.93   |     20.42      |    2,453    |
|               |             |              |         |      _ns_      |    _ns_     |


## 8 Conclusion


