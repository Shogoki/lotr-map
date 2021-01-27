<script>
function clicked (e){
	const pt = svg.createSVGPoint();

	// pass event coordinates
	pt.x = e.clientX;
	pt.y = e.clientY;

	// transform to SVG coordinates
	const svgP = pt.matrixTransform( svg.getScreenCTM().inverse() );

	console.log(svgP.x)
	console.log(svgP.y)
	alert("x: "+svgP.x+" y:"+svgP.y);
}
let svg;
function draw() {
	console.log("drawnow")
	var rect = document.createElementNS("http://www.w3.org/2000/svg", 'circle')
	rect.setAttributeNS(null, 'width', 100)
	rect.setAttributeNS(null, 'cx', 700)
	rect.setAttributeNS(null, 'cy', 800)

	rect.setAttributeNS(null, 'r', 10)
	rect.setAttributeNS(null, 'fill', 'red')
	svg.appendChild(rect)

}
</script>

<main>
	<svg id="map" viewBox="0 0 3200 2400" version="1.1"
	 xmlns="http://www.w3.org/2000/svg" on:click={clicked}  bind:this={svg}>
		 <image x="0" y="0" href="/img/mapome-slim.svg" width="100%" height="100%" />
</svg>

	<!-- <object data="/img/mapome-slim.svg" type="image/svg+xml"  > -->
</main>
<button on:click={draw} >TEST</button>

<style>

</style>