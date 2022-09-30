import React, {useState} from 'react';
import {Map, Marker, GoogleApiWrapper, markerEventHandler} from "google-maps-react";
import {ICoordinates, IShopClient} from "../../../../../interface";
import InfoWindowEx from "../../../../../components/InfoWindow/InfoWindow";
import "./ShopMap.css";

interface IShopMap {
    google: any,
    shops: IShopClient[],
    selectedCoordinates: ICoordinates
}


const ShopMap: React.FC<IShopMap> = (props) => {


    const [infoShow, setInfoShow] = useState(false);
    const [selectedShop, setSelectedShop] = useState<IShopClient | null>(null);
    const [marker, setMarker] = useState<any>({});



    const onInfoWindowClose = () => {
        setMarker(null);
        setInfoShow(false)
    };
    const onMarkerClick: markerEventHandler = (_props, marker, shop: IShopClient) => {
        setSelectedShop(shop)
        setMarker(marker!)
        setInfoShow(true);
    }

    let markers, selectedMarker;

    if (props.shops.length > 0) {
        markers = (
            props.shops.map((shop) => (
                <Marker
                    onClick={(props, marker) => onMarkerClick(props, marker, shop)}
                    key={shop._id}
                    position={{
                        lat: shop.location.coordinates[0],
                        lng: shop.location.coordinates[1]
                    }}
                />
            ))
        )
    }

    if (selectedShop) {
        selectedMarker = (
            <InfoWindowEx
                marker={marker}
                onClose={onInfoWindowClose}
                visible={infoShow}
                options={{ maxWidth: 200, maxHeight: 500 }}
            >
                <div>
                    <img alt={'shop'}
                         src={selectedShop.shopImage.avatar}
                         className={'img-fluid w-100'}
                    />
                    <p className={'bold p-0 m-0'} style={{ cursor: 'pointer' }} onClick={() => window.location.href = '/shop/' + selectedShop._id}>{selectedShop.shopName}</p>
                </div>
            </InfoWindowEx>
        )
    }


    return (
        <div className="map_wrapper">
            <Map google={props.google}
                 initialCenter={props.selectedCoordinates}
                 zoom={14}
            >
                { markers }
                <Marker
                    icon={{url: 'data:image/svg+xml;base64,PHN2ZyBiYXNlUHJvZmlsZT0iZnVsbCIgd2lkdGg9Ijg2IiBoZWlnaHQ9Ijg2IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogICAgPGRlZnM+CiAgICAgICAgPGZpbHRlciBpZD0iYSIgY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzPSJzUkdCIj4KICAgICAgICAgICAgPGZlRHJvcFNoYWRvdyBkeD0iMCIgZHk9Ii41IiBzdGREZXZpYXRpb249Ii45IiBmbG9vZC1jb2xvcj0iIzkzOTM5OCIvPgogICAgICAgIDwvZmlsdGVyPgogICAgPC9kZWZzPgogICAgPGNpcmNsZSBjeD0iNDMiIGN5PSI0MyIgcj0iOCIgZmlsbD0iIzk0YzdmZiI+CiAgICAgICAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT0iciIgZnJvbT0iMTEiIHRvPSI0MCIgZHVyPSIycyIgYmVnaW49IjBzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIvPgogICAgICAgIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9Im9wYWNpdHkiIGZyb209IjEiIHRvPSIwIiBkdXI9IjJzIiBiZWdpbj0iMHMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIi8+CiAgICA8L2NpcmNsZT4KICAgIDxjaXJjbGUgY3g9IjQzIiBjeT0iNDMiIHI9IjgiIGZpbGw9IiNmZmYiIGZpbHRlcj0idXJsKCNhKSIvPgogICAgPGNpcmNsZSBjeD0iNDMiIGN5PSI0MyIgcj0iNSIgZmlsbD0iIzAxN2FmZiI+CiAgICAgICAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT0iciIgdmFsdWVzPSI1OzYuNTs1IiBiZWdpbj0iMHMiIGR1cj0iNC41cyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiLz4KICAgIDwvY2lyY2xlPgo8L3N2Zz4K',}}
                    position={props.selectedCoordinates}
                />
                { selectedMarker }
            </Map>
        </div>
    );
};


export default GoogleApiWrapper({
    apiKey: process.env.REACT_APP_GOOGLE_MAP_API!
})(ShopMap)

