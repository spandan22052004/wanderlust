const sampleListings = [
  {
    title: "Cozy Beachfront Cottage",
    description: "Escape to this charming beachfront cottage for a relaxing getaway. Enjoy stunning ocean views and easy access to the beach.",
    image: {
      url: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
      filename: "listing_image"
    },
    price: 1500,
    location: "Malibu, United States",
    country: "United States",
    geometry: {
      type: "Point",
      coordinates: [-118.7798, 34.0259]
    }
  },
  {
    title: "Modern Loft in Downtown",
    description: "Stay in the heart of the city in this stylish loft apartment. Perfect for urban explorers!",
    image: {
      url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
      filename: "listing_image"
    },
    price: 1200,
    location: "New York City, United States",
    country: "United States",
    geometry: {
      type: "Point",
      coordinates: [-74.0060, 40.7128]
    }
  },
  {
    title: "Rustic Mountain Cabin",
    description: "Enjoy the serenity of nature in this rustic cabin nestled in the mountains. A perfect retreat for outdoor enthusiasts.",
    image: {
      url: "https://images.unsplash.com/photo-1445991842772-097fea258e7b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bW91bnRhaW4lMjBjYWJpbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
      filename: "listing_image"
    },
    price: 900,
    location: "Aspen, United States",
    country: "United States",
    geometry: {
      type: "Point",
      coordinates: [-106.8370, 39.1911]
    }
  },
  {
    title: "Luxury Villa with Private Pool",
    description: "Indulge in luxury at this stunning villa featuring a private pool and breathtaking views. Ideal for a high-end vacation.",
    image: {
      url: "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cHJpdmF0ZSUyMHBvb2x8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
      filename: "listing_image"
    },
    price: 3000,
    location: "Santorini, Greece",
    country: "Greece",
    geometry: {
      type: "Point",
      coordinates: [25.4858, 36.3932]
    }
  },
  {
    title: "Charming Countryside B&B",
    description: "Relax in the peaceful countryside at this charming bed and breakfast. Perfect for a romantic weekend getaway.",
    image: {
      url: "https://images.unsplash.com/photo-1470309864661-68328b2cd0a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8YmVkJTIwYW5kJTIwYnJlYWtmYXN0fGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
      filename: "listing_image"
    },
    price: 700,
    location: "Tuscany, Italy",
    country: "Italy",
    geometry: {
      type: "Point",
      coordinates: [11.2558, 43.7696]
    }
  }
];

module.exports = { data: sampleListings };
