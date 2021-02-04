<script lang="ts">
import {ShireDate} from "./data/util"
import * as d3 from "d3"
import CharacterLayer from "./CharacterLayer.svelte"
import {getCharacterNames, getAllDateKeys, getEventText} from "./data"
let svg;

function getSVGPointFromEvent(e) {
	const pt = svg.createSVGPoint();

	// pass event coordinates
	pt.x = e.clientX;
	pt.y = e.clientY;

	// transform to SVG coordinates
	const svgP = pt.matrixTransform( svg.getScreenCTM().inverse() );
	return svgP;
}
function clicked (e){

	const svgP = getSVGPointFromEvent(e)
	console.log(svgP.x)
	console.log(svgP.y)
	if(showCoords){
		const text = `"x": ${Math.round(parseFloat(svgP.x )*100 ) / 100 },\n"y": ${Math.round(parseFloat(svgP.y) * 100) / 100}`
		navigator.clipboard.writeText(text).then(() => {console.log("copied to clipboard")})
		alert(text);
	}
}
//PATH RECORDING
import Snackbar, {Label} from "@smui/snackbar"
let recordingSnackBar
let recordPath: boolean = false;
let recordFlag: boolean = false;
let currentRecording = []
const startStopRecording = () => {
	if (recordPath && recordFlag) {
		const data = currentRecording.map(svgP => {
			 return `{"x": ${Math.round(parseFloat(svgP.x )*100 ) / 100 },\n"y": ${Math.round(parseFloat(svgP.y) * 100) / 100}}`
		}).join(",")
		navigator.clipboard.writeText(data).then(() => {console.log("copied to clipboard")})
		recordFlag = false;
		recordingSnackBar.close()
		alert("Recorded Points are copied to clipboard");
	}
	else if (recordPath){
		currentRecording = []
		recordFlag = true;
		recordingSnackBar.open()
	}
	
}
function recordMouseMove(e) {
	if(recordFlag && recordPath)
		currentRecording.push(getSVGPointFromEvent(e))
}
let showCoords: boolean = false;
$: if(recordPath) {showCoords = false}

// START CONTROL STUFF
import Checkbox from '@smui/checkbox';
import FormField from '@smui/form-field';
import Slider from '@smui/slider';
import Select, {Option} from '@smui/select';
// import Icon from '@smui/select/icon/index';
import Chip, {Set, Text, Icon} from '@smui/chips';
let character  // defaulting to Frodo as he has all places assigned :-)
let availableChars = [character] 
$: character, addCharacter()
const colors = [
	// "red",
	// "green",
	// "blue",
	// "purple",
	// "orange",
	// "yellow"
	"#f26430",
	"#009ddc",
	"#6761a8",
	"#fcf300",
	"#2D848A",
	"#b28b84",
	"#4f3130",
	"#753742",
	"#7EE081"
]
$: displayCharObjects = displayedCharacters.map((name, idx) => { return {name: name, color: colors[idx], location: ""}})

let displayedCharacters = []
let availableDates = [""]
let includePath: boolean = true;
let dateIndex: number = 0;
function addCharacter() {
	if(character)
	if(!displayedCharacters.includes(character) ) {
		if (displayedCharacters.length >= colors.length)
			alert(`there is only a max of ${colors.length} characters allowed`)
		displayedCharacters = [...displayedCharacters, character]
	}
	else {
		alert("Character is already displayed")
	}
}
getCharacterNames().then(names => availableChars = names)
getAllDateKeys().then(dates => availableDates = dates)

// END CONTROL STUFF


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

$: eventP = getEventText(availableDates[dateIndex])
// FIx for weird slider Behaviour
$: if(isNaN(dateIndex)) {
	dateIndex = 0
}


</script>
<header>
<div id="header">
	<h2>Lord of the Rings - Interactive Path Map</h2>
</div>
	<div id="controls">
		<Select withLeadingIcon bind:value={character} label="Character" style="grid-area: charselect;">
			<span slot="icon"><Icon class="material-icons">people_alt</Icon></span>
			{#each availableChars as char}
			  <Option value="{char}">{char}</Option>
			{/each}
		  </Select>
		<div id="displayed-chars" style="grid-area: charpot;">
			{#if displayCharObjects.length > 0}
			<Set chips={displayedCharacters} let:chip key={chip => chip} input>
				<!-- need to assign tags to itself on removal to ensure esvelte knows we changed the array-->
				<Chip
					style="background-color: {displayCharObjects.filter(item => item.name === chip)[0].color};" 
				  on:MDCChip:removal={() => {
					  console.log("THis is called")
					displayCharObjects = displayCharObjects;
				  }}
				  shouldRemoveOnTrailingIconClick={true}>
		  
				  <Text>{chip}</Text>
				  <!-- we are in last element, so we allow removal-->
				  <Icon class="material-icons"
					trailing
					tabindex="0">
					cancel
				  </Icon>
				</Chip>
			  </Set>



			{:else}
				Please add Character to Display.
			{/if}
		</div>
		<!-- <label for="loc">Latest Location:</label><span id="loc" name="loc">TODO</span> -->
		{#if availableDates.length > 0 }
		<Select withLeadingIcon bind:selectedIndex={dateIndex} label="Date" style="grid-area: dateselect;">
			<span slot="icon"><Icon class="material-icons">event</Icon></span>
			{#each availableDates as date, idx}
			  <Option value="{idx}">{date}</Option>
			{/each}
		</Select>
		<Slider bind:value={dateIndex} min="0" max="{availableDates.length -1}" step={1} style="grid-area: dateslider;"/>
		<FormField style="grid-area: drawpath;">
			<Checkbox bind:checked={includePath} />
			<span slot="label">draw Path?</span>
		  </FormField>
		{/if}
		<div style="grid-area: event; justify-self: center" >
			{#await eventP}
			loading...
			{:then eventText}
			{eventText}
			{/await}
		</div>
	
	</div>
	
</header>
<main>

	<svg id="map" viewBox="0 0 3200 2400" version="1.1"
	 xmlns="http://www.w3.org/2000/svg" on:click={clicked}  bind:this={svg} on:mousedown={startStopRecording} on:mousemove={recordMouseMove}>
		 <image x="0" y="0" href="/img/mapome-slim.svg" width="100%" height="100%" />
		 {#each displayCharObjects as charObj	}
		 	<CharacterLayer on:showTooltip={showHideTooltip} on:hideTooltip={showHideTooltip} on:moveTooltip={moveTooltip} character={charObj.name} {includePath}  selectedDate={availableDates[dateIndex]} color={charObj.color} bind:currentLocationName={charObj.location}/>
		 {/each}
		 <g class="tooltip-area" style="opacity: {ttOpacity}" pointer-events="none" transform="translate({ttTransX}, {ttTransY})">
			<g>
				<rect rx="15" ry="15" fill="#EAD2AC" id="tooltip-rect" width="{ttWidth}" height="{ttText.length * 2.5 + 4}em"></rect>
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
	<div id="admin-controls" >
		<FormField >
			<Checkbox bind:checked={showCoords} disabled={recordPath}/>
			<span slot="label">show Coordinates on Click</span>
		  </FormField>
		  <FormField >
			<Checkbox bind:checked={recordPath} />
			<span slot="label">record Path</span>
		  </FormField>
		  <Snackbar bind:this={recordingSnackBar}>
			<Label>Recording started. Click again to Stop recording.</Label>
		  </Snackbar>
	</div>
	<div>Map based on <a href="https://github.com/k1tesurfen/mapome">Map of Middle-Earth</a> by k1tesurfen licensed under terms of the Creative Commons Attribution Share Alike 4.0 license (cc-by-sa-4.0).</div>
</footer>
<style>
#controls {
	/* TODO: CHANGE THIS TO FLEXBOX as i do not want 1 col to mess up the others? */
	display: grid;
	grid-template-areas: "charselect drawpath charpot charpot admin"
						  "dateselect dateslider dateslider dateslider admin"
						  "event event event event admin";
	grid-template-columns:  300px	 200px 400px 300px auto;
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
	grid-template-rows: auto auto;
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