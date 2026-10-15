(() => {
  if (/\/who-its-for(?:\.html)?\/?$/.test(location.pathname)) {
    location.replace('index.html#seasons');
    return;
  }
  const destinations = {'#product':'how-it-works.html#product','#markets':'index.html#seasons','#why':'why.html','#thinking':'how-it-works.html#thinking'};
  const destination = destinations[location.hash];
  if (destination && !location.pathname.endsWith(destination.split('#')[0])) location.replace(destination);
})();
