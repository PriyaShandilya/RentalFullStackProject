const map = new maplibregl.Map({
        container: 'map', 
        style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${mapToken}`, 
        center: listing.geometry.coordinates, 
        zoom: 15,
   
    });
const marker = new maplibregl.Marker({color:"red"})
        .setLngLat(listing.geometry.coordinates)
        .setPopup(new maplibregl.Popup({ offset: 25 })
        .setHTML(`${listing.location}<p>Exact location provided after booking</p>`))
        .addTo(map); 