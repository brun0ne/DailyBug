import { View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { webScreenContentStyle } from "../../util/Layout";

const LoadView = () => {
    return (
        <View style={{width: "100%", height: "100%", justifyContent: "center", alignItems: "center", padding: 10, ...webScreenContentStyle}}>
            <ActivityIndicator />
        </View>
    )
};

export default LoadView;
