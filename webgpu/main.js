
let GRID_SIZE = 32;
let WORKGROUP_SIZE = 8;
let UPDATE_INTERVAL = 8; // 200ms (5 times/sec)
let step = 0;
let update_data = false;

let input_grid_size = 32;
let input_workgroup_size = 8;
let input_update_per_sec = 8;

let simulationPipeline;
let cellPipeline;
let bindGroups;
let pipelineLayout;

let device;
let cellShaderModule;
let simulationShaderModule;
let vertexBufferLayout;
let canvasFormat;

function updateConstants() {

	input_grid_size = document.getElementById("grid_size").value;
	input_workgroup_size = document.getElementById("workgroup_size").value;
	input_update_per_sec = document.getElementById("update_per_sec").value;


	if (GRID_SIZE !== input_grid_size) {
		if (input_grid_size > 4 && input_grid_size < 256) {
			GRID_SIZE = input_grid_size;
			update_data = true;
		}
	}

	if (WORKGROUP_SIZE !== input_workgroup_size) {
		if (input_workgroup_size > 1 && input_workgroup_size < 256 ) {
			WORKGROUP_SIZE = input_workgroup_size;
			update_data = true;
		}
	}

	if (UPDATE_INTERVAL !== input_update_per_sec) {
		if (input_update_per_sec > 1 && input_update_per_sec < 100 ) {
			UPDATE_INTERVAL = input_update_per_sec;
			update_data = true;
		}
	}

	if (update_data === true) {
		console.log("Updating data");
		update_data = false;
		updateData();
	}
}

async function getShaderSource(url) {
    let source;
    await fetch(url).then(response => response.text())
        .then(text => {
            // console.log(text);
            source = text;
        });
    // console.log(source);
    return source;
}

function updateData()
{

	// Create uniform buffer
	let uniformArray = new Float32Array([GRID_SIZE, GRID_SIZE]); // could use ints, but have to cast to floats anyways in shader
	let uniformBuffer = device.createBuffer({
		label: "Grid Uniforms",
		size: uniformArray.byteLength,
		usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
	});
	device.queue.writeBuffer(uniformBuffer, 0, uniformArray);

	// Create cell state storage buffer
	// Storage buffers can be larger than uniforms and don't require declared size in shader
	let cellStateArray = new Uint32Array(GRID_SIZE * GRID_SIZE);
	let cellStateStorage = [
		device.createBuffer({
			label: "Cell State A",
			size: cellStateArray.byteLength,
			usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
		}),
		device.createBuffer({
			label: "Cell State B",
			size: cellStateArray.byteLength,
			usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
		})
	];

	// Mark every third cell of the grid as active.
	for (let i = 0; i < cellStateArray.length; ++i) {
		cellStateArray[i] = Math.random() > 0.6 ? 1 : 0;
	}
	device.queue.writeBuffer(cellStateStorage[0], 0, cellStateArray);
	device.queue.writeBuffer(cellStateStorage[1], 0, cellStateArray);


	// Create the bind group layout and pipeline layout.
	let bindGroupLayout = device.createBindGroupLayout({
		label: "Cell Bind Group Layout",
		entries: [{
			binding: 0,
			visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT | GPUShaderStage.COMPUTE,
			buffer: {} // Grid uniform buffer
		}, {
			binding: 1,
			visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT | GPUShaderStage.COMPUTE,
			buffer: {type: "read-only-storage"} // Cell state input buffer
		}, {
			binding: 2,
			visibility: GPUShaderStage.COMPUTE,
			buffer: {type: "storage"} // Cell state output buffer
		}]
	});


	// Create bind group: collection of resources to make available to shader at the same time
	bindGroups = [

		device.createBindGroup({
			label: "Cell renderer bind group A",
			layout: bindGroupLayout, // corresponds to @group(0) in shader
			entries: [{
				binding: 0, // corresponds to @binding(0) in shader
				resource: {buffer: uniformBuffer}
			},
				{
					binding: 1,
					resource: {buffer: cellStateStorage[0]}
				},
				{
					binding: 2,
					resource: {buffer: cellStateStorage[1]}
				}],
		}),
		device.createBindGroup({
			label: "Cell renderer bind group B",
			layout: bindGroupLayout,
			entries: [{
				binding: 0, // corresponds to @binding(0) in shader
				resource: {buffer: uniformBuffer}
			},
				{
					binding: 1,
					resource: {buffer: cellStateStorage[1]}
				},
				{
					binding: 2,
					resource: {buffer: cellStateStorage[0]}
				}],
		}),
	];


	pipelineLayout = device.createPipelineLayout({
		label: "Cell Pipeline Layout",
		bindGroupLayouts: [bindGroupLayout],
	});

	// Create a pipeline that renders the cell.
	// Links the shaders to the buffer data
	cellPipeline = device.createRenderPipeline({
		label: "Cell pipeline",
		layout: pipelineLayout,
		vertex: {
			module: cellShaderModule, // Shader
			entryPoint: "vertexMain", // shader function name
			buffers: [vertexBufferLayout] // buffer data to send as input
		},
		fragment: {
			module: cellShaderModule,
			entryPoint: "fragmentMain",
			targets: [{
				format: canvasFormat
			}]
		}
	});

	simulationPipeline = device.createComputePipeline({
		label: "Simulation Pipeline",
		layout: pipelineLayout,
		compute: {
			module: simulationShaderModule,
			entryPoint: "computeMain",
		}
	})

}

async function main() {

	const canvas = document.querySelector("canvas");

	console.log("Test");

	if (!navigator.gpu) {
		throw new Error("WebGPU not supported on this browser.");
	}

	const adapter = await navigator.gpu.requestAdapter();
	if (!adapter) {
		throw new Error("No appropriate GPUAdapter found.");
	}

	device = await adapter.requestDevice();

	const context = canvas.getContext("webgpu");
	canvasFormat = navigator.gpu.getPreferredCanvasFormat();
	context.configure({
		device: device,
		format: canvasFormat,
	});



	const vertices = new Float32Array([
		//   X,    Y,
		-0.8, -0.8, // Triangle 1 (Blue)
		0.8, -0.8,
		0.8,  0.8,

		-0.8, -0.8, // Triangle 2 (Red)
		0.8,  0.8,
		-0.8,  0.8,
	]);


	


	// Create GPUBuffer object
	// GL: GenBuffer
	const vertexBuffer = device.createBuffer({
		label: "Cell vertices", // Optional label for debugging
		size: vertices.byteLength, // Buffer size (bytes)
		// GPUBufferUsage flags
		usage: GPUBufferUsage.VERTEX | // Use buffer for vertex data
		GPUBufferUsage.COPY_DST, // Allow copying of data into buffer
	});

	// Copy data from vertices into buffer
	// GL: BufferData
	device.queue.writeBuffer(vertexBuffer, /*bufferOffset=*/0, vertices);

	// Describe how to interpret the buffer data
	// GL: VertexAttribPointer
	vertexBufferLayout = {
		arrayStride: 8,
		attributes: [{
			format: "float32x2", // Vertices have two 32-bit floats each (2D image)
			offset: 0,
			shaderLocation: 0, // Position. Matches @location(0) in the @vertex shader.
		}],
	};


	// Use separate shader file or in comment
	// --------------------------------------
	// const host = 'http://localhost:5500/';

	// const cellShaderUrl = host + 'shaders/cellshader.wgsl';
	// let cellShaderSource = await getShaderSource(cellShaderUrl);
	
	let cellShaderSource = /* wgsl */`
	
		struct VertInput {
			@location(0) pos: vec2f,
			@builtin(instance_index) instance: u32,
		}

		struct VertOutput {
			@builtin(position) pos: vec4f,
			@location(0) cell: vec2f,
		}

	@group(0) @binding(0) var<uniform> grid: vec2f;
	@group(0) @binding(1) var<storage> cellState: array<u32>;
	
	@vertex
		// input must match buffer layout
		fn vertexMain(input: VertInput) -> VertOutput {

			let i = f32(input.instance);
			let cell = vec2f(i % grid.x, floor(i / grid.y));
			let state = f32(cellState[input.instance]);

			let cellOffset = cell/grid * 2;

			let gridPos = (input.pos * state + 1) / grid - 1 + cellOffset;

			var output: VertOutput;
			output.pos = vec4f(gridPos, 0, 1);
			output.cell = cell;
			return output;

		}


	@fragment
		fn fragmentMain(input: VertOutput) ->
		/*returns:*/@location(0) vec4f {
			let c = input.cell / grid;
			return vec4f(c, 1 - c.x, 1);

		}
	`;
	// --------------------------------------

	cellShaderModule = device.createShaderModule({
		label: 'Cell shader',
		code: cellShaderSource,
	});



	simulationShaderModule = device.createShaderModule({
		label: "Game of Life simulation shader",
		code: /* wgsl */`

			@group(0) @binding(0) var<uniform> grid: vec2f;

			@group(0) @binding(1) var<storage> cellStateIn: array<u32>;
			@group(0) @binding(2) var<storage, read_write> cellStateOut: array<u32>;

			fn cellIndex(cell: vec2u) -> u32 {
				return (cell.y % u32(grid.y)) * u32(grid.x) +
					   (cell.x % u32(grid.x));
			}
			fn cellActive(x: u32, y: u32) -> u32 {
				return cellStateIn[cellIndex(vec2(x, y))];
			}

			@compute
			@workgroup_size(${WORKGROUP_SIZE}, ${WORKGROUP_SIZE}, 1)
			fn computeMain(@builtin(global_invocation_id) cell: vec3u) {
				let activeNeighbors = 	cellActive(cell.x+1, cell.y+1) +
										cellActive(cell.x+1, cell.y) +
										cellActive(cell.x+1, cell.y-1) +
										cellActive(cell.x, cell.y-1) +
										cellActive(cell.x-1, cell.y-1) +
										cellActive(cell.x-1, cell.y) +
										cellActive(cell.x-1, cell.y+1) +
										cellActive(cell.x, cell.y+1);

				let i = cellIndex(cell.xy);

				// Conway's game of life rules:
				switch activeNeighbors {
					case 2: { // Active cells with 2 neighbors stay active.
						cellStateOut[i] = cellStateIn[i];
					}
					case 3: { // Cells with 3 neighbors become or stay active.
						cellStateOut[i] = 1;
					}
					default: { // Cells with < 2 or > 3 neighbors become inactive.
						cellStateOut[i] = 0;
					}
				}
			}
		`
	})




	updateData();

	GRID_SIZE = input_grid_size;
	WORKGROUP_SIZE = input_workgroup_size;
	UPDATE_INTERVAL = input_update_per_sec;

	// Draw the square.
	function updateGrid() {


		// updateConstants();
	
		// Start render pass
		let encoder = device.createCommandEncoder();



		// Compute work
		// ------------
		let computePass = encoder.beginComputePass();

		computePass.setPipeline(simulationPipeline);
		computePass.setBindGroup(0, bindGroups[step % 2]);

		let workgroupCount = Math.ceil(GRID_SIZE / WORKGROUP_SIZE);
		computePass.dispatchWorkgroups(workgroupCount, workgroupCount);

		computePass.end();
		// ------------

		step++
	
		// Clear the canvas with a render pass
		let pass = encoder.beginRenderPass({
			colorAttachments: [{
				view: context.getCurrentTexture().createView(),
				loadOp: "clear",
				clearValue: [0.0, 0.15, 0.3, 1 ],
				storeOp: "store",
			}]
		});
	
		// Draw grid
		pass.setPipeline(cellPipeline);
		pass.setVertexBuffer(0, vertexBuffer); // 0: 0th element in the current pipeline's vertex.buffers
		pass.setBindGroup(0, bindGroups[step % 2]); // Each binding that's part of @group(0) uses the resources in the bindGroup
	
		 // Number of vertices (vertices has 2 element per vertex)
		 // Number of instances to draw at once, indexable in shader
		pass.draw(vertices.length / 2, GRID_SIZE * GRID_SIZE );
	
		pass.end();
	
		device.queue.submit([encoder.finish()]);
	
	}

	setInterval(updateGrid, 1/UPDATE_INTERVAL * 1000);

	console.log("Test");

}
