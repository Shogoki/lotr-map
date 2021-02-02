<script lang="ts">
import {ShireDate} from "./data/util"
import * as d3 from "d3"
import { text } from "svelte/internal";
import CharacterLayer from "./CharacterLayer.svelte"
import {getCharacterNames, getAllDateKeys} from "./data"
let svg;
let showCoords: boolean = false;
function clicked (e){
	const pt = svg.createSVGPoint();

	// pass event coordinates
	pt.x = e.clientX;
	pt.y = e.clientY;

	// transform to SVG coordinates
	const svgP = pt.matrixTransform( svg.getScreenCTM().inverse() );

	console.log(svgP.x)
	console.log(svgP.y)
	if(showCoords){
		const text = `"x": ${Math.round(parseFloat(svgP.x )*100 ) / 100 },\n"y": ${Math.round(parseFloat(svgP.y) * 100) / 100}`
		navigator.clipboard.writeText(text).then(() => {console.log("copied to clipboard")})
		alert(text);
	}
}

let character = "Frodo" // defaulting to Frodo as he has all places assigned :-)
let availableChars = [character] 
const colors = [
	"red",
	"green",
	"blue",
	"purple",
	"orange",
	"yellow"
]
$: displayCharObjects = displayedCharacters.map((name, idx) => { return {name: name, color: colors[idx], location: ""}})

let displayedCharacters = []
function addCharacter() {

	if(!displayedCharacters.includes(character)) {
		if (displayedCharacters.length >= colors.length)
			alert(`there is only a max of ${colors.length} characters allowed`)
		displayedCharacters = [...displayedCharacters, character]
	}
	else {
		alert("Character is already displayed")
	}
}
getCharacterNames().then(names => availableChars = names)
let availableDates = [undefined]
getAllDateKeys().then(dates => availableDates = dates)
let includePath: boolean = true;
let dateIndex: number = 0;



const tooltipRef = d3.select(".tooltip-area")
function showHideTooltip(event) {
	console.log(event.detail.mouseEvent.target)
	
	ttOpacity = event.type === "showTooltip" ? 1 :0 
	if(event.type === "showTooltip") {
		ttTitle = event.detail.locData.place
		const clickedCircle = d3.select(event.detail.mouseEvent.target)
		const query = `circle[cx='${clickedCircle.attr("cx")}'][cy='${clickedCircle.attr("cy")}']`
		let entries =[]
		const circles = Array.from(d3.selectAll(query)).map(node => {
			return { 
				place: node.getAttribute("data-place"),
				date: node.getAttribute("data-date"),
				char: node.getAttribute("data-char"),
					color: node.getAttribute("data-color")
			}});
		circles.forEach(circle => {
			const overlapping = entries.filter(item => item.char === circle.char && item.date === circle.date)
			if(overlapping.length === 0) {
				// NOt added:
				entries = [...entries, circle]
			}
		})
		console.log("Entries", entries)
		entries.sort((a, b) => (new ShireDate(a.date)).compareTo(new ShireDate(b.date)))
			.forEach(entry => {
				const newItem = {text: `${entry.date}: ${entry.char}`, color: entry.color}
				ttText = [...ttText, newItem]
			});
	}
	else {
		ttText = []
		// Flush text
	}
}
let ttWidth = 0, ttHeight = 0, ttTransX = 0, ttTransY = 0, ttOpacity = 0;
let ttTitle = "", ttText = []
function moveTooltip(event) {
	const text = d3.select('#tooltip-textgrp');
	const bbox = text.node().getBBox()
	ttWidth =  bbox.width + 20
	ttHeight = bbox.height + 20
	// rect.attr("width",width )
	// 	.attr("height", height)
	// text.attr("x", width / 2)
	// 	.attr("y", height / 2)
	console.log("BOX is ", bbox)
	const [x, y] = d3.pointer(event.detail.mouseEvent);
	 ttTransY = y - ttHeight
	 ttTransX = x
	// console.log("REF:", tooltipRef)
	// console.log("transform to ", x , yTransform)
	// d3.select(".tooltip-area")
	// 	.attr('transform', `translate(${x}, ${yTransform})`);
}
</script>
<header>
<div id="header">
	<h2>Lord of the Rings - Interactive Path Map</h2>
</div>
	<div id="controls">
		<label for="char">Character:</label>
		<select bind:value={character}>
			{#each availableChars as char}
			<option value="{char}">{char}</option>
			{/each}
		</select>
		<button on:click={addCharacter}>Display Character Route </button>
		<div id="displayed-chars">
			{#if displayCharObjects.length > 0}
				{#each displayCharObjects as charObj}
				<div style="color:{charObj.color}">{charObj.name} </div>
				{/each}
			{:else}
				Please add Character to Display.
			{/if}
		</div>
		<!-- <label for="loc">Latest Location:</label><span id="loc" name="loc">TODO</span> -->
		{#if availableDates.length > 0 }
		<label for="date-index">Date: {availableDates[dateIndex]}</label>
			<input type="range" id="date-index" name="date-index"
			min="0" max="{availableDates.length -1}" bind:value={dateIndex} >
				<label for="include-path">draw Path? <input type="checkbox" name="include-path" bind:checked={includePath} /></label>
				<span></span>
		{/if}
		<label for="sho-cords">show Coordinates on Click</label>
		<input type="checkbox" name="chow-cords" bind:checked={showCoords}>
	</div>
</header>
<main>

	<svg id="map" viewBox="0 0 3200 2400" version="1.1"
	 xmlns="http://www.w3.org/2000/svg" on:click={clicked}  bind:this={svg}>
		 <image x="0" y="0" href="/img/mapome-slim.svg" width="100%" height="100%" />
		 {#each displayCharObjects as charObj	}
		 	<CharacterLayer on:showTooltip={showHideTooltip} on:hideTooltip={showHideTooltip} on:moveTooltip={moveTooltip} character={charObj.name} {includePath}  selectedDate={availableDates[dateIndex]} color={charObj.color} bind:currentLocationName={charObj.location}/>
		 {/each}
		 <g class="tooltip-area" style="opacity: {ttOpacity}" pointer-events="none" transform="translate({ttTransX}, {ttTransY})">
			<g>
				<rect rx="15" ry="15" fill="gray" id="tooltip-rect" width="{ttWidth}" height="{ttText.length * 2.5 + 4}em"></rect>
				<text id="tooltip-textgrp" x="{ttWidth / 2}" y ="3.5em" height="100%">
					<tspan  x="{ttWidth / 2}" class="tooltip-area__title" >{ttTitle}</tspan>
					{#each ttText as text}
						<tspan  x="{ttWidth / 2}" dy="1.5em" class="tooltip-area__text" fill="{text.color}">{text.text}</tspan>
					{/each}
				</text>
			</g>
		</g>
	</svg>

	<!-- <object data="/img/mapome-slim.svg" type="image/svg+xml"  > -->
</main>
<footer>
	<div>Map based on <a href="https://github.com/k1tesurfen/mapome">Map of Middle-Earth</a> by k1tesurfen licensed under terms of the Creative Commons Attribution Share Alike 4.0 license (cc-by-sa-4.0).</div>
</footer>
<style>
#controls {
	display: grid;
	grid-template-columns:  auto auto auto 300px ;
	grid-gap: 10px;
	align-items: center;
}
input {
	justify-self: start;
}
header {
	display: grid;
	justify-items: center;
}
footer {
	display: grid;
	justify-items: center;
}
#tooltip-textgrp {
	text-anchor: middle;
}
.tooltip-area__title {
	font-size: 2em;
}
.tooltip-area__text {
	font-size: 1.4em;
} 
</style>