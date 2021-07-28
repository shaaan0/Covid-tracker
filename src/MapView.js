import React from 'react';
import { MapContainer, TileLayer,useMap } from 'react-leaflet';
import './MapView.css';
import { drawCirclesOnMap } from './util';

const ChangeMap = ({ center, zoom }) => {
    const map = useMap();
    map.setView(center, zoom);
    return null;
    };

function MapView({countries ,casesType, center, zoom}) {
    
    return (
        <div className ="map">
            <MapContainer >
                <ChangeMap center={center} zoom={zoom}/>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                {drawCirclesOnMap(countries,casesType)}
            </MapContainer>
        
        </div>
    )
}

export default MapView

