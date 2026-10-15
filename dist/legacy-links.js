// Preserve previously shared homepage anchors after moving content to pages.
(() => {
  const destinations = {'#product':'how-it-works.html#product','#markets':'who-its-for.html#markets','#why':'why.html','#thinking':'how-it-works.html#thinking'};
  const destination = destinations[location.hash];
  if (destination) location.replace(destination);
})();
