(function () {
  const lat = -32.9358448;
  const lng = -60.6512227;
  const mapa = L.map("mapa-inicio").setView([lat, lng], 13);

  let markers = new L.FeatureGroup().addTo(mapa);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(mapa);

  const obtenerPropiedades = async () => {
    try {
      const url = "/api/propiedades";
      const respuesta = await fetch(url);
      const propiedades = await respuesta.json();

      mostrarPropiedades(propiedades);
    } catch (error) {
      console.error("Error al obtener propiedades:", error);
    }
  };

  const mostrarPropiedades = (propiedades) => {
    propiedades.forEach((propiedad) => {
      //agregar los pines en el mapa
      const marker = new L.marker([propiedad?.lat, propiedad?.lng], {
        autoPan: true,
      }).addTo(mapa).bindPopup(`
        <p class="text-indigo-600 font-bold">${propiedad?.categoria.nombre}</p>
        <h1 class="text-xl font-extrabold uppercase my-2">${propiedad?.titulo}</h1> 
        <img src="/uploads/${propiedad.imagen}" alt="Imagen de la propiedad">
        <p class="text-gray-600 font-bold">${propiedad?.precio.nombre}</p>
        <a href="/propiedad/${propiedad.id}" class="bg-indigo-600 block p-2 text-center font-bold uppercase">Ver propiedad</a>
        `);

      markers.addLayer(marker);
    });
  };

  obtenerPropiedades();
})();
