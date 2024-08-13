(function () {
  const lat = -32.9358448;
  const lng = -60.6512227;
  const mapa = L.map("mapa-inicio").setView([lat, lng], 16);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(mapa);
})();
