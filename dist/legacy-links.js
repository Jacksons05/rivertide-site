(() => {
  if (/\/who-its-for(?:\.html)?\/?$/.test(location.pathname)) {
    location.replace('/#seasons');
    return;
  }
  const destinations = {'#product':'/how-it-works#product','#markets':'/#seasons','#why':'/why','#thinking':'/how-it-works#thinking'};
  const destination = destinations[location.hash];
  const currentPath = location.pathname.replace(/\.html$/, '').replace(/\/index$/, '/') || '/';
  if (destination && currentPath !== destination.split('#')[0]) location.replace(destination);
})();
