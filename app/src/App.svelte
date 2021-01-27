<script lang="ts">
import {getLocationSetByCharacter, getPlaceData, getPlaceLocation} from "./data"
import type {LocationSet, CharacterName, DateKey, PlaceLocation, PlaceName} from "./data"
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
	if(showCoords)
		alert("x: "+svgP.x+" y:"+svgP.y);
}
let drawBase: Node;
function drawCircle(x: number, y: number) {
	console.log("drawnow")
	var rect = document.createElementNS("http://www.w3.org/2000/svg", 'circle')
	rect.setAttributeNS(null, 'width', 100)
	rect.setAttributeNS(null, 'cx', x.toString())
	rect.setAttributeNS(null, 'cy', y.toString())
	// rect.setAttributeNS(null, 'cx', 855)
	// rect.setAttributeNS(null, 'cy', 741)

	rect.setAttributeNS(null, 'r', "6")
	rect.setAttributeNS(null, 'fill', 'red')
	drawBase.appendChild(rect)

}
function drawLine(loc1: PlaceLocation, loc2: PlaceLocation, withDots=true) {
	var line = document.createElementNS("http://www.w3.org/2000/svg", 'line')
	//  <line x1="0" y1="80" x2="100" y2="20" stroke="black" />
	line.setAttributeNS(null, 'x1', loc1.x.toString())
	line.setAttributeNS(null, 'y1', loc1.y.toString())
	line.setAttributeNS(null, 'x2', loc2.x.toString())
	line.setAttributeNS(null, 'y2', loc2.y.toString())
	line.setAttributeNS(null, 'stroke', "red")
	line.setAttributeNS(null, 'stroke-width', "3")
	// line.setAttributeNS(null, 'cx', 855)
	// line.setAttributeNS(null, 'cy', 741)
	drawBase.appendChild(line)
	if(withDots){
		drawCircle(loc1.x, loc1.y)
		drawCircle(loc2.x, loc2.y)

	}
}
function drawLineFromPlaces(place1: PlaceName, place2: PlaceName ) {
	const promises = [getPlaceLocation(place1)]
	promises.push(getPlaceLocation(place2))
	Promise.all(promises).then(locations => {
		const loc1 = locations[0]
		const loc2 = locations[1]
		drawLine(loc1, loc2)
	})
}
function cleanDrawings() {
	Array.from(drawBase.childNodes).forEach(child => {
		drawBase.removeChild(child)
	});
}
let availableDates = [undefined]
let character = "Frodo"
const availableChars = ["Frodo"]
let characterData:Map<CharacterName, LocationSet> = new Map()
getLocationSetByCharacter(character).then((data: LocationSet) => {
	characterData = characterData.set(character, data);
	console.log("CharData:", characterData);
	availableDates = characterData.has(character) ? Array.from(characterData.get(character).keys()) : [undefined]
})
function getLocName(date: string): string {
	if(date)
		return characterData.get(character).get(date)
	else
		return ""
}
let includePath: boolean = true;
let dateIndex = 0 
$: currentLocationName = getLocName(availableDates[dateIndex])

$: getPlaceLocation(currentLocationName).then(loc => {
	if(loc) {
		cleanDrawings()
		if(includePath && dateIndex > 0) {
			let lastLoc = currentLocationName;
			//We neeed to draw a path between all previous ones.
			availableDates.slice(0,dateIndex).reverse().forEach(date => {
				const tmp = getLocName(date)
				drawLineFromPlaces(lastLoc,tmp);
				lastLoc = tmp;
			});
		}
		else {
			drawCircle(loc.x,loc.y)
		}
	}
})
</script>
<header>
<div id="header">
	<h2>Lord of the Rings - Interactive Path Map</h2>
</div>
	<div id="controls">
		<label for="char">Character:</label>
		<select>
			{#each availableChars as char}
			<option value="{char}">{char}</option>
			{/each}
		</select>
		<label for="loc">Latest Location:</label><span id="loc" name="loc">{currentLocationName}</span>
		{#if characterData.size > 0 && characterData.get(character).size > 0}
		<label for="date-index">Date: {availableDates[dateIndex]}</label>
			<input type="range" id="date-index" name="date-index"
			min="0" max="{characterData.get(character).size -1}" bind:value={dateIndex} >
				<label for="include-path">draw Path?</label>
				<input type="checkbox" name="include-path" bind:checked={includePath}>
		{/if}
		<label for="include-path">show Coordinates on Click</label>
		<input type="checkbox" name="include-path" bind:checked={showCoords}>
	</div>
</header>
<main>

	<svg id="map" viewBox="0 0 3200 2400" version="1.1"
	 xmlns="http://www.w3.org/2000/svg" on:click={clicked}  bind:this={svg}>
		 <image x="0" y="0" href="/img/mapome-slim.svg" width="100%" height="100%" />
		 <g id="drawing"bind:this={drawBase}></g>
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
</style>