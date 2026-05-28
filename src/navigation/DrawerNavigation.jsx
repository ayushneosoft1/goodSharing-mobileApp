import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";

import PostsListPage from "../pages/PostsListPage";
import MyPostsPage from "../pages/MyPostsPage";
import SubscribeCategoryPage from "../pages/SubscribeCategoryPage";
import NotificationPage from "../pages/NotificationPage";
import MySubscriptionsPage from "../pages/MySubscriptionsPage";
import LogoutPage from "../pages/LogoutPage";

const Drawer = createDrawerNavigator();

function DrawerNavigation() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerTitleAlign: "center",
      }}
    >
      <Drawer.Screen name="Posts" component={PostsListPage} />

      <Drawer.Screen
        name="MyPosts"
        component={MyPostsPage}
        options={{
          title: "My Posts",
        }}
      />

      <Drawer.Screen
        name="SubscribeCategory"
        component={SubscribeCategoryPage}
        options={{
          title: "Subscribe Category",
        }}
      />

      <Drawer.Screen
        name="MySubscriptions"
        component={MySubscriptionsPage}
        options={{
          title: "My Subscriptions",
        }}
      />

      <Drawer.Screen name="Notifications" component={NotificationPage} />

      <Drawer.Screen name="Logout" component={LogoutPage} />
    </Drawer.Navigator>
  );
}

export default DrawerNavigation;
