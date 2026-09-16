maptilersdk.config.apiKey = mapToken;

const coordinates = listing.geometry.coordinates;

const map = new maptilersdk.Map({
  container: "map",
  style: maptilersdk.MapStyle.STREETS,
  center: coordinates,
  zoom: 12
});

const marker = new maptilersdk.Marker({color: "red" })
  .setLngLat(coordinates)
  .setPopup(
    new maptilersdk.Popup({ offset: 25 })
      .setHTML(`<h4>${listing.title}</h4><p>Exact location will be provided after booking</p>`)
  )
  .addTo(map);

console.log("Marker coordinates:", coordinates);
