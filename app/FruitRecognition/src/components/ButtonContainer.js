import { View, TouchableOpacity, StyleSheet, Image, Pressable } from 'react-native';

export default function ButtonContainer(props) {
    return (
        <View style={styles.buttonContainer}>
            {props.showFlashModeSwitch && <TouchableOpacity style={{
                    ...styles.switchButton,
                    right: undefined,
                    left: 25
                }}>
            <Pressable onPress={props.handleSwitchFlashMode} >
                <Image source={require('../../assets/switch-flash.png')} style={{
                    resizeMode: 'contain',
                    height: 20,
                    tintColor: 'white',
                }} />
            </Pressable>
            </TouchableOpacity>}
            <TouchableOpacity
                style={styles.button}
                onPress={props.handleCapturePhoto}>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.switchButton}
                onPress={props.handleSwitchCamera}>
                <Image source={require('../../assets/switch-camera.png')} style={{
                    resizeMode: 'contain',
                    height: 20,
                    tintColor: 'white',
                }} />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    buttonContainer: {
        position: 'absolute',
        display: 'flex',
        bottom: 0,
        height: '15%',
        width: '100%',
        alignItems: 'center',
    },
    button: {
        borderColor: '#fff',
        borderWidth: 2,
        borderRadius: 100,
        height: 70,
        width: 70,
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    switchButton: {
        borderColor: '#fff',
        borderWidth: 2,
        borderRadius: 100,
        height: 50,
        width: 50,
        backgroundColor: 'rgba(0,0,0,0.2)',
        position: 'absolute',
        right: 25,
        top: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }
});
