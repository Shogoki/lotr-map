<script lang="ts">
	import * as d3 from "d3";
	/*
	TODOS: 
	- add tooltip to dot´s showing Name: Location // Maybe switch to d3.js for svg drawing
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
    function drawCircle(x: number, y: number, name="") {
		console.log("drawnow")
		const d3Base = d3.select(drawBase)
		d3Base.append("circle")
			.style("fill", color)
			.attr("r", 6)
			.attr("cx", x)
			.attr("cy", y)
			.attr("width", 100);

}


function drawLine(loc1: PlaceLocation, loc2: PlaceLocation, withDots=true) {

	const d3Base = d3.select(drawBase)
	d3Base.append("line")
		.style("stroke", color)
		.attr("x1", loc1.x)
		.attr("x2", loc2.x)
		.attr("y1", loc1.y)
		.attr("y2", loc2.y)
		.attr("stroke-width", 3);
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
			let lastLoc = currentLocationName;
		
			getAllPreviousLocationDates(selectedDate).forEach(date => {
				const tmp = lookupPlaceName(date)
				drawLineFromPlaces(lastLoc,tmp);
				lastLoc = tmp;
			});
			//We neeed to draw a path between all previous ones.
		}
		else {
			drawCircle(loc.x,loc.y, currentLocationName)
		}
	}
})
</script>
<g id="path-{character.toLowerCase()}" bind:this={drawBase}></g>
