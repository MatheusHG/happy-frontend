import React from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiArrowRight } from 'react-icons/fi';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';

import '../styles/pages/orphanages-map.css';

import mapMarkerImg from '../images/map-marker.svg';
import mapIcon from '../utils/mapIcon';


function LightOrDark(){
    const date = new Date();
    const Hours = date.getHours();

    var theme = "light";
    if(Hours >= 18 || Hours < 5) theme = "dark";
    
    return theme;
} 

function OrphanagesMap() {
    return (
        <div id="page-map">
            <aside>
                <header>
                    <img src={mapMarkerImg} alt="Happy" />

                    <h2>Escolha um orfanato no mapa</h2>
                    <p>Muitas crianças estão esperando a sua visita :)</p>
                </header>

                <footer>
                    <strong>Campina Grande</strong>
                    <span>Paraíba</span>
                </footer>
            </aside>

            <Map 
                center={[-7.2259926,-35.8808925]}
                zoom={15}
                style={{ width: '100%', height: '100%' }}
            >
                {/*<TileLayer url="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png" />*/}
                <TileLayer url={`https://api.mapbox.com/styles/v1/mapbox/${LightOrDark()}-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`} />
            
                <Marker 
                    icon={mapIcon}
                    position={[-7.2265537,-35.8934629]}
                >
                    <Popup closeButton={false} minWidth={240} maxWidth={240} className="map-popup">
                        Lar das meninas
                        <Link to="/orphanages/1">
                            <FiArrowRight size={20} color="#FFF"/>
                        </Link>
                    </Popup>
                </Marker>

            </Map>

            <Link to="/orphanages/create" className="create-orphanage has-shown" >
                <FiPlus size={32} color="#fff" />
            </Link>
        </div>
    )
}

export default OrphanagesMap;