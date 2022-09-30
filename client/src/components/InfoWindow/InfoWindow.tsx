import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { InfoWindow } from "google-maps-react";

export default function InfoWindowEx(props: any) {
    const infoWindowRef = React.createRef();
    const contentElement = document.createElement(`div`);
    useEffect(() => {
        ReactDOM.render(React.Children.only(props.children), contentElement);
        // @ts-ignore
        infoWindowRef.current.infowindow.setContent(contentElement);
    }, [props.children]); // eslint-disable-line react-hooks/exhaustive-deps
    return <InfoWindow ref={infoWindowRef} {...props} />;
}
