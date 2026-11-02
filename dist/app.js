const stateNames={AC:'Acre',AL:'Alagoas',AP:'Amapá',AM:'Amazonas',BA:'Bahia',CE:'Ceará',DF:'Distrito Federal',ES:'Espírito Santo',GO:'Goiás',MA:'Maranhão',MT:'Mato Grosso',MS:'Mato Grosso do Sul',MG:'Minas Gerais',PA:'Pará',PB:'Paraíba',PR:'Paraná',PE:'Pernambuco',PI:'Piauí',RJ:'Rio de Janeiro',RN:'Rio Grande do Norte',RS:'Rio Grande do Sul',RO:'Rondônia',RR:'Roraima',SC:'Santa Catarina',SP:'São Paulo',SE:'Sergipe',TO:'Tocantins'};
const stateCodes={'11':'RO','12':'AC','13':'AM','14':'RR','15':'PA','16':'AP','17':'TO','21':'MA','22':'PI','23':'CE','24':'RN','25':'PB','26':'PE','27':'AL','28':'SE','29':'BA','31':'MG','32':'ES','33':'RJ','35':'SP','41':'PR','42':'SC','43':'RS','50':'MS','51':'MT','52':'GO','53':'DF'};

const stateSelect=document.getElementById('stateSelect'),cards=document.getElementById('cards');let selectedState='all',selectedPlace=null;const themeKey='fgc-map-theme',validThemes=['blue','red','yellow'],query=new URLSearchParams(location.search),embedMode=query.has('embed'),requestedTheme=query.get('theme')||query.get('tema');if(embedMode)document.body.classList.add('embed-mode');if(embedMode&&(query.get('hide')||'').split(',').some(value=>value.trim().toLowerCase()==='theme'))document.body.classList.add('hide-theme-selector');let savedTheme=null;try{savedTheme=localStorage.getItem(themeKey)}catch{}const initialTheme=validThemes.includes(requestedTheme)?requestedTheme:(validThemes.includes(savedTheme)?savedTheme:'blue');document.body.dataset.theme=initialTheme;document.querySelectorAll('[data-theme-choice]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.themeChoice===initialTheme)));
function applyTheme(theme){if(!validThemes.includes(theme))return;document.body.dataset.theme=theme;if(!embedMode){try{localStorage.setItem(themeKey,theme)}catch{}}document.querySelectorAll('[data-theme-choice]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.themeChoice===theme)));stateLayers.forEach((layer,code)=>{layer.setStyle(styleState(layer.feature));layer.getElement()?.classList.toggle("state-selected",selectedState===code)});}document.querySelectorAll('[data-theme-choice]').forEach(b=>b.addEventListener('click',()=>applyTheme(b.dataset.themeChoice)));const map=L.map('map',{zoomControl:true,scrollWheelZoom:true,attributionControl:false,preferCanvas:false,zoomSnap:.25,maxBoundsViscosity:.9}).setView([-14.3,-52.2],4);const statesLayer=L.featureGroup().addTo(map),stateLayers=new Map(),cityMarkers=new Map(),visibleMarkers=L.featureGroup().addTo(map);let geoData=null,markerScale=1,viewRevision=0;function constrainMap(){if(!geoData)return;const bounds=statesLayer.getBounds();map.setMaxBounds(bounds.pad(.16));map.setMinZoom(Math.max(3,map.getBoundsZoom(bounds,false,[18,18])-.5));}function fitBrazil(){map.fitBounds(statesLayer.getBounds(),{padding:[28,28],animate:false});}function queueStateView(code){const layer=stateLayers.get(code);if(layer)map.fitBounds(layer.getBounds(),{padding:[45,45],maxZoom:7,animate:false});}function styleState(feature){const code=stateCodes[String(feature.properties.codarea)],count=places.filter(p=>p.state===code).length,cs=getComputedStyle(document.body),stroke=cs.getPropertyValue('--state-stroke').trim(),activeStroke=cs.getPropertyValue('--lime').trim(),active=selectedState===code;if(!count)return{color:stroke,weight:1,opacity:.72,fillColor:cs.getPropertyValue('--state-empty').trim(),fillOpacity:.82};return{color:active?activeStroke:stroke,weight:active?3.6:1.2,opacity:1,fillColor:active?cs.getPropertyValue('--state-active').trim():cs.getPropertyValue('--state-has').trim(),fillOpacity:active?1:.95};}
const stateCapitals={AC:'Rio Branco',AL:'Maceió',AP:'Macapá',AM:'Manaus',BA:'Salvador',CE:'Fortaleza',DF:'Brasília',ES:'Vitória',GO:'Goiânia',MA:'São Luís',MT:'Cuiabá',MS:'Campo Grande',MG:'Belo Horizonte',PA:'Belém',PB:'João Pessoa',PR:'Curitiba',PE:'Recife',PI:'Teresina',RJ:'Rio de Janeiro',RN:'Natal',RS:'Porto Alegre',RO:'Porto Velho',RR:'Boa Vista',SC:'Florianópolis',SP:'São Paulo',SE:'Aracaju',TO:'Palmas'},capitalAliases={PA:['Belém do Pará']};function normalizeCity(value){return value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('pt-BR')}function isCapitalCity(city,state){const target=normalizeCity(city);return target===normalizeCity(stateCapitals[state])||(capitalAliases[state]||[]).some(name=>target===normalizeCity(name))}function cityGroupKey(place){return `${place.state}:${place.lat.toFixed(3)}:${place.lng.toFixed(3)}`}function groupCities(items){const groups=new Map();items.forEach(p=>{const k=cityGroupKey(p);if(!groups.has(k))groups.set(k,{key:k,city:p.city,state:p.state,lat:p.lat,lng:p.lng,isCapital:true,locationScope:null,cities:new Set(),items:[]});const group=groups.get(k);group.cities.add(p.city);group.locationScope=group.locationScope||p.locationScope;if(p.locationScope||!isCapitalCity(p.city,p.state))group.isCapital=false;group.items.push(p)});return[...groups.values()].map(group=>({...group,city:[...group.cities].join(' / ')}))}
function cityMarkerSize(count){return Math.round((count>1?34:30)*markerScale)}
function cityIcon(count,isCapital){const size=cityMarkerSize(count);return L.divIcon({className:'',html:'<span class="citypin '+(isCapital?'capital':'non-capital')+'" style="width:'+size+'px;height:'+size+'px">'+count+'</span>',iconSize:[size,size],iconAnchor:[size/2,size/2]});}
let visibleCityItems=places;
function unifiedCityIcon(count){const size=Math.round(38*markerScale);return L.divIcon({className:'unified-cluster-icon',html:'<span class="unified-cluster-pin">'+count+'</span>',iconSize:[size,size],iconAnchor:[size/2,size/2]});}
function nearbyCityGroups(groups) {
  const radius = 76 * markerScale;
  const points = groups.map(group => map.latLngToLayerPoint([group.lat, group.lng]));
  return groupNearbyPoints(groups, points, radius);
}

function renderCityMarkers() {
  visibleMarkers.clearLayers();
  cityMarkers.clear();

  const groups = groupCities(visibleCityItems);
  nearbyCityGroups(groups).forEach(cluster => {
    const total = cluster.reduce((sum, group) => sum + group.items.length, 0);
    const isNearby = cluster.length > 1;
    const latlng = [cluster[0].lat, cluster[0].lng];
    const localLabel = total === 1 ? 'local' : 'locals';
    const title = isNearby
      ? map.getZoom() < 6
        ? `${total} ${localLabel} em ${cluster.length} cidades`
        : `${cluster.length} cidades próximas · ${total} ${localLabel}`
      : `${cluster[0].city}: ${total} ${localLabel}`;
    const icon = isNearby ? unifiedCityIcon(total) : cityIcon(total, cluster[0].isCapital);
    const marker = L.marker(latlng, { icon, title });

    const sections = cluster.map(group => {
      const type = group.locationScope ? 'unverified' : group.isCapital ? 'capital' : 'non-capital';
      const typeLabel = group.locationScope ? 'Localização não verificada' : group.isCapital ? 'Capital' : 'Outra cidade';
      const placeLinks = group.items
        .map(place => `<button class="venue-link" data-id="${place.id}">${place.name}</button>`)
        .join('');
      return `<section class="nearby-popup-group"><div class="nearby-popup-heading"><b>${group.city} · ${group.state}</b><span class="nearby-popup-meta"><span class="nearby-popup-type ${type}">${typeLabel}</span><span>${group.items.length} ${group.items.length === 1 ? 'local' : 'locals'}</span></span></div>${placeLinks}</section>`;
    }).join('');
    const totalLabel = `${total} ${localLabel}${isNearby ? ' no total' : ''}`;
    const heading = isNearby
      ? `<b>${cluster.length} cidades próximas</b>`
      : `<b>${cluster[0].city} · ${cluster[0].state}</b>`;
    const html = `${heading}<div class="nearby-popup-total">${totalLabel}</div>${sections}`;

    marker.bindPopup(html, { maxWidth: 310 });
    marker.addTo(visibleMarkers);
    cluster.forEach(group => cityMarkers.set(group.key, marker));
  });
}
function renderCityGroups(items) {
  const groups = new Map();
  items
    .slice()
    .sort((a, b) => a.id - b.id)
    .forEach(place => {
      if (!groups.has(place.city)) groups.set(place.city, []);
      groups.get(place.city).push(place);
    });

  return [...groups]
    .sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0], 'pt-BR'))
    .map(([city, group]) => `<section class="city-group"><div class="city-group-title"><span>${city}</span><span class="city-group-count">${group.length} ${group.length === 1 ? 'local' : 'locals'}</span></div>${group.map(place => `<button class="card ${selectedPlace === place.id ? 'active' : ''}" data-id="${place.id}"><img class="thumb" src="${place.imagePath}" alt="Logo de ${place.name}" loading="lazy" decoding="async"><span><span class="venue-name">${place.name}</span><span class="venue-meta">${place.city}</span></span></button>`).join('')}</section>`)
    .join('');
}

function showState(code) {
  map.stop();
  viewRevision++;
  selectedState = code || 'all';
  selectedPlace = null;
  stateSelect.value = selectedState;

  const title = document.getElementById('placesTitle');
  const overline = document.getElementById('placesOverline');
  const summary = document.getElementById('placesSummary');
  summary.textContent = '';
  summary.hidden = true;

  const localPlaces = selectedState === 'all'
    ? places
    : places.filter(place => place.state === selectedState);
  visibleCityItems = localPlaces;
  renderCityMarkers();

  if (selectedState === 'all') {
    title.textContent = 'Todos';
    overline.textContent = `${places.length} locals no Brasil`;
    cards.innerHTML = places.map(place => `<button class="card" data-id="${place.id}"><img class="thumb" src="${place.imagePath}" alt="Logo de ${place.name}" loading="lazy" decoding="async"><span><span class="venue-name">${place.name}</span><span class="venue-meta">${place.city} · ${stateNames[place.state]}</span></span></button>`).join('');

    if (geoData) fitBrazil();
  } else {
    title.textContent = stateNames[selectedState];
    overline.textContent = `${localPlaces.length} ${localPlaces.length === 1 ? 'local' : 'locals'} neste estado`;
    cards.innerHTML = localPlaces.length
      ? renderCityGroups(localPlaces)
      : '<div class="no-locations">Ainda não há locals neste estado nas referências mapeadas.</div>';
    queueStateView(selectedState);
  }

  cards.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => focusPlace(Number(card.dataset.id)));
  });
  refreshStates();
}
function refreshStates() {
  const activeStates = Object.keys(stateNames)
    .filter(code => places.some(place => place.state === code))
    .sort((a, b) => stateNames[a].localeCompare(stateNames[b], 'pt-BR'));

  stateSelect.innerHTML = '<option value="all">Todos</option>' + activeStates
    .map(code => `<option value="${code}">${stateNames[code]}</option>`)
    .join('');
  stateSelect.value = selectedState;

  stateLayers.forEach((layer, code) => {
    layer.setStyle(styleState(layer.feature));
    layer.getElement()?.classList.toggle('state-selected', selectedState === code);
  });
}

function focusPlace(id) {
  const place = places.find(item => item.id === id);
  if (!place) return;
  if (selectedState !== place.state) showState(place.state);

  selectedPlace = id;
  cards.querySelectorAll('.card').forEach(card => {
    card.classList.toggle('active', Number(card.dataset.id) === id);
  });
  cards.querySelector(`.card[data-id="${id}"]`)?.scrollIntoView({ block: 'nearest' });
  const markerKey = cityGroupKey(place);
  const target = L.latLng(place.lat, place.lng);
  const targetZoom = Math.max(map.getZoom(), 8);
  const openPopup = () => cityMarkers.get(markerKey)?.openPopup();

  if (map.getZoom() === targetZoom && map.getCenter().distanceTo(target) < 1) {
    openPopup();
    return;
  }

  map.once('moveend', openPopup);
  map.flyTo(target, targetZoom, { duration: 0.45 });
}
fetch('./states.geojson').then(r=>{if(!r.ok)throw Error('state boundaries unavailable');return r.json()}).then(data=>{geoData=data;const geo=L.geoJSON(data,{style:styleState,onEachFeature:(feature,layer)=>{const code=stateCodes[String(feature.properties.codarea)];if(!code)return;stateLayers.set(code,layer);if(!places.some(p=>p.state===code)){layer.options.interactive=false;return;}layer.bindTooltip(stateNames[code],{sticky:true,direction:'top'});layer.on({click:()=>showState(selectedState===code?'all':code),mouseover:e=>{const cs=getComputedStyle(document.body),active=selectedState===code;e.target.setStyle({weight:active?4.2:2.6,color:cs.getPropertyValue('--lime').trim(),fillColor:active?cs.getPropertyValue('--state-active').trim():cs.getPropertyValue('--hover').trim(),fillOpacity:1})},mouseout:e=>geo.resetStyle(e.target)});}}).addTo(statesLayer);const initialViewRevision=viewRevision;/* Wait for the iframe layout before constraining and fitting the map. */requestAnimationFrame(()=>requestAnimationFrame(()=>{map.invalidateSize({pan:false});constrainMap();if(viewRevision!==initialViewRevision)return;showState(selectedState);if(selectedState==='all')fitBrazil();}));}).catch(()=>{document.getElementById('map').setAttribute('aria-label','Os limites estaduais não puderam ser carregados.');});stateSelect.addEventListener('change',()=>showState(stateSelect.value));map.on('popupopen',e=>e.popup.getElement()?.querySelectorAll('.venue-link').forEach(b=>b.addEventListener('click',()=>focusPlace(Number(b.dataset.id)))));map.on('zoomend',renderCityMarkers);
const modal=document.getElementById('embedModal'),embedBaseUrl=`${location.origin}${location.pathname}`,embedCode=document.getElementById('embedCode');function updateEmbedCode(){const params=new URLSearchParams({embed:'1',theme:document.body.dataset.theme||'blue'}),embedUrl=`${embedBaseUrl}?${params}`;embedCode.value=`<iframe src="${embedUrl}" title="Mapa de locals da FGC no Brasil" loading="lazy" style="width:100%;height:680px;border:0;border-radius:8px"></iframe>`;}updateEmbedCode();document.querySelectorAll('[data-theme-choice]').forEach(b=>b.addEventListener('click',updateEmbedCode));document.getElementById('embedOpen')?.addEventListener('click',()=>{updateEmbedCode();modal.classList.add('open')});document.getElementById('closeModal').addEventListener('click',()=>modal.classList.remove('open'));modal.addEventListener('click',e=>{if(e.target===modal)modal.classList.remove('open')});document.getElementById('copyCode').addEventListener('click',async()=>{const b=document.getElementById('copyCode');try{await navigator.clipboard.writeText(embedCode.value)}catch{embedCode.select();document.execCommand('copy')}b.textContent='Copiado!';setTimeout(()=>b.textContent='Copiar código',1600)});
const mapResizeObserver=new ResizeObserver(()=>{requestAnimationFrame(()=>{const box=document.querySelector('.workspace').getBoundingClientRect(),scale=Math.min(1.5,Math.max(1,Math.max(box.width/1100,box.height/680))),scaleChanged=Math.abs(scale-markerScale)>.07;document.body.style.setProperty('--embed-scale',scale.toFixed(2));markerScale=scale;map.invalidateSize({pan:false});if(!geoData)return;if(scaleChanged)renderCityMarkers();})});mapResizeObserver.observe(document.querySelector('.mapwrap'));
