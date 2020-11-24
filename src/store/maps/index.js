import { SET_YMAPS, SET_YMAPS_INSTANCE } from '@/store/maps/mutations';
import { LOAD_YMAPS, LOAD_YMAPS_INSTANCE } from '@/store/maps/actions';

export const maps = {
  actions: {
    [LOAD_YMAPS](context, ymaps) {
      context.commit(SET_YMAPS, ymaps);
    },
    [LOAD_YMAPS_INSTANCE](context, ymapsInstance) {
      context.commit(SET_YMAPS_INSTANCE, ymapsInstance);
    }
  },
  mutations: {
    [SET_YMAPS](state, ymaps) {
      state.ymaps = ymaps;
    },
    [SET_YMAPS_INSTANCE](state, ymapsInstance) {
      state.ymapsInstance = ymapsInstance;
    }
  },
  namespaced: true,
  state: () => ({
    ymaps: null,
    ymapsInstance: null
  }),
};
