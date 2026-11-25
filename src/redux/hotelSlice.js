import { createSlice } from '@reduxjs/toolkit';
import {
  loadHotelsFromStorage,
  resetHotelsInStorage,
  saveHotelsToStorage,
} from '../utils/localStorage';

export const PRICE_TIER_RANGES = {
  all: { minPrice: '', maxPrice: '' },
  'under-20000': { minPrice: '', maxPrice: '20000' },
  'mid-range': { minPrice: '20000', maxPrice: '35000' },
  luxury: { minPrice: '35000', maxPrice: '' },
};

export function getActivePriceTier(minPrice, maxPrice) {
  for (const [tier, range] of Object.entries(PRICE_TIER_RANGES)) {
    if (range.minPrice === minPrice && range.maxPrice === maxPrice) {
      return tier;
    }
  }
  return 'custom';
}

function clearFilterState(state) {
  state.searchQuery = '';
  state.minPrice = '';
  state.maxPrice = '';
  state.sortBy = 'default';
  state.currentPage = 1;
}

const initialState = {
  hotels: loadHotelsFromStorage(),
  searchQuery: '',
  minPrice: '',
  maxPrice: '',
  sortBy: 'default',
  currentPage: 1,
  itemsPerPage: 6,
  notification: null,
};

const hotelSlice = createSlice({
  name: 'hotels',
  initialState,
  reducers: {
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
      state.currentPage = 1;
    },
    setMinPrice(state, action) {
      state.minPrice = action.payload;
      state.currentPage = 1;
    },
    setMaxPrice(state, action) {
      state.maxPrice = action.payload;
      state.currentPage = 1;
    },
    selectPriceTier(state, action) {
      const range = PRICE_TIER_RANGES[action.payload];
      if (!range) return;
      state.minPrice = range.minPrice;
      state.maxPrice = range.maxPrice;
      state.currentPage = 1;
    },
    setSortBy(state, action) {
      state.sortBy = action.payload;
      state.currentPage = 1;
    },
    setCurrentPage(state, action) {
      state.currentPage = Math.max(1, action.payload);
    },
    setItemsPerPage(state, action) {
      state.itemsPerPage = action.payload;
      state.currentPage = 1;
    },
    resetFilters(state) {
      clearFilterState(state);
    },
    addHotel(state, action) {
      const newHotel = {
        id: `htl-${Date.now()}`,
        title: action.payload.title,
        description: action.payload.description,
        latitude: action.payload.latitude,
        longitude: action.payload.longitude,
        price: action.payload.price,
        image: action.payload.image || '',
        location: action.payload.location || '',
        rooms: action.payload.rooms ?? null,
        rating: action.payload.rating ?? null,
      };
      state.hotels.unshift(newHotel);
      clearFilterState(state);
      saveHotelsToStorage(state.hotels);
    },
    updateHotel(state, action) {
      const index = state.hotels.findIndex(
        (hotel) => hotel.id === action.payload.id
      );
      if (index === -1) return;

      state.hotels[index] = {
        ...state.hotels[index],
        title: action.payload.title,
        description: action.payload.description,
        latitude: action.payload.latitude,
        longitude: action.payload.longitude,
        price: action.payload.price,
        image: action.payload.image,
      };
      saveHotelsToStorage(state.hotels);
    },
    deleteHotel(state, action) {
      state.hotels = state.hotels.filter((hotel) => hotel.id !== action.payload);
      saveHotelsToStorage(state.hotels);
    },
    restoreSampleHotels(state) {
      state.hotels = resetHotelsInStorage();
      clearFilterState(state);
    },
    setNotification(state, action) {
      state.notification = {
        id: Date.now(),
        message: action.payload.message,
        tone: action.payload.tone || 'success',
      };
    },
    clearNotification(state) {
      state.notification = null;
    },
  },
});

export const {
  setSearchQuery,
  setMinPrice,
  setMaxPrice,
  selectPriceTier,
  setSortBy,
  setCurrentPage,
  setItemsPerPage,
  resetFilters,
  addHotel,
  updateHotel,
  deleteHotel,
  restoreSampleHotels,
  setNotification,
  clearNotification,
} = hotelSlice.actions;

export default hotelSlice.reducer;
