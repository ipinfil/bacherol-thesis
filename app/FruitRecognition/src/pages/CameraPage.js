import React, { useState, useEffect, useRef } from 'react';
import { Animated, StyleSheet, Image, View, TouchableOpacity, Text } from 'react-native';
import { Camera } from 'expo-camera';
import { BlurView } from 'expo-blur';
import ButtonContainer from '../components/ButtonContainer';

export default function CameraPage({ navigation }) {
    const [hasPermission, setHasPermission] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.auto);
    const [camera, setCamera] = useState(null);
    const [model, setModel] = useState('B0');

    const models = ['B0', 'B7', 'VT'];
    const modelNames = {
        "B0": 'EfficientNet B0',
        "B7": 'EfficientNet B7',
        "VT": 'Vision Transformer'
    };
    let currentModel = models.findIndex(m => m === model);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const anim = useRef(new Animated.Value(0)).current;
    const modelOpacity = useRef(new Animated.Value(0)).current;

    const fadeIn = () => {
        Animated.timing(anim, {
            toValue: 1,
            duration: 250,
            useNativeDriver: true
        }).start();
    };

    const fadeOut = (done) => {
        Animated.timing(anim, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true
        }).start(done);
    };

    const handleCapturePhoto = async () => {
        if (hasPermission && camera) {
            fadeIn();

            const img = await camera.takePictureAsync({
                base64: true,
                quality: 0.1,
            });

            // const response = await fetch('https://test123.free.beeceptor.com', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json'
            //     },
            //     body: JSON.stringify({
            //         data: img,
            //     }),
            // });

            // console.log(response.status);
            // if (response.ok) {
            //     const data = await response.json();
            //     console.log(data);
            // }

            fadeOut(() => {
                navigation.navigate('Listing', {data: [
                    {id: 'Apple', value : Math.random() * 100}
                ]});
            });
        }
    };

    const handleSwitchCamera = async () => {
        setType(type === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back);
    };

    const handleSwitchFlashMode = async () => {
        setFlashMode(flashMode === Camera.Constants.FlashMode.auto ? Camera.Constants.FlashMode.torch : Camera.Constants.FlashMode.auto);
    };

    const handleModelChange = async () => {
        setModel(models[(currentModel + 1) % models.length]);
        Animated.timing(modelOpacity, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true
        }).start();

        setTimeout(() => {
            Animated.timing(modelOpacity, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true
            }).start();
        }, 2200);
    };

    return (
        <View style={styles.container}>
            <Camera style={styles.camera} type={type} flashMode={flashMode} ref={ref => {
                setCamera(ref);
            }}>
                <Animated.View style={{ position: 'absolute', top: 80, opacity: modelOpacity, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                    <Text style={{ color: '#fff', fontSize: 22, shadowColor: '#000', shadowOpacity: 0.2 }}>
                        {modelNames[model]}
                    </Text>
                </Animated.View>
                <View style={styles.modelContainer}>
                    <TouchableOpacity
                        style={{
                            ...styles.button,
                            right: 20
                        }}
                        onPress={handleModelChange}>
                        <Text style={{ color: '#fff', fontSize: 22 }}>{model}</Text>
                    </TouchableOpacity>
                </View>
                <Animated.View style={{
                    ...styles.loadingContainer,
                    opacity: anim
                }}>
                    <BlurView style={styles.loading}>
                        <Image source={require('../../assets/loading.gif')} style={styles.loadingImg} />
                    </BlurView>
                </Animated.View>
                <ButtonContainer isBottom={true} handleSwitchCamera={handleSwitchCamera} handleCapturePhoto={handleCapturePhoto} handleSwitchFlashMode={handleSwitchFlashMode} showFlashModeSwitch={type === Camera.Constants.Type.back} />
            </Camera>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        display: 'flex'
    },
    camera: {
        width: '100%',
        height: '100%'
    },
    loadingContainer: {
        position: 'absolute',
        top: 200,
        width: '100%',
        height: '20%',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        borderRadius: 100,

    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        overflow: 'hidden',
        width: 200
    },
    loadingImg: {
        resizeMode: 'contain',
        height: 50,
    },
    button: {
        borderColor: '#fff',
        borderWidth: 2,
        borderRadius: 100,
        height: 70,
        width: 70,
        backgroundColor: 'rgba(0,0,0,0.2)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modelContainer: {
        position: 'absolute',
        top: 60,
        width: '100%',
        height: '20%',
        display: 'flex',
        alignItems: 'flex-end',
    }
});
