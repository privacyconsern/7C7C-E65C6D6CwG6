<script lang="js">
    import { onMount } from "svelte";
    import {
        RotateCcw,
        MousePointer,
        BrickWall,
        Square,
        Flower,
        Flower2,
        Leaf,
        Palette,
    } from "lucide-svelte";

    const GRID_SIZE = 50;

    // --- Snapping Logic ---
    function snapToGridLine(value) {
        return Math.round(value / GRID_SIZE) * GRID_SIZE;
    }
    function snapToGridCenter(value) {
        return Math.floor(value / GRID_SIZE) * GRID_SIZE + GRID_SIZE / 2;
    }

    // --- State Variables ---
    let appMode = "editor";
    let editMode = "cursor";
    // floorPlan data structure
    let floorPlan = { walls: [], floors: [], tables: [], plants: [] };
    let selectedObject;

    let isDrawing = false;
    let startPoint;
    let previewElement;
    let svgRef;
    let description = "";

    // Default Colors
    const DEFAULTS = {
        wall: "#334155",
        floor: "#f1f5f9",
        table: "#d4a373", // Wood color
        plant: "#78350f", // Pot color
    };

    // --- Pan & Zoom State ---
    let viewBox = { x: 0, y: 0, width: 800, height: 600 };
    let isPanning = false;
    let panStartPoint = { x: 0, y: 0 };

    // --- Reactive Computations ---
    $: isEditorMode = appMode === "editor";
    $: selectedData = selectedObject
        ? floorPlan[selectedObject.type + "s"]?.find(
              (o) => o.id === selectedObject.id,
          )
        : null;

    // --- Ghost & Tool State ---
    let ghostTable = null;
    let tablePlacementRotation = 0;
    let ghostPlant = null;
    let selectedPlantType = "potted_plant";

    $: if (editMode !== "table" && editMode !== "plants") {
        ghostTable = null;
        ghostPlant = null;
    }

    // Sync description when selection changes
    $: if (selectedData && selectedData.info) {
        description = selectedData.info;
    } else {
        description = "";
    }

    // --- Event Handlers ---
    const getMousePos = (e) => {
        if (!svgRef) return { x: 0, y: 0 };
        const CTM = svgRef.getScreenCTM().inverse();
        const pt = svgRef.createSVGPoint();
        pt.x = e.clientX;
        pt.y = e.clientY;
        const transformedPt = pt.matrixTransform(CTM);

        if (editMode === "table") {
            return {
                x: snapToGridCenter(transformedPt.x),
                y: snapToGridCenter(transformedPt.y),
            };
        } else {
            return {
                x: snapToGridLine(transformedPt.x),
                y: snapToGridLine(transformedPt.y),
            };
        }
    };

    const handleMouseDown = (e) => {
        if (e.button === 1) {
            isPanning = true;
            panStartPoint = { x: e.clientX, y: e.clientY };
            e.preventDefault();
            return;
        }
        if (
            editMode === "cursor" ||
            editMode === "plants" ||
            editMode === "table" ||
            e.button !== 0
        )
            return;

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

        // Update Ghosts
        if (editMode === "table") {
            ghostTable = {
                x: pos.x,
                y: pos.y,
                rotation: tablePlacementRotation,
            };
        }
        if (editMode === "plants") {
            ghostPlant = { x: pos.x, y: pos.y, plantType: selectedPlantType };
        }

        if (!isDrawing) return;

        // Update Previews
        switch (editMode) {
            case "walls":
                previewElement = {
                    type: "line",
                    x1: startPoint.x,
                    y1: startPoint.y,
                    x2: pos.x,
                    y2: pos.y,
                };
                break;
            case "floors":
                previewElement = {
                    type: "rect",
                    x: Math.min(startPoint.x, pos.x),
                    y: Math.min(startPoint.y, pos.y),
                    width: Math.abs(pos.x - startPoint.x),
                    height: Math.abs(pos.y - startPoint.y),
                };
                break;
        }
    };

    const handleMouseUp = (e) => {
        if (e.button === 1) {
            isPanning = false;
            return;
        }
        if (!isDrawing && editMode !== "table" && editMode !== "plants") return;

        const pos = getMousePos(e);
        let newElement;

        if (isDrawing) {
            switch (editMode) {
                case "walls":
                    if (startPoint.x === pos.x && startPoint.y === pos.y) break;
                    // NEW: Add default color
                    newElement = {
                        id: Date.now(),
                        type: "wall",
                        color: DEFAULTS.wall,
                        x1: startPoint.x,
                        y1: startPoint.y,
                        x2: pos.x,
                        y2: pos.y,
                    };
                    floorPlan.walls = [...floorPlan.walls, newElement];
                    break;
                case "floors":
                    if (startPoint.x === pos.x || startPoint.y === pos.y) break;
                    // NEW: Add default color
                    newElement = {
                        id: Date.now(),
                        type: "floor",
                        color: DEFAULTS.floor,
                        x: Math.min(startPoint.x, pos.x),
                        y: Math.min(startPoint.y, pos.y),
                        width: Math.abs(pos.x - startPoint.x),
                        height: Math.abs(pos.y - startPoint.y),
                    };
                    floorPlan.floors = [...floorPlan.floors, newElement];
                    break;
            }
        } else {
            switch (editMode) {
                case "table":
                    // NEW: Add default color
                    newElement = {
                        id: Date.now(),
                        type: "table",
                        color: DEFAULTS.table,
                        x: pos.x,
                        y: pos.y,
                        rotation: tablePlacementRotation,
                        info: "Standard Table",
                    };
                    floorPlan.tables = [...floorPlan.tables, newElement];
                    break;
                case "plants":
                    // NEW: Add default color (for the pot)
                    newElement = {
                        id: Date.now(),
                        type: "plant",
                        color: DEFAULTS.plant,
                        plantType: selectedPlantType,
                        x: pos.x,
                        y: pos.y,
                    };
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
        ghostPlant = null;
    };

    const handleWheel = (e) => {
        e.preventDefault();
        const zoomFactor = 1.1;
        const { x, y, width, height } = viewBox;
        const pt = svgRef.createSVGPoint();
        pt.x = e.clientX;
        pt.y = e.clientY;
        const mouse = pt.matrixTransform(svgRef.getScreenCTM().inverse());
        const newWidth = e.deltaY < 0 ? width / zoomFactor : width * zoomFactor;
        const newHeight =
            e.deltaY < 0 ? height / zoomFactor : height * zoomFactor;
        const dx = mouse.x - x;
        const dy = mouse.y - y;
        viewBox = {
            x: mouse.x - dx * (newWidth / width),
            y: mouse.y - dy * (newHeight / height),
            width: newWidth,
            height: newHeight,
        };
    };

    const resetView = () => {
        if (svgRef)
            viewBox = {
                x: 0,
                y: 0,
                width: svgRef.clientWidth,
                height: svgRef.clientHeight,
            };
    };

    const handleObjectClick = (type, id) => {
        if (isEditorMode && editMode === "cursor") {
            selectedObject = { type, id };
        } else if (!isEditorMode && type === "table") {
            selectedObject = { type, id };
        }
    };

    // --- Color Picker Handler ---
    const handleColorChange = (e) => {
        const newColor = e.target.value;
        if (!selectedObject) return;
        const { type, id } = selectedObject;

        // Update the floorPlan array for the specific object
        floorPlan[type + "s"] = floorPlan[type + "s"].map((obj) =>
            obj.id === id ? { ...obj, color: newColor } : obj,
        );
    };

    // --- Standard Helpers ---
    const handleExport = () => {
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
                if (result.walls && result.floors && result.tables) {
                    floorPlan = {
                        walls: result.walls,
                        floors: result.floors,
                        tables: result.tables,
                        plants: result.plants || [],
                    };
                } else {
                    alert("Invalid floor plan file.");
                }
            } catch (error) {
                alert("Error parsing file.");
            }
        };
        fileReader.readAsText(file);
    };

    const toggleAppMode = () => {
        selectedObject = null;
        appMode = appMode === "editor" ? "user" : "editor";
    };

    const handleDelete = () => {
        if (!selectedObject) return;
        const { type, id } = selectedObject;
        floorPlan[`${type}s`] = floorPlan[`${type}s`].filter(
            (obj) => obj.id !== id,
        );
        selectedObject = null;
    };

    const handleInfoSave = () => {
        if (!selectedData) return;
        const { type, id } = selectedObject;
        floorPlan[`${type}s`] = floorPlan[`${type}s`].map((obj) =>
            obj.id === id ? { ...obj, info: description } : obj,
        );
    };

    const handleRotate = (degrees) => {
        if (!selectedData || selectedData.type !== "table") return;
        const { id } = selectedObject;
        floorPlan.tables = floorPlan.tables.map((table) => {
            if (table.id === id) {
                const currentRotation = table.rotation || 0;
                const newRotation = (currentRotation + degrees) % 360;
                return { ...table, rotation: newRotation };
            }
            return table;
        });
    };

    const handleKeyDown = (event) => {
        if (
            isEditorMode &&
            editMode === "table" &&
            event.key.toLowerCase() === "r"
        ) {
            event.preventDefault();
            tablePlacementRotation = (tablePlacementRotation + 45) % 360;
            if (ghostTable)
                ghostTable = {
                    ...ghostTable,
                    rotation: tablePlacementRotation,
                };
        }
        if (isEditorMode && editMode === "cursor" && selectedObject) {
            if (event.key === "Delete" || event.key === "Backspace")
                handleDelete();
        }
    };

    onMount(() => {
        if (svgRef) {
            viewBox.width = svgRef.clientWidth;
            viewBox.height = svgRef.clientHeight;
        }
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    });
</script>

<main class="flex-grow flex flex-col">
    <header
        class="flex justify-between items-center p-3 bg-white shadow-md z-10"
    >
        <a href="/" class="ml-5 text-2xl font-poppins-bold">
            <span>Restaurant Name</span>
        </a>
        <div class="flex items-center gap-4">
            {#if isEditorMode}
                <label
                    class="bg-[#2300B0] text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors cursor-pointer text-sm"
                >
                    Import JSON <input
                        type="file"
                        accept=".json"
                        on:change={handleImport}
                        class="hidden"
                    />
                </label>
                <button
                    on:click={handleExport}
                    class="bg-black text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition-colors text-sm"
                    >Export JSON</button
                >
            {/if}
            <button
                on:click={toggleAppMode}
                class="flex items-center gap-2 bg-slate-600 text-white px-4 py-2 rounded-md hover:bg-slate-700 transition-colors"
            >
                {isEditorMode ? "User Mode" : "Editor Mode"}
            </button>
        </div>
    </header>

    <div class="flex-grow relative shadow-inner overflow-hidden">
        <div class="flex flex-grow overflow-hidden">
            <aside
                class="w-80 flex-shrink-0 bg-white border-l border-slate-200 shadow-md p-4"
            >
                {#if selectedData}
                    <div class="space-y-4">
                        <h3 class="text-lg font-bold capitalize">
                            {selectedData.type} Details
                        </h3>

                        {#if isEditorMode}
                            <div class="space-y-2">
                                <label
                                    class="text-sm font-medium flex items-center gap-2"
                                >
                                    <Palette size={16} /> Color
                                </label>
                                <div class="flex items-center gap-2">
                                    <input
                                        type="color"
                                        value={selectedData.color ||
                                            DEFAULTS[selectedData.type] ||
                                            "#000000"}
                                        on:input={handleColorChange}
                                        class="h-10 w-full cursor-pointer rounded border border-slate-300 bg-white p-1"
                                    />
                                </div>
                            </div>
                        {/if}

                        {#if selectedData.type === "table"}
                            <div class="space-y-2">
                                <label class="text-sm font-medium">Info</label>
                                {#if isEditorMode}
                                    <textarea
                                        bind:value={description}
                                        class="w-full p-2 border rounded-md"
                                    ></textarea>
                                    <button
                                        on:click={handleInfoSave}
                                        class="w-full bg-blue-500 text-white px-2 py-1 rounded"
                                        >Save Text</button
                                    >
                                {:else}
                                    <p class="p-2 bg-slate-100 rounded">
                                        {selectedData.info}
                                    </p>
                                {/if}
                            </div>
                            {#if isEditorMode}
                                <div
                                    class="flex items-center justify-between p-2 bg-slate-100 rounded"
                                >
                                    <span
                                        >Rot: {selectedData.rotation ||
                                            0}°</span
                                    >
                                    <div>
                                        <button
                                            on:click={() => handleRotate(-45)}
                                            class="px-2 bg-slate-200 rounded mr-1"
                                            >L</button
                                        >
                                        <button
                                            on:click={() => handleRotate(45)}
                                            class="px-2 bg-slate-200 rounded"
                                            >R</button
                                        >
                                    </div>
                                </div>
                            {/if}
                        {/if}

                        {#if isEditorMode}
                            <button
                                on:click={handleDelete}
                                class="w-full bg-red-500 text-white px-4 py-2 rounded mt-4"
                                >Delete Object</button
                            >
                        {/if}
                    </div>
                {:else}
                    <p class="text-slate-500">Select an object to edit.</p>
                {/if}
            </aside>
            <svg
                bind:this={svgRef}
                class="w-full h-full bg-slate-50 rounded-lg"
                class:cursor-crosshair={isEditorMode &&
                    editMode !== "cursor" &&
                    !isPanning}
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
                    <pattern
                        id="grid"
                        width={GRID_SIZE}
                        height={GRID_SIZE}
                        patternUnits="userSpaceOnUse"
                    >
                        <path
                            d={`M ${GRID_SIZE} 0 L 0 0 0 ${GRID_SIZE}`}
                            fill="none"
                            stroke="#84888E"
                            stroke-width="1"
                            vector-effect="non-scaling-stroke"
                        />
                    </pattern>
                    <g id="asset-table">
                        <circle
                            cx="-17"
                            cy="0"
                            r="6"
                            fill="#e5e5e5"
                            stroke="#a3a3a3"
                            stroke-width="1"
                        />
                        <circle
                            cx="17"
                            cy="0"
                            r="6"
                            fill="#e5e5e5"
                            stroke="#a3a3a3"
                            stroke-width="1"
                        />
                        <circle
                            cx="0"
                            cy="-17"
                            r="6"
                            fill="#e5e5e5"
                            stroke="#a3a3a3"
                            stroke-width="1"
                        />
                        <circle
                            cx="0"
                            cy="17"
                            r="6"
                            fill="#e5e5e5"
                            stroke="#a3a3a3"
                            stroke-width="1"
                        />
                        <rect
                            x="-16"
                            y="-16"
                            width="32"
                            height="32"
                            rx="4"
                            fill="currentColor"
                            stroke="rgba(0,0,0,0.2)"
                            stroke-width="2"
                        />
                    </g>

                    <g id="asset-potted_plant">
                        <circle r="18" fill="#84cc16" opacity="0.6" />
                        <circle r="12" fill="#65a30d" opacity="0.8" />
                        <circle
                            r="8"
                            fill="currentColor"
                            stroke="rgba(0,0,0,0.2)"
                            stroke-width="1.5"
                        />
                    </g>

                    <g id="asset-fern">
                        <path
                            d="M0 12 V -12 M -10 0 C -5 -10, 5 -10, 10 0 M -8 6 C -4 -2, 4 -2, 8 6 M -6 12 C -2 4, 2 4, 6 12"
                            stroke="currentColor"
                            stroke-width="2"
                            fill="none"
                            stroke-linecap="round"
                        />
                    </g>

                    <g id="asset-cactus">
                        <circle
                            r="8"
                            fill="#10b981"
                            stroke="#047857"
                            stroke-width="2"
                        />
                        <path
                            d="M-5 -5 L-2 -2 M5 -5 L2 -2 M-5 5 L-2 2 M5 5 L2 2"
                            stroke="#d1fae5"
                            stroke-width="2"
                            stroke-linecap="round"
                        />
                    </g>
                </defs>

                <rect
                    x={viewBox.x}
                    y={viewBox.y}
                    width={viewBox.width}
                    height={viewBox.height}
                    fill="url(#grid)"
                />

                {#each floorPlan.floors as floor (floor.id)}
                    <rect
                        x={floor.x}
                        y={floor.y}
                        width={floor.width}
                        height={floor.height}
                        fill={floor.color || DEFAULTS.floor}
                        on:click={() => handleObjectClick("floor", floor.id)}
                    />
                {/each}

                {#each floorPlan.walls as wall (wall.id)}
                    <line
                        x1={wall.x1}
                        y1={wall.y1}
                        x2={wall.x2}
                        y2={wall.y2}
                        stroke={wall.color || DEFAULTS.wall}
                        stroke-width="2"
                        stroke-linecap="round"
                        on:click={() => handleObjectClick("wall", wall.id)}
                    />
                {/each}

                {#each floorPlan.tables as table (table.id)}
                    <g
                        on:click={() => handleObjectClick("table", table.id)}
                        class:cursor-pointer={!isEditorMode ||
                            editMode === "cursor"}
                        class="hover:opacity-80 transition-opacity"
                        style="color: {table.color || DEFAULTS.table}"
                        transform={`translate(${table.x}, ${table.y}) rotate(${table.rotation || 0})`}
                    >
                        <use href="#asset-table" />
                    </g>
                {/each}

                {#each floorPlan.plants as plant (plant.id)}
                    <g
                        on:click={() => handleObjectClick("plant", plant.id)}
                        class:cursor-pointer={editMode === "cursor"}
                        class="hover:opacity-80 transition-opacity"
                        style="color: {plant.color || DEFAULTS.plant}"
                        transform={`translate(${plant.x}, ${plant.y})`}
                    >
                        <use href={`#asset-${plant.plantType}`} />
                    </g>
                {/each}

                {#if previewElement}
                    {#if previewElement.type === "line"}
                        <line
                            x1={previewElement.x1}
                            y1={previewElement.y1}
                            x2={previewElement.x2}
                            y2={previewElement.y2}
                            stroke="#64748b"
                            stroke-width="4"
                            stroke-dasharray="8,4"
                        />
                    {:else if previewElement.type === "rect"}
                        <rect
                            x={previewElement.x}
                            y={previewElement.y}
                            width={previewElement.width}
                            height={previewElement.height}
                            fill="rgba(148, 163, 184, 0.2)"
                            stroke="#94a3b8"
                            stroke-dasharray="5,5"
                        />
                    {/if}
                {/if}

                {#if ghostTable}
                    <g
                        transform={`translate(${ghostTable.x}, ${ghostTable.y}) rotate(${ghostTable.rotation})`}
                        opacity="0.5"
                        style="pointer-events: none; color: {DEFAULTS.table}"
                    >
                        <use href="#asset-table" />
                    </g>
                {/if}
                {#if ghostPlant}
                    <g
                        transform={`translate(${ghostPlant.x}, ${ghostPlant.y})`}
                        opacity="0.5"
                        style="pointer-events: none; color: {DEFAULTS.plant}"
                    >
                        <use href={`#asset-${ghostPlant.plantType}`} />
                    </g>
                {/if}
            </svg>
            <aside
                class="w-80 flex-shrink-0 bg-white border-l border-slate-200 shadow-md p-4"
            >
                {#if selectedData}
                    <div class="space-y-4">
                        <h3 class="text-lg font-bold capitalize">
                            {selectedData.type} Details
                        </h3>

                        {#if isEditorMode}
                            <div class="space-y-2">
                                <label
                                    class="text-sm font-medium flex items-center gap-2"
                                >
                                    <Palette size={16} /> Color
                                </label>
                                <div class="flex items-center gap-2">
                                    <input
                                        type="color"
                                        value={selectedData.color ||
                                            DEFAULTS[selectedData.type] ||
                                            "#000000"}
                                        on:input={handleColorChange}
                                        class="h-10 w-full cursor-pointer rounded border border-slate-300 bg-white p-1"
                                    />
                                </div>
                            </div>
                        {/if}

                        {#if selectedData.type === "table"}
                            <div class="space-y-2">
                                <label class="text-sm font-medium">Info</label>
                                {#if isEditorMode}
                                    <textarea
                                        bind:value={description}
                                        class="w-full p-2 border rounded-md"
                                    ></textarea>
                                    <button
                                        on:click={handleInfoSave}
                                        class="w-full bg-blue-500 text-white px-2 py-1 rounded"
                                        >Save Text</button
                                    >
                                {:else}
                                    <p class="p-2 bg-slate-100 rounded">
                                        {selectedData.info}
                                    </p>
                                {/if}
                            </div>
                            {#if isEditorMode}
                                <div
                                    class="flex items-center justify-between p-2 bg-slate-100 rounded"
                                >
                                    <span
                                        >Rot: {selectedData.rotation ||
                                            0}°</span
                                    >
                                    <div>
                                        <button
                                            on:click={() => handleRotate(-45)}
                                            class="px-2 bg-slate-200 rounded mr-1"
                                            >L</button
                                        >
                                        <button
                                            on:click={() => handleRotate(45)}
                                            class="px-2 bg-slate-200 rounded"
                                            >R</button
                                        >
                                    </div>
                                </div>
                            {/if}
                        {/if}

                        {#if isEditorMode}
                            <button
                                on:click={handleDelete}
                                class="w-full bg-red-500 text-white px-4 py-2 rounded mt-4"
                                >Delete Object</button
                            >
                        {/if}
                    </div>
                {:else}
                    <p class="text-slate-500">Select an object to edit.</p>
                {/if}
            </aside>
            {#if isEditorMode}
                <div class="bg-white shadow-md items-center">
                    <button
                        on:click={() => (editMode = "cursor")}
                        class:bg-blue-500={editMode === "cursor"}
                        class:text-white={editMode === "cursor"}
                        class="p-3 rounded-md transition-colors text-slate-500 hover:bg-slate-100"
                        ><MousePointer /></button
                    >
                    <button
                        on:click={() => (editMode = "walls")}
                        class:bg-blue-500={editMode === "walls"}
                        class:text-white={editMode === "walls"}
                        class="p-3 rounded-md transition-colors text-slate-500 hover:bg-slate-100"
                        ><BrickWall /></button
                    >
                    <button
                        on:click={() => (editMode = "floors")}
                        class:bg-blue-500={editMode === "floors"}
                        class:text-white={editMode === "floors"}
                        class="p-3 rounded-md transition-colors text-slate-500 hover:bg-slate-100"
                        ><Square /></button
                    >
                    <button
                        on:click={() => (editMode = "table")}
                        class:bg-blue-500={editMode === "table"}
                        class:text-white={editMode === "table"}
                        class="p-3 rounded-md transition-colors text-slate-500 hover:bg-slate-100"
                        ><Square size={20} strokeWidth={3} /></button
                    >
                    <button
                        on:click={() => (editMode = "plants")}
                        class:bg-blue-500={editMode === "plants"}
                        class:text-white={editMode === "plants"}
                        class="p-3 rounded-md transition-colors text-slate-500 hover:bg-slate-100"
                        ><Flower /></button
                    >

                    <div class="flex-grow flex justify-end items-center">
                        {#if editMode === "table"}
                            <div class="text-sm text-slate-500 pr-2">
                                Rotate: 'R' | {tablePlacementRotation}°
                            </div>
                        {/if}
                        {#if editMode === "plants"}
                            <div
                                class="flex items-center gap-2 p-1 rounded-lg bg-slate-100"
                            >
                                <button
                                    on:click={() =>
                                        (selectedPlantType = "potted_plant")}
                                    class:bg-green-500={selectedPlantType ===
                                        "potted_plant"}
                                    class:text-white={selectedPlantType ===
                                        "potted_plant"}
                                    class="p-2 rounded-md transition-colors"
                                    ><Flower size={16} /></button
                                >
                                <button
                                    on:click={() =>
                                        (selectedPlantType = "fern")}
                                    class:bg-green-500={selectedPlantType ===
                                        "fern"}
                                    class:text-white={selectedPlantType ===
                                        "fern"}
                                    class="p-2 rounded-md transition-colors"
                                    ><Flower2 size={16} /></button
                                >
                                <button
                                    on:click={() =>
                                        (selectedPlantType = "cactus")}
                                    class:bg-green-500={selectedPlantType ===
                                        "cactus"}
                                    class:text-white={selectedPlantType ===
                                        "cactus"}
                                    class="p-2 rounded-md transition-colors"
                                    ><Leaf size={16} /></button
                                >
                            </div>
                        {/if}
                        <button
                            on:click={resetView}
                            class="p-3 ml-4 rounded-md transition-colors text-slate-500 hover:bg-slate-100"
                            ><RotateCcw /></button
                        >
                    </div>
                </div>
            {/if}
        </div>
    </div>
</main>
