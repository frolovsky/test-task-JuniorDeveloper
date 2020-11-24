import { SET_YMAPS, SET_YMAPS_INSTANCE, SET_MKAD_POLYGON } from '@/store/maps/mutations';
import { LOAD_YMAPS, LOAD_YMAPS_INSTANCE, LOAD_MKAD_POLYGON } from '@/store/maps/actions';

/* eslint-disable import/prefer-default-export */
export const maps = {
  actions: {
    [LOAD_YMAPS](context, ymaps) {
      context.commit(SET_YMAPS, ymaps);
    },
    [LOAD_YMAPS_INSTANCE](context, ymapsInstance) {
      context.commit(SET_YMAPS_INSTANCE, ymapsInstance);
    },
    [LOAD_MKAD_POLYGON](context, polygon) {
      context.commit(SET_MKAD_POLYGON, polygon);
    },
  },
  mutations: {
    [SET_YMAPS](state, ymaps) {
      state.ymaps = ymaps;
    },
    [SET_YMAPS_INSTANCE](state, ymapsInstance) {
      state.ymapsInstance = ymapsInstance;
    },
    [SET_MKAD_POLYGON](state, polygon) {
      state.polygon = polygon;
    },
  },
  namespaced: true,
  state: () => ({
    ymaps: null,
    ymapsInstance: null,
    polygon: null,
  }),
};
