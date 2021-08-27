
  mapboxgl.accessToken = mapToken;
  const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/streets-v11', // style URL
  center: campground.geometry.coordinates, // starting position [lng, lat]
  zoom: 9 // starting zoom
  });

  // Add zoom and rotation controls to the map.
  map.addControl(new mapboxgl.NavigationControl());
// makinf a pinpoint
  const marker2 = new mapboxgl.Marker({ color: '#f28579', anchor: 'bottom'})
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({anchor: 'bottom', closeOnMove: true})
        .setHTML(`<h6>${campground.title}</h6><p>${campground.location}</p>`)
    )
    .addTo(map);

   
       
      