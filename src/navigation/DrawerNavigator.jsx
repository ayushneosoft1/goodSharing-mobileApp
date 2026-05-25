import React from "react";

import { createDrawerNavigator } from "@react-navigation/drawer";

import MyPostsPage from "../pages/MyPostsPage";

import LogoutPage from "../pages/LogoutPage";

import SubscribeCategoryPage from "../pages/SubscribeCategoryPage";

import NotificationPage from "../pages/NotificationPage";

const Drawer = createDrawerNavigator();

function DrawerNavigation() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="MyPosts" component={MyPostsPage} />

      <Drawer.Screen
        name="SubscribeCategory"
        component={SubscribeCategoryPage}
        options={{
          title: "Subscribe Category",
        }}
      />

      <Drawer.Screen name="Notifications" component={NotificationPage} />

      <Drawer.Screen name="Logout" component={LogoutPage} />
    </Drawer.Navigator>
  );
}

export default DrawerNavigation;
