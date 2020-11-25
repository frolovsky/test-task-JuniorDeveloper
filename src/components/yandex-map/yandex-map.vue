<template>
  <yandex-map
    :coords="marker.coords"
    zoom="10"
    style="width: 100%; height: 100vh"
    :settings="yandexMapSetting"
    @map-was-initialized="initMapHandler"
    @click="getInfoAboutCoords"
  >
    <ymap-marker
      v-if="!marker.hidden"
      :coords="marker.coords"
      :hint-content="marker.hint"
      :marker-id="marker.id"
      marker-type="placemark"
    >
      <span slot="balloon">{{ marker.hint }}</span>
    </ymap-marker>
  </yandex-map>
</template>

<script>
import { yandexMap, ymapMarker, loadYmap } from 'vue-yandex-maps';
import { mapActions, mapState } from 'vuex';
import {
  LOAD_YMAPS,
  LOAD_YMAPS_INSTANCE,
  LOAD_MKAD_POLYGON,
  LOAD_PREV_ROUTE,
  LOAD_PREV_LINE,
} from '@/store/maps/actions';
import { mkadCoords } from '@/common/helpers/coords';
import axios from 'axios';

export default {
  name: 'YandexMap',
  components: {
    yandexMap,
    ymapMarker,
  },
  data: () => ({
    yandexMapSetting: {
      apiKey: process.env.VUE_APP_YANDEX_MAP_API_KEY,
      lang: 'ru_RU',
      coordorder: 'latlong',
      version: '2.1',
    },
    marker: {
      hidden: true,
      coords: [55.753215, 37.622504],
      id: 1,
      hint: '',
    },
  }),
  computed: {
    ...mapState('maps', {
      ymaps: (state) => state.ymaps,
      ymapsInstance: (state) => state.ymapsInstance,
      polygon: (state) => state.polygon,
      prevRoute: (state) => state.prevRoute,
      prevLine: (state) => state.prevLine,
    }),
  },
  methods: {
    ...mapActions('maps', {
      loadYmaps: LOAD_YMAPS,
      loadYmapsInstance: LOAD_YMAPS_INSTANCE,
      loadMkadPolygon: LOAD_MKAD_POLYGON,
      loadPrevRoute: LOAD_PREV_ROUTE,
      loadPrevLine: LOAD_PREV_LINE,
    }),
    async initMapHandler(map) {
      await loadYmap();
      this.loadYmaps(window.ymaps);
      this.loadYmapsInstance(map);

      const polygonGeometry = new this.ymaps.geometry.Polygon([
        mkadCoords,
      ]);
      const polygonGeoObject = new this.ymaps.GeoObject({ geometry: polygonGeometry });
      map.geoObjects.add(polygonGeoObject);

      this.loadMkadPolygon(polygonGeoObject);
    },
    async getInfoAboutCoords(e) {
      const coords = e.get('coords');
      const coordsString = coords.join(',');
      const { data } = await axios
        .get(`https://geocode-maps.yandex.ru/1.x/?apikey=${process.env.VUE_APP_YANDEX_MAP_API_KEY}&format=json&geocode=${coordsString}&results=1&sco=latlong`);

      const adress = data.response.GeoObjectCollection
        .featureMember[0].GeoObject
        .metaDataProperty.GeocoderMetaData.text;

      console.log(`Адрес новой метки: ${adress}`);
      this.showMarker(coords, adress);
      this.createRoute(coords);
    },
    createRoute(coords) {
      const indexClosestPoint = this.polygon.geometry.getClosest(coords).closestPointIndex;
      this.ymaps.route(
        [
          coords, mkadCoords[indexClosestPoint],
        ], {
          mapStateAutoApply: true,
        },
      ).then((route) => {
        this.ymapsInstance.geoObjects.remove(this.prevRoute);
        console.log(`Длина маршрута: ${Math.floor(route.getLength())} метров`);
        this.ymapsInstance.geoObjects.add(route);
        this.loadPrevRoute(route);
      });

      const polyline = new this.ymaps.Polyline([
        coords, mkadCoords[indexClosestPoint],
      ], {}, {
        draggable: false,
        strokeColor: '#000000',
        strokeWidth: 3,
        strokeStyle: '1 5',
      });

      this.ymapsInstance.geoObjects.remove(this.prevLine);
      this.loadPrevLine(polyline);
      this.ymapsInstance.geoObjects.add(polyline);
      this.ymapsInstance.setBounds(polyline.geometry.getBounds());
    },
    showMarker(coords, hint) {
      this.marker.hidden = false;
      this.marker.coords = coords;
      this.marker.hint = hint;
    },
  },
};
</script>
