import Icon from 'ol/style/Icon';
import { Fill, Stroke, Style as Style, Text } from 'ol/style';
import { MapUtils } from '@npt/npt-map';

// COLORS

export const COLOR = {
    LIGHT_GREEN: 'rgba(0, 255, 0, 0.7)',
    LIGHT_BLUE: 'rgb(102, 204, 255, 0.8)',
    BLUE: 'rgb(0, 0, 255, 0.8)',
    BLACK: 'rgba(0, 0, 0, 1)',
};

export const IMG = {
    ARROW_BLUE: 'assets/images/map/arrow_blue.png',
    MARKER_HEADING: 'assets/images/map/marker_heading.png'
};


export function StyleArrowBlue(rotation: number): any {
    const scale = 0.4;
    const anchor = [0.4, 0.4];
    return MapUtils.Style.StylePointWithRotation(IMG.ARROW_BLUE, scale, anchor, rotation);
}

const StyleDotOrderLabel = (Color: string, tExt: string): Style => {
    return new Style({
        image: new Icon({
            src: IMG.MARKER_HEADING,
            anchor: [0.515, 0.686],
            color: Color
        }),
        text: new Text({
            text: tExt,
            font: 'bold',
            offsetY: -20,
            scale: 1,
            fill: new Fill({
                color: COLOR.BLACK
            }),
            stroke: new Stroke({
                color: COLOR.BLACK,
                width: 1.4
            })
        })
    });
};

const StylePoint = (Color: string): Style => {
    return new Style({
        image: new Icon({
            src: IMG.ARROW_BLUE,
            scale: 0.3,
            anchor: [0.5, 0.5],
            color: Color
        }),
    });
};


export const Expstyle: any = {

    SECTION_LINKS: MapUtils.Style.StyleLineString(COLOR.LIGHT_GREEN, 14),
    SECTION_LINKS_LIGHT: MapUtils.Style.StyleLineString(COLOR.LIGHT_BLUE, 14),
    SECTION_COUNTER: MapUtils.Style.StyleLineString,
    ARROW_BLUE: StyleArrowBlue,
    ARROW_WITH_COLOR: StylePoint,
    POLYGON_SELECTOR: MapUtils.Style.StylePolygonSelector('#4caf50', 0.4),
    POINT_WITH_ORDER: StyleDotOrderLabel,
};



