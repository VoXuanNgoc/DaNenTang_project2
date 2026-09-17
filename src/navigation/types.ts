import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

export type BrowseStackParamList = {
  BrowseRooms: undefined;
  RoomDetail: { roomId: string };
};

export type RootTabParamList = {
  BrowseTab: NavigatorScreenParams<BrowseStackParamList>;
  MyBookingsTab: undefined;
  ProfileTab: undefined;
};

export type BrowseStackScreenProps<T extends keyof BrowseStackParamList> =
  NativeStackScreenProps<BrowseStackParamList, T>;

export type RootTabScreenProps<T extends keyof RootTabParamList> =
  BottomTabScreenProps<RootTabParamList, T>;
