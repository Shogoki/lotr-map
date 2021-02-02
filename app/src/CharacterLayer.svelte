<script lang="ts">
	interface PlaceInTime {
		date: DateKey,
		place: PlaceName
	}
	import * as d3 from "d3";
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
	/*
	TODOS: 
	- add tooltip to dot´s showing Name: Location // Maybe switch to d3.js for svg drawing
	// Move toolpip to outer component. Bubble Events? Pass Data (CharName?Color?Date?Location)
	Detect overlapping dots circles and change the look of them accordingly
	- hide controls and make them a bit nicer
	- Display Event Text
	- Add (Starting positions to characters?)
	- add smooth Paths
	*/
    import {getLocationSetByCharacter, getPlaceData, getPlaceLocation} from "./data"
   import type {LocationSet, CharacterName, DateKey, PlaceLocation, PlaceName} from "./data"
 import { ShireDate } from "./data/util";
    export let character ="Frodo"
    export let includePath: boolean = true;
	export let selectedDate = ""
	export let color = "red"
	let popovers = []
	console.log(`Display Path for ${character} at Date ${selectedDate} in Color ${color} (includepahts: ${includePath})`)
    // export let dateIndex = 0;
    let characterData:Map<CharacterName, LocationSet> = new Map()
	let drawBase;
	
	function initCharacterData() {
		getLocationSetByCharacter(character).then((data: LocationSet) => {
		characterData = characterData.set(character, data);
		const tmp = selectedDate;
		selectedDate =""
		selectedDate = tmp // Dirty hack, to directly draw, after retrieving data
		})
	}
    $: character, initCharacterData()
    function drawCircle(x: number, y: number, data:PlaceInTime=undefined) {
		const radius = 8
		const selectedRadius = 15
		console.log("drawnow")
		const d3Base = d3.select(drawBase)

		//TOOLTIP STUFF:
		// ToolTip Stuff
		const tooltip = d3.select(".tooltip-area")
		const rect = d3.select("#tooltip-rect")
		// rect.attr("width",d => this.parentNode.childNodes[1].getComputedTextLength() + 20);
		
		// const mouseover = (event, d) => {
		// 		d3.select(event.target).transition().attr("r", selectedRadius)
				
		// 		tooltip.style("opacity", 1);
		// 	};
			
		// 	const mouseleave = (event, d) => {
		// 	d3.select(event.target).transition().attr("r", radius)
		// 	tooltip.style('opacity', 0);
		// }

		// const mousemove = (event, d) => {
		// 	const text = d3.select('.tooltip-area__text');
		// 	text.text(`Name: ${data.place}`);
		// 	const bbox = text.node().getBBox()
		// 	const width =  bbox.width + 20
		// 	const height = bbox.height + 10
		// 	rect.attr("width",width )
		// 		.attr("height", height)
		// 	// text.attr("x", bbox.x + (width / 2))
		// 	// 	.attr("y", bbox.y + ( height / 2))
		// 	text.attr("x", width / 2)
		// 		.attr("y", height / 2)
		// 	// rect.attr("x", bbox.x)
		// 	// rect.attr("y", bbox.y)

		// 	console.log("BOX is ", bbox)
		// 	const [x, y] = d3.pointer(event);
		// 	const yTransform = y - height
		// 	tooltip
		// 		.attr('transform', `translate(${x}, ${yTransform})`);
		// };
		const genericEventData = {char: character, color: color, locData: data }
		const mouseover = (event, d) => {
			d3.select(event.target).transition().attr("r", selectedRadius)
			dispatch("showTooltip", {mouseEvent: event, ...genericEventData })
		}
			
		const mouseleave = (event, d) => {
			d3.select(event.target).transition().attr("r", radius)
			dispatch("hideTooltip", {mouseEvent: event, ...genericEventData })
		}
		const mousemove = (event, d) => dispatch("moveTooltip", {mouseEvent: event, ...genericEventData })

		d3Base.append("circle")
			.style("fill", color)
			.attr("r", radius)
			.attr("cx", x)
			.attr("cy", y)
			.attr("data-place", data ? data.place ? data.place : "unknown" : "unknown")
			.attr("data-char", character)
			.attr("data-color", color)
			.attr("data-date", data.date)
			.on("mousemove", mousemove)
			.on("mouseleave", mouseleave)
			.on("mouseover", mouseover);

}


function drawLine(loc1: PlaceLocation, loc2: PlaceLocation, loc1Data: PlaceInTime, loc2Data: PlaceInTime, withDots=true) {

	const d3Base = d3.select(drawBase)
	d3Base.append("line")
		.style("stroke", color)
		.attr("x1", loc1.x)
		.attr("x2", loc2.x)
		.attr("y1", loc1.y)
		.attr("y2", loc2.y)
		.attr("stroke-width", 3);
		if(withDots){
			drawCircle(loc1.x, loc1.y, loc1Data)
			drawCircle(loc2.x, loc2.y, loc2Data)
			
		}
		
}
function drawLineFromPlaces(place1: PlaceInTime, place2: PlaceInTime ) {
	// const promises = [getPlaceLocation(place1.place)]
	// promises.push(getPlaceLocation(place2.place))
	getPlaceLocation(place1.place).then(loc1 => {
		getPlaceLocation(place2.place).then(loc2 => {
			drawLine(loc1, loc2, place1, place2)
		})
	})
	// Promise.all(promises).then(locations => {
	// 	const loc1 = locations[0]
	// 	const loc2 = locations[1]
	
	// })
}


function cleanDrawings() {
	console.log("Clean Drawings for ", character)
	Array.from(drawBase.childNodes).forEach(child => {
		drawBase.removeChild(child)
	});
}

function lookupPlaceName(date: string): PlaceName {
	if(date)
		return characterData.get(character).get(date)
	else
		return ""
}
function getLocName(date:string): PlaceName {
	console.log("Get Name for date", date)
	const locs = getAllPreviousLocationDates(date)
	console.log("reqtrieved following Locs for Date", date, ":")
	console.log(locs)
	return locs.length > 0 ? lookupPlaceName(locs[0]) : ""
}
export let currentLocationName
$: currentLocationName = getLocName(selectedDate)

function getAllPreviousLocationDates(date: string, includeCurrent=true): string[] {
	if(!date || date == "")
		return []
	const availableDates = characterData.has(character) ? Array.from(characterData.get(character).keys()) : []
	console.log("Converting date", date)
	const shireDate = new ShireDate(date)
	console.log("availabelDates", availableDates)
	const locs = availableDates.filter(
		item => shireDate.compareTo(new ShireDate(item)) >= 0
	).sort(
		(a,b) => (new ShireDate(a)).compareTo(new ShireDate(b))
		).reverse()
	return includeCurrent ? locs : locs.splice(1)
}

$: getPlaceLocation(currentLocationName).then(loc => {
	if(loc) {
		cleanDrawings()
		if(includePath) {
			let lastLoc = {place: currentLocationName, date: selectedDate};
		
			getAllPreviousLocationDates(selectedDate).forEach(date => {
				const tmp = {place:lookupPlaceName(date), date: date}
				drawLineFromPlaces(lastLoc,tmp);
				lastLoc = tmp;
			});
			//We neeed to draw a path between all previous ones.
		}
		else {
			drawCircle(loc.x,loc.y, {place: currentLocationName, date: selectedDate})
		}
	}
})
</script>
<style>
	.tooltip-area__text {
		text-anchor: middle;
		dominant-baseline: middle;
	}
</style>
<g id="{character.toLowerCase()}-container" >
	<g id="{character.toLowerCase()}-paths" bind:this={drawBase}>
	</g>
	<g class="tooltip-area" style="opacity: 0" pointer-events="none" >
		<g>
			<rect rx="15" ry="15" fill="gray" id="tooltip-rect"></rect>
			<text  fill="{color}" class="tooltip-area__text" >aas</text>
		</g>
	</g>
</g>
