import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {act} from 'react';

interface UserState {
  userData: any;
  itemData: any;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  refreshTokenExpiry: number | null;
}

const initialUserState: UserState = {
  userData: null,
  itemData: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  refreshTokenExpiry: null,
};

// Tạo slice cho user
const userSlice = createSlice({
  name: 'user',
  initialState: initialUserState,
  reducers: {
    login(
      state,
      action: PayloadAction<{
        accessToken: string;
        refreshToken: string;
        expiry: number;
      }>,
    ) {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.refreshTokenExpiry = Date.now() + action.payload.expiry * 1000;
      state.isAuthenticated = true;
    },
    logout(state) {
      state.accessToken = null;
      state.refreshToken = null;
      state.refreshTokenExpiry = null;
      state.isAuthenticated = false;
      state.userData = null;
      state.itemData = [];
    },
    setUserData(state, action: PayloadAction<any>) {
      state.userData = action.payload.userData;
    },
    setItemData(state, action: PayloadAction<any>) {
      state.itemData = action.payload;
      // state.detailsItemSelected = action.payload.
    },
  },
});

// Tạo slice cho item

interface ItemState {
  getSelectedItem: any | null;
  getDetailsItemSelected: any | null;
  getDetailsItem: any | null;
}

const initialItemState: ItemState = {
  getSelectedItem: null,
  getDetailsItem: null,
  getDetailsItemSelected: null,

  // batchNumber: null,
  // docEntry: null,
  // itemcode: null,
  // itemName: null,
  // proCode: null,
  // ProType: null,
  // tranferId: null,
  // whsCode: null,
};

const itemSlice = createSlice({
  name: 'item',
  initialState: initialItemState,
  reducers: {
    setInfoItem(state, action: PayloadAction<any>) {
      state.getSelectedItem = action.payload;
    },
    setDetailsItem(state, action: PayloadAction<any>) {
      state.getDetailsItem = action.payload.items;
    },
    setDetailsItemSelected(state, action: PayloadAction<any>) {
      state.getDetailsItemSelected = action.payload;
    },
  },
});

export const {login, logout, setUserData, setItemData} = userSlice.actions;
export const {setInfoItem, setDetailsItem, setDetailsItemSelected} =
  itemSlice.actions;

export const userReducer = userSlice.reducer;
export const itemReducer = itemSlice.reducer;
