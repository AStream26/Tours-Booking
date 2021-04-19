//console.log("hello from client side");

//console.log(locations);

export const displayMap = (locations)=>{
    mapboxgl.accessToken = 'pk.eyJ1IjoiYXN0cmVhbTI2IiwiYSI6ImNrbm9xdDQ3dDE5aGsyb3BiN3V1bGlsb2oifQ.kCwS7rFDruYWK10fao6Qmg';

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/astream26/cknoucqpf3t0417qqeeqbr7x6',
    scrollZoom:false

   
});

const bound  = new mapboxgl.LngLatBounds();

locations.forEach(loc => {
    //create Marker
    console.log(loc);
    const el =document.createElement('div');
    el.className = 'marker';
    //Add Marker
    new mapboxgl.Marker({
        element:el,
        anchor:'bottom',

    }).setLngLat(loc.coordinates).addTo(map);

    //Add Popup
    new mapboxgl.Popup({
        offset:30
    }).setLngLat(loc.coordinates)
    .setHTML(`<p>${loc.day}:${loc.description}</p>`).addTo(map);

  //Extend the map bound to include the current location
    bound.extend(loc.coordinates);
});


map.fitBounds(bound,{
    padding:{
        top:200,
        bottom:150,
        left:100,
        right:100
    }
});

}


// var map = new mapboxgl.Map({
//     container: 'map',
//     style: 'mapbox://styles/astream26/cknosod4t25xu17p72ctt7mw4',
//     center:[-118.622,34.8272],
//     zoom:10,
//     interactive:false
// });
