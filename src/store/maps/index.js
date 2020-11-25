import {
  SET_YMAPS,
  SET_YMAPS_INSTANCE,
  SET_MKAD_POLYGON,
  SET_PREV_ROUTE,
  SET_PREV_LINE,
} from '@/store/maps/mutations';
import {
  LOAD_YMAPS,
  LOAD_YMAPS_INSTANCE,
  LOAD_MKAD_POLYGON,
  LOAD_PREV_ROUTE,
  LOAD_PREV_LINE,
} from '@/store/maps/actions';

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
    [LOAD_PREV_ROUTE](context, route) {
      context.commit(SET_PREV_ROUTE, route);
    },
    [LOAD_PREV_LINE](context, line) {
      context.commit(SET_PREV_LINE, line);
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
    [SET_PREV_ROUTE](state, route) {
      state.prevRoute = route;
    },
    [SET_PREV_LINE](state, line) {
      state.prevLine = line;
    },
  },
  namespaced: true,
  state: () => ({
    ymaps: null,
    ymapsInstance: null,
    polygon: null,
    prevLine: null,
    prevRoute: null,
  }),
};
