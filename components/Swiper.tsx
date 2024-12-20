import React, { Component, PropsWithChildren } from "react";
import { Animated, StyleSheet, Text, View, I18nManager } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { RectButton, Swipeable } from "react-native-gesture-handler";

export default class AppleStyleSwipeableRow extends Component<
  PropsWithChildren<{
    disabled: boolean;
    favoriteAction: () => void;
    deleteAction: () => void;
    listAction: () => void;
  }>
> {
  private renderLeftActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>,
  ) => {
    const opacity = progress.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 0, 1],
    });
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [-100, 0],
    });

    return (
      <Animated.View
        style={{ flex: 1, transform: [{ translateX: trans }], opacity }}
      >
        <View style={{ flexDirection: "row", flex: 1 }}>
          <RectButton
            style={styles.sell}
            onPress={() => {
              this.swipeableRow!.close();
              this.props.listAction();
            }}
          >
            <FontAwesome name="money" size={30} color="white" />
            <Text style={styles.sellText}>Sell This Item</Text>
          </RectButton>
          <RectButton
            style={styles.fav}
            onPress={() => {
              this.swipeableRow!.close();
              this.props.favoriteAction();
            }}
          >
            <FontAwesome name="star" size={30} color="white" />
            <Text style={styles.favText}>Favorite</Text>
          </RectButton>
        </View>
      </Animated.View>
    );
  };

  private renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>,
  ) => {
    const opacity = progress.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 0, 1],
    });
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [100, 0],
    });

    return (
      <Animated.View
        style={{ flex: 1, transform: [{ translateX: trans }], opacity }}
      >
        <View style={{ flexDirection: "row", flex: 1 }}>
          <RectButton
            style={styles.trash}
            onPress={() => {
              this.swipeableRow!.close();
              this.props.deleteAction();
            }}
          >
            <FontAwesome name="trash" size={30} color="white" />
            <Text style={styles.trashText}>Delete</Text>
          </RectButton>
        </View>
      </Animated.View>
    );
  };

  private swipeableRow?: Swipeable;

  private updateRef = (ref: Swipeable) => {
    this.swipeableRow = ref;
  };

  render() {
    const { children, disabled } = this.props;
    return (
      <View>
        {disabled ? (
          children
        ) : (
          <Swipeable
            ref={this.updateRef}
            friction={3}
            leftThreshold={40}
            rightThreshold={40}
            renderLeftActions={this.renderLeftActions}
            renderRightActions={this.renderRightActions}
          >
            {children}
          </Swipeable>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  fav: {
    flex: 1,
    backgroundColor: "#ffc000",
    justifyContent: "center",
    alignItems: "center",
  },
  trash: {
    flex: 1,
    backgroundColor: "#ff4000",
    justifyContent: "center",
    alignItems: "center",
  },
  sell: {
    flex: 1,
    backgroundColor: "#166e00",
    justifyContent: "center",
    alignItems: "center",
  },
  cart: {
    flex: 1,
    backgroundColor: "#697f86",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
  },
  sellText: {
    color: "white",
  },
  cartText: {
    color: "white",
  },
  favText: {
    color: "white",
  },
  trashText: {
    color: "white",
  },
});
