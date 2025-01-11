

mapboxgl.accessToken=mapToken;
  const map = new mapboxgl.Map({
      container: 'map', // container ID
      style: 'mapbox://styles/mapbox/outdoors-v12',
      center: listing.geometry.coordinates,// starting position [lng, lat]. Note that lat must be set between -90 and 90
      zoom: 7 // starting zoom
  });
 
  const marker = new mapboxgl.Marker({ color: "red"})
  .setLngLat(listing.geometry.coordinates)
  .setPopup(new mapboxgl.Popup({ offset: 24})
  .setHTML(
    `<h4>${listing.location}</h4><p>Exact Location will be provided after booking</p>`
     ))
  .addTo(map);

  // ----------------Add an animated icon to the map------------------------------
const size = 200;
// This implements StyleImageInterface
// to draw a pulsing dot icon on the map.
const pulsingDot = {
  width: size,
  height: size,
  data: new Uint8Array(size * size * 4),

  // When the layer is added to the map,
  // get the rendering context for the map canvas.
  onAdd: function () {
    const canvas = document.createElement("canvas");
    canvas.width = this.width;
    canvas.height = this.height;
    this.context = canvas.getContext("2d");
  },

  // Call once before every frame where the icon will be used.
  render: function () {
    const duration = 1000;
    const t = (performance.now() % duration) / duration;

    const radius = (size / 2) * 0.3;
    const outerRadius = (size / 2) * 0.7 * t + radius;
    const context = this.context;

    // Draw the outer circle.
    context.clearRect(0, 0, this.width, this.height);
    context.beginPath();
    context.arc(this.width / 2, this.height / 2, outerRadius, 0, Math.PI * 2);
    context.fillStyle = `rgba(255, 150, 150, ${1 - t})`;
    context.fill();

    // Draw the inner circle.
    context.beginPath();
    context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2);
    context.fillStyle = "rgba(255, 100, 100, 10)";
    context.strokeStyle = "white";
    context.lineWidth = 2 + 4 * (1 - t);
    context.fill();
    context.stroke();

    // Update this image's data with data from the canvas.
    this.data = context.getImageData(0, 0, this.width, this.height).data;

    // Continuously repaint the map, resulting
    // in the smooth animation of the dot.
    map.triggerRepaint();

    // Return true to let the map know that the image was updated.
    return true;
  },
};