<script lang="ts">
import CharacterLayer from "./CharacterLayer.svelte"
import {getCharacterNames} from "./data"
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

let character = "Frodo"
let availableChars = ["Frodo"]
getCharacterNames().then(names => availableChars = names)
let availableDates = [undefined]
let includePath: boolean = true;
let dateIndex: number = 0;
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
		<label for="loc">Latest Location:</label><span id="loc" name="loc">TODO</span>
		{#if availableDates.length > 0 }
		<label for="date-index">Date: {availableDates[dateIndex]}</label>
			<input type="range" id="date-index" name="date-index"
			min="0" max="{availableDates.length -1}" bind:value={dateIndex} >
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
		 <CharacterLayer {character} {includePath} bind:availableDates={availableDates} {dateIndex} />
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