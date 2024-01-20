import { Appbar, useTheme } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

const Header = () => {
    const theme = useTheme();

    return (
        <Appbar.Header elevated>
            <MaterialCommunityIcons name="bug-check" color={theme.colors.primary} size={35} style={{ margin: 10 }}/>
            <Appbar.Content title="Daily Bug" />
            <Appbar.Action icon="dots-vertical" onPress={() => {}} />
        </Appbar.Header>
    )
};

export default Header;
