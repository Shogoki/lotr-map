<script lang="ts">
    import {getLocationSetByCharacter, getPlaceData, getPlaceLocation} from "./data"
    import type {LocationSet, CharacterName, DateKey, PlaceLocation, PlaceName} from "./data"
import { ShireDate } from "./data/util";
    export let character ="Frodo"
    export let includePath: boolean = true;
	export let selectedDate = ""
	export let color = "red"

	console.log(`DIsplay Path for ${character} at Date ${selectedDate} in Color ${color} (includepahts: ${includePath})`)
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

    function drawCircle(x: number, y: number) {
		console.log("drawnow")
		var rect = document.createElementNS("http://www.w3.org/2000/svg", 'circle')
		rect.setAttributeNS(null, 'width', 100)
		rect.setAttributeNS(null, 'cx', x.toString())
		rect.setAttributeNS(null, 'cy', y.toString())
		// rect.setAttributeNS(null, 'cx', 855)
		// rect.setAttributeNS(null, 'cy', 741)

		rect.setAttributeNS(null, 'r', "6")
		rect.setAttributeNS(null, 'fill', color)
		drawBase.appendChild(rect)

}
function drawLine(loc1: PlaceLocation, loc2: PlaceLocation, withDots=true) {
	var line = document.createElementNS("http://www.w3.org/2000/svg", 'line')
	//  <line x1="0" y1="80" x2="100" y2="20" stroke="black" />
	line.setAttributeNS(null, 'x1', loc1.x.toString())
	line.setAttributeNS(null, 'y1', loc1.y.toString())
	line.setAttributeNS(null, 'x2', loc2.x.toString())
	line.setAttributeNS(null, 'y2', loc2.y.toString())
	line.setAttributeNS(null, 'stroke', color)
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
$: currentLocationName = getLocName(selectedDate)

function getAllPreviousLocationDates(date: string, includeCurrent=true): string[] {
	if(!date || date == "")
		return []
	const availableDates = characterData.has(character) ? Array.from(characterData.get(character).keys()) : []
	console.log("COnverting date", date)
	const shireDate = new ShireDate(date)
	console.log("availabelDates", availableDates)
	const locs = availableDates.filter(
		item => shireDate.compareTo(new ShireDate(item)) >= 0
	).sort(
		(a,b) => (new ShireDate(a)).compareTo(new ShireDate(b))
		)
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
			drawCircle(loc.x,loc.y)
		}
	}
})
</script>

<g id="path-{character.toLowerCase()}" bind:this={drawBase}></g>