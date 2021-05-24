import * as L from "leaflet";

export function createCustomLeafletControl(position: L.ControlPosition, fontAwesomeIconName: string, onClick: GlobalEventHandlers["onclick"]) {
    return L.Control.extend({
        options: {
            position,
        },
        onAdd: () => {
            const container = L.DomUtil.create(
                "div",
                "leaflet-bar leaflet-control leaflet-control-custom",
            );
            container.style.backgroundColor = "white";
            container.style.width = "30px";
            container.style.height = "30px";
            container.innerHTML = `<i class="fa fa-${fontAwesomeIconName}" aria-hidden="true"></i>`;
            container.style.fontFamily = "icomoon";
            container.style.fontSize = "100%";
            container.style.textAlign = "center";
            container.style.fontWeight = "700";
            container.style.fontSize = "20px";
            container.style.cursor = "pointer";
            container.onclick = onClick;
            return container;
        },
    });
}
