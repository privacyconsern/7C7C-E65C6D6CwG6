<script lang="ts">
    import { onMount } from 'svelte';
    import type { PageProps } from './$types';
    import plantpic from "$lib/images/plant.png"
    import tablepic from "$lib/images/dinner-table.png"
    import fernpic from "$lib/images/fern.png"
    import square from "$lib/images/stop.png"
    import {RotateCcw, MousePointer, BrickWall, Square, Flower, Flower2, Leaf} from "lucide-svelte";
    let { data }: PageProps = $props();

    const GRID_SIZE = 50;
    function snapToGrid(value) { return Math.round(value / GRID_SIZE) * GRID_SIZE }

    // --- State Variables ---
    let appMode = 'editor'; // 'editor' or 'user'
    // NEW: Added 'plants' to the edit modes
    let editMode = 'cursor'; // 'cursor', 'walls', 'floors', 'table', 'plants'
    // NEW: Added plants array to the floor plan
    let floorPlan = { walls: [], floors: [], tables: [], plants: [] };
    let selectedObject;

    let isDrawing = false;
    let startPoint;
    let previewElement;
    let svgRef; // bound to the SVG element

    let description = '';

    // --- Pan & Zoom State ---
    let viewBox = { x: 0, y: 0, width: 800, height: 600 };
    let isPanning = false;
    let panStartPoint = { x: 0, y: 0 };

    // --- Reactive Computations ---
    $: isEditorMode = appMode === 'editor';
    $: selectedData = selectedObject ? floorPlan[selectedObject.type + 's']?.find(o => o.id === selectedObject.id) : null;

    // --- Mode-specific State ---
    let ghostTable = null;
    let tablePlacementRotation = 0;
    // NEW: State for plant ghost preview and type selection
    let ghostPlant = null;
    let selectedPlantType = 'potted_plant'; // 'potted_plant', 'fern', 'cactus'

    $: if (editMode !== 'table' || editMode !== 'plants') {
        ghostTable = null;
        ghostPlant = null;
    }

    // Update editableInfo when selectedData changes
    $: {
        if (selectedData && selectedData.info) {
            description = selectedData.info;
        } else {
            description = '';
        }
    }

    // --- Event Handlers for Drawing ---
    const getMousePos = (e) => {
        if (!svgRef) return { x: 0, y: 0 };
        const CTM = svgRef.getScreenCTM().inverse();
        const pt = svgRef.createSVGPoint();
        pt.x = e.clientX;
        pt.y = e.clientY;
        const transformedPt = pt.matrixTransform(CTM);
        return {
            x: snapToGrid(transformedPt.x),
            y: snapToGrid(transformedPt.y),
        };
    };
    const handleMouseDown = (e) => {
        if (e.button === 1) { // Middle mouse button for panning
            isPanning = true;
            panStartPoint = { x: e.clientX, y: e.clientY };
            e.preventDefault();
            return;
        }

        if (editMode === 'cursor' || editMode === 'plants' || e.button !== 0) return;
        isDrawing = true;
        startPoint = getMousePos(e);
    };

    const handleMouseMove = (e) => {
        if (isPanning) {
            const dx = e.clientX - panStartPoint.x;
            const dy = e.clientY - panStartPoint.y;

            const scale = viewBox.width / svgRef.clientWidth;
            viewBox.x -= dx * scale;
            viewBox.y -= dy * scale;

            panStartPoint = { x: e.clientX, y: e.clientY };
            return;
        }

        const pos = getMousePos(e);

        if (editMode === 'table') {
            ghostTable = { x: pos.x, y: pos.y, rotation: tablePlacementRotation };
        }
        // NEW: Update ghost plant position
        if (editMode === 'plants') {
            ghostPlant = { x: pos.x, y: pos.y, plantType: selectedPlantType };
        }

        if (!isDrawing) return;

        switch (editMode) {
            case 'walls':
                previewElement = { type: 'line', x1: startPoint.x, y1: startPoint.y, x2: pos.x, y2: pos.y };
                break;
            case 'floors':
                previewElement = {
                    type: 'rect',
                    x: Math.min(startPoint.x, pos.x),
                    y: Math.min(startPoint.y, pos.y),
                    width: Math.abs(pos.x - startPoint.x),
                    height: Math.abs(pos.y - startPoint.y)
                };
                break;
        }
    };

    const handleMouseUp = (e) => {
        if (e.button === 1) {
            isPanning = false;
            return;
        }

        // NEW: Adjusted condition to allow single-click placement for tables and plants
        if (!isDrawing && editMode !== 'table' && editMode !== 'plants') return;

        const pos = getMousePos(e);
        let newElement;

        // The main drawing logic for drag-to-draw elements
        if (isDrawing) {
            switch (editMode) {
                case 'walls':
                    newElement = { id: Date.now(), type: 'wall', x1: startPoint.x, y1: startPoint.y, x2: pos.x, y2: pos.y };
                    floorPlan.walls = [...floorPlan.walls, newElement];
                    break;
                case 'floors':
                    newElement = {
                        id: Date.now(),
                        type: 'floor',
                        x: Math.min(startPoint.x, pos.x),
                        y: Math.min(startPoint.y, pos.y),
                        width: Math.abs(pos.x - startPoint.x),
                        height: Math.abs(pos.y - startPoint.y)
                    };
                    floorPlan.floors = [...floorPlan.floors, newElement];
                    break;
            }
        } else { // Handle single-click placement for tables and plants
            switch (editMode) {
                case 'table':
                    newElement = { id: Date.now(), type: 'table', x: pos.x, y: pos.y, rotation: tablePlacementRotation, info: "Standard 4-person table" };
                    floorPlan.tables = [...floorPlan.tables, newElement];
                    break;
                // NEW: Add plant to the floor plan on click
                case 'plants':
                    newElement = { id: Date.now(), type: 'plant', plantType: selectedPlantType, x: pos.x, y: pos.y };
                    floorPlan.plants = [...floorPlan.plants, newElement];
                    break;
            }
        }

        isDrawing = false;
        startPoint = null;
        previewElement = null;
    };

    const handleMouseLeave = () => {
        isPanning = false;
        isDrawing = false;
        previewElement = null;
        ghostTable = null;
        ghostPlant = null; // NEW: Hide ghost plant
    }

    const handleWheel = (e) => {
        e.preventDefault();
        const zoomFactor = 1.1;
        const { x, y, width, height } = viewBox;
        const mouse = getMousePos(e);

        const newWidth = e.deltaY < 0 ? width / zoomFactor : width * zoomFactor;
        const newHeight = e.deltaY < 0 ? height / zoomFactor : height * zoomFactor;

        const dx = mouse.x - x;
        const dy = mouse.y - y;

        viewBox = {
            x: mouse.x - dx * (newWidth / width),
            y: mouse.y - dy * (newHeight / height),
            width: newWidth,
            height: newHeight,
        };
    }

    const resetView = () => {
        if (svgRef) {
            viewBox = { x: 0, y: 0, width: svgRef.clientWidth, height: svgRef.clientHeight };
        }
    }

    const handleObjectClick = (type, id) => {
        if (isEditorMode && editMode === 'cursor') {
            selectedObject = {type, id};
        } else if (!isEditorMode && type === 'table') { // Can only select tables in user mode
            selectedObject = {type, id};
        }
    }

    // --- UI and Data Logic ---
    const handleExport = () => {
        // NEW: The existing logic works perfectly as it stringifies the whole floorPlan object, which now includes plants.
        const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(floorPlan))}`;
        const link = document.createElement("a");
        link.href = jsonString;
        link.download = "floor-plan.json";
        link.click();
    };
    const handleImport = (event) => {
        const file = event.target.files[0];
        if (!file) return;
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
            try {
                const result = JSON.parse(e.target.result);
                // NEW: Check for core components and add plants array if it exists (for backwards compatibility)
                if (result.walls && result.floors && result.tables) {
                    floorPlan = {
                        walls: result.walls,
                        floors: result.floors,
                        tables: result.tables,
                        plants: result.plants || []
                    };
                } else {
                    alert("Invalid floor plan file.");
                }
            } catch (error) {
                alert("Error parsing file. Make sure it is a valid JSON floor plan.");
            }
        };
        fileReader.readAsText(file);
    };

    const handleSaveLayout= (e) => {
        const jsonString = `data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(floorPlan))}`;
        const response = fetch('api/', {
            method: 'POST',
            body: JSON.stringify({ jsonString }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log(response);
    }

    const toggleAppMode = () => {
        selectedObject = null;
        appMode = appMode === 'editor' ? 'user' : 'editor';
    }

    const handleDelete = () => {
        if (!selectedObject) return;
        const { type, id } = selectedObject;
        floorPlan[`${type}s`] = floorPlan[`${type}s`].filter(obj => obj.id !== id);
        selectedObject = null;
    };

    const handleInfoSave = () => {
        if (!selectedData) return;
        const { type, id } = selectedObject;
        floorPlan[`${type}s`] = floorPlan[`${type}s`].map(obj =>
            obj.id === id ? { ...obj, info: description } : obj
        );
    }

    const handleRotate = (degrees) => {
        if (!selectedData || selectedData.type !== 'table') return;
        const { id } = selectedObject;
        floorPlan.tables = floorPlan.tables.map(table => {
            if (table.id === id) {
                const currentRotation = table.rotation || 0;
                const newRotation = (currentRotation + degrees) % 360;
                return { ...table, rotation: newRotation };
            }
            return table;
        });
    };

    // --- Lifecycle and Keyboard Events ---
    const handleKeyDown = (event) => {
        if (isEditorMode && editMode === 'table' && event.key.toLowerCase() === 'r') {
            event.preventDefault();
            tablePlacementRotation = (tablePlacementRotation + 45) % 360;
            if (ghostTable) {
                ghostTable = {...ghostTable, rotation: tablePlacementRotation};
            }
        }

        if (isEditorMode && editMode === 'cursor' && selectedObject) {
            if (event.key === 'Delete' || event.key === 'Backspace') {
                handleDelete();
            }
        }
    };

    onMount(() => {
        if (svgRef) {
            viewBox.width = svgRef.clientWidth;
            viewBox.height = svgRef.clientHeight;
        }
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    });

</script>

<div class="flex flex-col h-screen bg-slate-200 text-slate-800 font-sans">
    <header class="flex justify-between items-center p-3 bg-white shadow-md z-10">
        <h1 class="text-xl font-bold text-black">{data.restaurants.restaurantName}</h1>
        <div class="flex items-center gap-4">
            {#if isEditorMode}
                <label class="bg-[#2300B0] text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors cursor-pointer text-sm">
                    Import JSON
                    <input type="file" accept=".json" on:change={handleImport} class="hidden"/>
                </label>
                <button on:click={handleExport} class="bg-black text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition-colors text-sm">Export JSON</button>
                <button on:click={handleSaveLayout} class="bg-black text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition-colors text-smy">Save Layout</button>
            {/if}
            <button on:click={toggleAppMode} class="flex items-center gap-2 bg-slate-600 text-white px-4 py-2 rounded-md hover:bg-slate-700 transition-colors">
                {#if isEditorMode}
                    <span>User Mode</span>
                {:else}
                    <span>Editor Mode</span>
                {/if}
            </button>
        </div>
    </header>

    <div class="flex flex-grow overflow-hidden p-4 gap-4">
        <main class="flex-grow flex flex-col gap-4">
            {#if isEditorMode}
                <div class="bg-white p-2 rounded-lg shadow-md flex items-center gap-2 flex-wrap">
                    <button on:click={() => editMode = 'cursor'} class:bg-blue-500={editMode === 'cursor'} class:text-white={editMode === 'cursor'} class="p-3 rounded-md transition-colors text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700" title="Cursor">
                        <MousePointer color="black" />
                    </button>
                    <button on:click={() => editMode = 'walls'} class:bg-blue-500={editMode === 'walls'} class:text-white={editMode === 'walls'} class="p-3 rounded-md transition-colors text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700" title="Walls">
                        <BrickWall color="black" />
                    </button>
                    <button on:click={() => editMode = 'floors'} class:bg-blue-500={editMode === 'floors'} class:text-white={editMode === 'floors'} class="p-3 rounded-md transition-colors text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700" title="Floors">
                        <Square color="black" />
                    </button>
                    <button on:click={() => editMode = 'table'} class:bg-blue-500={editMode === 'table'} class:text-white={editMode === 'table'} class="p-3 rounded-md transition-colors text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700" title="Table">
                        <img src={tablepic} alt="Table" width="20px"/>
                    </button>
                    <button on:click={() => editMode = 'plants'} class:bg-blue-500={editMode === 'plants'} class:text-white={editMode === 'plants'} class="p-3 rounded-md transition-colors text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700" title="Plants">
                        <Flower color="black" />
                    </button>

                    <div class="flex-grow flex justify-end items-center">
                        {#if editMode === 'table'}
                            <div class="text-sm text-slate-500 dark:text-slate-400 pr-2">
                                Press 'R' to rotate | Angle: {tablePlacementRotation}°
                            </div>
                        {/if}
                        {#if editMode === 'plants'}
                            <div class="flex items-center gap-2 p-1 rounded-lg bg-slate-100 dark:bg-slate-700">
                                <button on:click={() => selectedPlantType = 'potted_plant'} class:bg-green-500={selectedPlantType === 'potted_plant'} class:text-white={selectedPlantType === 'potted_plant'} class="p-2 rounded-md transition-colors" title="Potted Plant">
                                    <Flower color="black" />
                                </button>
                                <button on:click={() => selectedPlantType = 'fern'} class:bg-green-500={selectedPlantType === 'fern'} class:text-white={selectedPlantType === 'fern'} class="p-2 rounded-md transition-colors" title="Fern">
                                    <Flower2 color="black" />
                                </button>
                                <button on:click={() => selectedPlantType = 'cactus'} class:bg-green-500={selectedPlantType === 'cactus'} class:text-white={selectedPlantType === 'cactus'} class="p-2 rounded-md transition-colors" title="Cactus">
                                    <Leaf color="black" />
                                </button>
                            </div>
                        {/if}
                        <button on:click={resetView} class="p-3 ml-4 rounded-md transition-colors text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700" title="Reset View">
                            <RotateCcw color="white" />
                        </button>
                    </div>
                </div>
            {/if}
            <div class="flex-grow relative border border-slate-300 rounded-lg shadow-inner overflow-hidden">
                <svg
                        bind:this={svgRef}
                        class="w-full h-full bg-slate-100 rounded-lg"
                        class:cursor-crosshair={isEditorMode && editMode !== 'cursor' && !isPanning}
                        class:cursor-grab={isPanning}
                        class:cursor-grabbing={isPanning}
                        on:mousedown={handleMouseDown}
                        on:mouseleave={handleMouseLeave}
                        on:mousemove={handleMouseMove}
                        on:mouseup={handleMouseUp}
                        on:wheel={handleWheel}
                        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
                >
                    <defs>
                        <pattern id="grid" width={GRID_SIZE} height={GRID_SIZE} patternUnits="userSpaceOnUse">
                            <path d={`M ${GRID_SIZE} 0 L 0 0 0 ${GRID_SIZE}`} fill="none" stroke="#e2e8f0" stroke-width="0.5" class="dark:stroke-slate-700" vector-effect="non-scaling-stroke"/>
                        </pattern>
                    </defs>
                    <rect x={viewBox.x} y={viewBox.y} width={viewBox.width} height={viewBox.height} fill="url(#grid)" />

                    {#each floorPlan.floors as floor (floor.id)}
                        <rect x={floor.x} y={floor.y} width={floor.width} height={floor.height}
                              fill="#f1f5f9" class="dark:fill-slate-300"
                              on:click={() => handleObjectClick('floor', floor.id)}
                        />
                    {/each}
                    {#each floorPlan.walls as wall (wall.id)}
                        <line x1={wall.x1} y1={wall.y1} x2={wall.x2} y2={wall.y2}
                              stroke="#475569" stroke-width="6" stroke-linecap="round"
                              on:click={() => handleObjectClick('wall', wall.id)}
                        />
                    {/each}
                    {#each floorPlan.tables as table (table.id)}
                        <g on:click={() => handleObjectClick('table', table.id)} class:cursor-pointer={!isEditorMode || editMode === 'cursor'} class="hover:opacity-75 transition-opacity">
                            <g transform={`translate(${table.x}, ${table.y}) rotate(${table.rotation || 0})`}>
                                <rect x="-30" y="-20" width="60" height="40" fill="#f2c791" stroke="#a67c52" stroke-width="2" rx="5" />
                                <circle cx="-40" cy="0" r="8" fill="#d9a066" />
                                <circle cx="40" cy="0" r="8" fill="#d9a066" />
                                <circle cx="0" cy="-30" r="8" fill="#d9a066" />
                                <circle cx="0" cy="30" r="8" fill="#d9a066" />
                            </g>
                        </g>
                    {/each}
                    {#each floorPlan.plants as plant (plant.id)}
                        <g on:click={() => handleObjectClick('plant', plant.id)} class:cursor-pointer={editMode === 'cursor'} class="hover:opacity-75 transition-opacity" transform={`translate(${plant.x}, ${plant.y})`}>
                            {#if plant.plantType === 'potted_plant'}
                                <img src={plantpic} alt="Plant" height="20px"/>
                            {:else if plant.plantType === 'fern'}
                                <path d="M0 12 V -12 M -10 0 C -5 -10, 5 -10, 10 0 M -8 6 C -4 -2, 4 -2, 8 6 M -6 12 C -2 4, 2 4, 6 12" stroke="#22c55e" stroke-width="2" fill="none" stroke-linecap="round" />
                            {:else if plant.plantType === 'cactus'}
                                <path d="M-4 12 V 0 C -4 -8, 4 -8, 4 0 V 12 Z" fill="#34d399" stroke="#059669" stroke-width="1.5" />
                                <path d="M4 4 C 10 4, 10 10, 4 10" fill="#34d399" stroke="#059669" stroke-width="1.5" stroke-linejoin="round" />
                            {/if}
                        </g>
                    {/each}

                    {#if previewElement}
                        {#if previewElement.type === 'line'}
                            <line x1={previewElement.x1} y1={previewElement.y1} x2={previewElement.x2} y2={previewElement.y2} stroke="#cbd5e1" stroke-width="4" stroke-dasharray="8,4" vector-effect="non-scaling-stroke" />
                        {:else if previewElement.type === 'rect'}
                            <rect x={previewElement.x} y={previewElement.y} width={previewElement.width} height={previewElement.height} fill="rgba(148, 163, 184, 0.2)" stroke="#94a3b8" stroke-dasharray="5,5" vector-effect="non-scaling-stroke" />
                        {/if}
                    {/if}

                    {#if ghostTable}
                        <img src={tablepic} transform={`translate(${ghostTable.x}, ${ghostTable.y}) rotate(${ghostTable.rotation})`} opacity="0.6" style="pointer-events: none;">
                    {/if}
                    {#if ghostPlant}
                        <g transform={`translate(${ghostPlant.x}, ${ghostPlant.y})`} opacity="0.6" style="pointer-events: none;">
                            {#if ghostPlant.plantType === 'potted_plant'}
                                <img src={plantpic} alt="Plant" height="20px"/>
                            {:else if ghostPlant.plantType === 'fern'}
                                <path d="M0 12 V -12 M -10 0 C -5 -10, 5 -10, 10 0 M -8 6 C -4 -2, 4 -2, 8 6 M -6 12 C -2 4, 2 4, 6 12" stroke="#22c55e" stroke-width="2" fill="none" stroke-linecap="round" />
                            {:else if ghostPlant.plantType === 'cactus'}
                                <path d="M-4 12 V 0 C -4 -8, 4 -8, 4 0 V 12 Z" fill="#34d399" />
                                <path d="M4 4 C 10 4, 10 10, 4 10" fill="#34d399" />
                            {/if}
                        </g>
                    {/if}
                </svg>
            </div>
        </main>

        <aside class="w-80 flex-shrink-0 bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-y-auto">
            {#if selectedData}
                <div class="p-4 space-y-4">
                    <h3 class="text-lg font-bold text-slate-800 dark:text-slate-200 capitalize">{selectedData.type} Details</h3>
                    <p class="text-sm text-slate-500 dark:text-slate-400">ID: {selectedData.id}</p>

                    {#if selectedData.type === 'table'}
                        <div class="space-y-2">
                            <label class="text-sm font-medium text-slate-700 dark:text-slate-300">Information</label>
                            {#if isEditorMode}
                                <textarea bind:value={description} class="w-full p-2 border rounded-md bg-slate-50 dark:bg-slate-700 dark:text-white dark:border-slate-600 focus:ring-2 focus:ring-blue-500"></textarea>
                                <button on:click={handleInfoSave} class="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">Save Info</button>
                            {:else}
                                <p class="p-2 bg-slate-100 dark:bg-slate-700 rounded-md min-h-[4rem]">{selectedData.info}</p>
                            {/if}
                        </div>
                        {#if isEditorMode}
                            <div class="space-y-2">
                                <label class="text-sm font-medium text-slate-700 dark:text-slate-300">Rotation</label>
                                <div class="flex items-center justify-between p-2 bg-slate-100 dark:bg-slate-700 rounded-md">
                                    <span class="font-mono">{selectedData.rotation || 0}°</span>
                                    <div class="flex gap-2">
                                        <button on:click={() => handleRotate(-45)} class="px-3 py-1 bg-slate-200 dark:bg-slate-600 rounded hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors" title="Rotate Left 45°">⟲</button>
                                        <button on:click={() => handleRotate(45)} class="px-3 py-1 bg-slate-200 dark:bg-slate-600 rounded hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors" title="Rotate Right 45°">⟳</button>
                                    </div>
                                </div>
                            </div>
                        {/if}
                    {:else if selectedData.type === 'plant'}
                        <div class="p-2 bg-slate-100 dark:bg-slate-700 rounded-md">
                            <p class="text-sm"><span class="font-medium">Plant Type:</span> <span class="capitalize">{selectedData.plantType.replace('_', ' ')}</span></p>
                        </div>
                    {/if}

                    {#if isEditorMode}
                        <button on:click={handleDelete} class="w-full bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors">
                            Delete Object
                        </button>
                    {/if}
                </div>
            {:else}
                <div class="p-4 text-slate-500 dark:text-slate-400">Select an object to see details.</div>
            {/if}
        </aside>
    </div>
</div>