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
      :coords="polygon.coords"
      :marker-id="polygon.id"
      :marker-fill="polygon.fill"
      marker-type="polygon"
    />
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
import { LOAD_YMAPS, LOAD_YMAPS_INSTANCE } from '@/store/maps/actions';
import { mkadCoords, getNearestPoint } from '@/common/helpers/coords';
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
    polygon: {
      coords: [mkadCoords],
      id: 2,
      fill: {
        enabled: true,
        color: '#69A2FF',
        opacity: .3
      },
      stroke: {
        color: '#69A2FF',
        opacity: 1, 
        width: 2, 
      }
    }
  }),
  computed: {
    ...mapState('maps', {
      ymaps: (state) => state.ymaps,
      ymapsInstance: (state) => state.ymapsInstance
    })
  },
  methods: {
    ...mapActions('maps', {
      loadYmaps: LOAD_YMAPS,
      loadYmapsInstance: LOAD_YMAPS_INSTANCE,
    }),
    async initMapHandler(map) {
      await loadYmap();
      this.loadYmaps(window.ymaps);
      this.loadYmapsInstance(map);
    },
    async getInfoAboutCoords(e) {
      const coords = e.get('coords');
      const coordsString = coords.join(',');
      const { data } = await axios
        .get(`https://geocode-maps.yandex.ru/1.x/?apikey=${process.env.VUE_APP_YANDEX_MAP_API_KEY}&format=json&geocode=${coordsString}&results=1&sco=latlong`);

      const adress = data.response.GeoObjectCollection
        .featureMember[0].GeoObject
        .metaDataProperty.GeocoderMetaData.text;

      this.showMarker(coords, adress);

      const routesCollection = new this.ymaps.GeoObjectCollection();
      this.ymaps.route(
        [
          coords, getNearestPoint(mkadCoords, coords)
        ], {
          mapStateAutoApply: true
        }
      ).then( route => {
        console.log(this.ymapsInstance.geoObjects)
        routesCollection.add(route);
        this.ymapsInstance.geoObjects.add(routesCollection);
      });
    },
    showMarker(coords, hint) {
      this.marker.hidden = false;
      this.marker.coords = coords;
      this.marker.hint = hint;
    },
  },
};
</script>
