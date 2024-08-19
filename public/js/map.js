mapboxgl.accessToken = mapToken;
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        center: coordinate, // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 9// starting zoom
    });

    console.log(coordinate);

    const marker1 = new mapboxgl.Marker({color : "red"})
        .setLngLat(coordinate)
        .addTo(map);
