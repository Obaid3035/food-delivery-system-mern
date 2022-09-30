import React, {useState} from 'react';
import {GoogleApiWrapper, Map, mapEventHandler, Marker} from "google-maps-react";
import GooglePlacesAutocomplete, {geocodeByAddress, getLatLng} from "react-google-places-autocomplete";
import {BiCurrentLocation} from "react-icons/bi";
import {ICoordinates} from "../../../../interface";
import {autocompletionRequest} from "../../../../lib/helper";

interface IMapInputProps {
    selectedCoordinates: ICoordinates | null,
    setSelectedCoordinates: React.Dispatch<React.SetStateAction<null | ICoordinates>>,
    google: any;
}

const MapInput: React.FC<IMapInputProps> = ({setSelectedCoordinates, selectedCoordinates, google}) => {

    const [markerCoordinates, setMarkerCoordinates] = useState<ICoordinates | null>(null);
    const [googlePlace, setGooglePlace] = useState<any>(null);



    const getCurrentLocation = () => {
        setSelectedCoordinates(null)
        navigator.geolocation.getCurrentPosition(function ({coords: {latitude, longitude}}) {
            let coordinate = {
                lat: latitude,
                lng: longitude
            }
            setSelectedCoordinates(coordinate)
            setMarkerCoordinates(coordinate)
        });
    }

    const onPlaceSearch = (place: { label: string }) => {
        setSelectedCoordinates(null)
        setGooglePlace(place);
        geocodeByAddress(place.label)
            .then(results => getLatLng(results[0]))
            .then(({lat, lng}) => {
                    let coordinate = {
                        lat,
                        lng
                    }
                    setSelectedCoordinates(coordinate)
                    setMarkerCoordinates(coordinate)
                }
            );
    }

    const onMapClickHandler: mapEventHandler = (IMapProps, _Map, mapCoordinates) => {
        setSelectedCoordinates(null)
        const {latLng} = mapCoordinates;
        let coordinate = {
            lat: latLng.lat(),
            lng: latLng.lng()
        }
        setSelectedCoordinates(coordinate)
        setMarkerCoordinates(coordinate)
    }

    let map = (
        <div className={'text-center mt-3'}>
            <p>Please Enter Location First</p>
        </div>
    )
    if (selectedCoordinates) {
        map = (
            <div style={{
                position: "relative",
                minHeight: "300px"
            }}>
                <div className={'mb-4'}>
                    <Map google={google}
                         initialCenter={selectedCoordinates}
                         zoom={14}
                         onClick={onMapClickHandler}
                    >
                        <Marker position={markerCoordinates}/>
                    </Map>
                </div>
            </div>
        )
    }
    return (
        <React.Fragment>
            <div className={"d-flex w-100 align-items-center mb-3"}>
                <div className={"w-100"}>
                    <GooglePlacesAutocomplete
                        apiKey={process.env.REACT_APP_GOOGLE_MAP_API}
                        autocompletionRequest={autocompletionRequest}
                        selectProps={{
                            placeholder: 'Enter Location',
                            value: googlePlace,
                            onChange: (place) => onPlaceSearch(place),
                        }}
                    />
                </div>
                <BiCurrentLocation style={{cursor: 'pointer', fill: "#FF4201"}}
                                   onClick={getCurrentLocation}/>
            </div>
            {map}
        </React.Fragment>
    );
};

export default GoogleApiWrapper({
    apiKey: process.env.REACT_APP_GOOGLE_MAP_API!
})(MapInput)
