import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";

import PostsListPage from "../pages/PostsListPage";
import MyPostsPage from "../pages/MyPostsPage";
import NotificationPage from "../pages/NotificationPage";
import MyProfilePage from "../pages/MyProfilePage";
import LogoutPage from "../pages/LogoutPage";
import SubscribeCategoryPage from "../pages/SubscribeCategoryPage";
import MySubscriptionsPage from "../pages/MySubscriptionsPage";

const Drawer = createDrawerNavigator();

export default function DrawerNavigation() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerTitleAlign: "center",
        headerStyle: {
          backgroundColor: "#ffffff",
        },
        headerTintColor: "#000000",
        headerTitleStyle: {
          color: "#000000",
          fontWeight: "bold",
        },
        drawerType: "front",
      }}
    >
      <Drawer.Screen name="Posts" component={PostsListPage} />
      <Drawer.Screen name="MyPosts" component={MyPostsPage} />
      <Drawer.Screen name="Notifications" component={NotificationPage} />
      <Drawer.Screen name="MyProfile" component={MyProfilePage} />
      <Drawer.Screen name="SubscribeCategory" component={SubscribeCategoryPage} />
      <Drawer.Screen name="MySubscriptions" component={MySubscriptionsPage} />
      <Drawer.Screen name="LogOut" component={LogoutPage} />
    </Drawer.Navigator>
  );
}
