import React, { useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';
import { View, Text, TouchableOpacity, Linking } from 'react-native';
import { useRoute } from '@react-navigation/native';
import {
    Camera,
    useCameraPermission,
    // useMicrophonePermission,
    useCameraDevice,
    useFrameProcessor,
    // useResizePlugin,
} from 'react-native-vision-camera';
import { useWebSocket } from '../util/useWebSocket';
// import {detectObjects} from 'vision-camera-realtime-object-detection';
// import {
//   DetectedObject,
//   detectObjects,
//   FrameProcessorConfig,
// } from 'vision-camera-realtime-object-detection';
import { useTensorflowModel } from "react-native-fast-tflite";
import { DisplayCheckedList } from '../components/DisplayCheckedList';
import { useResizePlugin } from 'vision-camera-resize-plugin';

export default function CameraScreen() {
    const route = useRoute();
    console.log('route in CameraScreen.jsx:', route);
    const jsonData = route.params.jsonData;
    console.log('jsonData in CameraScreen.jsx :', jsonData);

    const websocket = useWebSocket();
    // const [hasPermission, setHasPermission] = useState(false)
    const { hasPermission, requestPermission } = useCameraPermission();
    // const {hasPermission,requestPermission} = useMicrophonePermission();
    const device = useCameraDevice('front');
    // const [selectedCamera, setSelectedCamera] = useState(null);
    // const toggleCamera = () => {
    //     setSelectedCamera(prevCamera => (prevCamera === 'front' ? 'back' : 'front'));
    // };

    // const device = useCameraDevice(selectedCamera);
    // const devices = useCameraDevices('wide-angle-camera')
    // const device = devices.front;
    const [isSendingFrames, setIsSendingFrames] = useState(false); // State to track if frames are being sent
    // const frameProcessorConfig = {
    //   modelFile: 'SSD_MobileNet_V2_FPNLite_640x640.tflite', // <!-- name and extension of your model
    //   scoreThreshold: 0.5,
    // };
    // const [model, setModel] = useState(null);
    const [fullChecklistString, setFullChecklistString] = useState(null);
    const [isWebSocketOpen, setIsWebSocketOpen] = useState(false);

    // const model = useTensorflowModel(
    //     'https://tfhub.dev/google/lite-model/object_detection_v1.tflite'
    //     // 'core-ml',
    // );
    const model = useTensorflowModel({
        url: 'https://tfhub.dev/google/lite-model/object_detection_v1.tflite'
    });

    // const objectDetection = useTensorflowModel(
    //   require('../../assets/model/SSD_MobileNet_V2_FPNLite_640x640.tflite'),
    // );
    // Remote URL
    // const objectDetection = loadTensorflowModel(
    //     'https://tfhub.dev/google/lite-model/object_detection_v1.tflite',
    //     'core-ml',
    // );
    // const model =
    // objectDetection.state === 'loaded' ? objectDetection.model : undefined;
    // const model = await loadTensorflowModel(
    //     'https://tfhub.dev/google/lite-model/object_detection_v1.tflite',
    //     'core-ml',
    // );
    // useEffect(() => {
    //     const fetchModel = async () => {
    //         // const model = await loadTensorflowModel(
    //         //     'https://tfhub.dev/google/lite-model/object_detection_v1.tflite',
    //         //     'core-ml',
    //         // );
    //         const model = useTensorflowModel(
    //             'https://tfhub.dev/google/lite-model/object_detection_v1.tflite',
    //             'core-ml',
    //         );
    //         // const response = await fetch('https://tfhub.dev/google/lite-model/object_detection_v1.tflite');
    //         // console.log("response from fetch:", response);
    //         // const modelData = await response.arrayBuffer();
    //         // console.log("modelData:", modelData);
    //         // const model = await loadTensorflowModel(modelData, 'core-ml');
    //         console.log("model:", model);
    //         // Once the model is loaded, you can set it to state
    //         setModel(model);
    //     };

    //     fetchModel(); // Call the async function to load the model
    // }, []); // Run only once on component mount

    const { resize } = useResizePlugin();

    // useEffect(() => {
    //     Camera.requestCameraPermission().then((p) =>
    //         setHasPermission(p === 'granted')
    //     )
    // }, [])
    useEffect(() => {
        if (!hasPermission) {
            // If the user hasn't granted camera permission yet, request it
            requestPermission();
        }
    }, [hasPermission, requestPermission]);

    // useEffect(() => {
    //     async function getPermission() {
    //       const permission = await Camera.requestCameraPermission();
    //       console.log(`Camera permission status: ${permission}`);
    //       if (permission === 'denied') await Linking.openSettings();
    //     }
    //     getPermission();
    //   }, []);

    useEffect(() => {
        if (!websocket) return;

        websocket.onopen = () => {
            setIsWebSocketOpen(true);
            console.log('WebSocket connection opened successfully in CameraScreen');
        };

        websocket.onmessage = event => {
            try {
                const fullChecklistString = JSON.parse(event.data);
                console.log(
                    'Received parsed fullChecklistString on client side ws :',
                    fullChecklistString,
                );
                setFullChecklistString(fullChecklistString);
            } catch (error) {
                console.error('Error processing WebSocket message:', error);
            }
        };

        websocket.onerror = error => {
            console.error('WebSocket error in CameraScreen:', error);
        };

        websocket.onclose = () => {
            setIsWebSocketOpen(false);
            console.log('WebSocket connection closed in CameraScreen');
        };

        return () => {
            websocket.close();
        };
    }, [websocket]);
    // Define frame processing function using useFrameProcessor hook
    const frameProcessor = useFrameProcessor(
        frame => {
            'worklet'; // Indicates that the function should run on the UI thread
            // Check if frames should be sent
            if (isSendingFrames) {
                // Check if jsonData is available and it has at least one item
                if (jsonData && jsonData.length > 0) {
                    // Get the objects from the first item in the jsonData array
                    const firstObjects = jsonData[0].objects;

                    // Check if the first item's objects contain the target object
                    if (firstObjects && Object.keys(firstObjects).length > 0) {
                        // Log a message indicating that at least one item is detected
                        console.log(
                            'At least one item detected in the first timestamp objects.',
                        );

                        // Your frame processing logic goes here
                        // const objects = detectObjects(frame, frameProcessorConfig);
                        if (model == null) return;

                        // 1. Resize 4k Frame to 192x192x3 using vision-camera-resize-plugin
                        const resized = resize(frame, {
                            scale: {
                                width: 192,
                                height: 192,
                            },
                            pixelFormat: 'rgb',
                            dataType: 'uint8',
                        });

                        // 2. Run model with given input buffer synchronously
                        const outputs = model.runSync([resized]);

                        // 3. Interpret outputs accordingly
                        const detection_boxes = outputs[0];
                        const detection_classes = outputs[1];
                        const detection_scores = outputs[2];
                        const num_detections = outputs[3];
                        console.log(`Detected ${num_detections[0]} objects!`);

                        // for (let i = 0; i < detection_boxes.length; i += 4) {
                        //   const confidence = detection_scores[i / 4];
                        //   if (confidence > 0.7) {
                        //     // 4. Draw a red box around the detected object!
                        //     const left = detection_boxes[i];
                        //     const top = detection_boxes[i + 1];
                        //     const right = detection_boxes[i + 2];
                        //     const bottom = detection_boxes[i + 3];
                        //     const rect = SkRect.Make(left, top, right, bottom);
                        //     canvas.drawRect(rect, SkColors.Red);
                        //   }
                        // }
                        const detectedObjects = outputs[1];
                        console.log('objects detected:', detectedObjects);
                        // Filter the objects to detect the target objects from the first item's objects
                        const targetObjects = detectedObjects.filter(o =>
                            Object.keys(firstObjects).includes(o.type),
                        );

                        // Check if targetObjects is not empty
                        if (targetObjects.length > 0) {
                            try {
                                // Log the detected target objects
                                console.log(
                                    `Detected ${targetObjects.length} target objects:`,
                                    targetObjects,
                                );

                                // Send frames to WebSocket
                                const frameMessage = JSON.stringify({
                                    type: 'frames',
                                    frames: frame.data,
                                });
                                if (websocket && websocket.readyState === WebSocket.OPEN) {
                                    websocket.send(frameMessage);
                                }

                                // Send jsonData to WebSocket
                                const jsonMessage = JSON.stringify({
                                    type: 'jsonData',
                                    jsonData: jsonData,
                                });
                                if (websocket && websocket.readyState === WebSocket.OPEN) {
                                    websocket.send(jsonMessage);
                                }
                            } catch (error) {
                                console.error(
                                    'Error while processing frame or sending data to WebSocket:',
                                    error,
                                );
                            }
                        }
                    }
                }
            }
        },
        [jsonData, isSendingFrames],
    );

    useEffect(() => {
        return () => {
            // Clean up WebSocket connection when unmounting
            if (websocket) {
                websocket.close();
            }
        };
    }, [websocket]);

    // Function to toggle sending frames
    const toggleSendingFrames = () => {
        if (!isWebSocketOpen) {
            // Show alert if WebSocket is not open
            Toast.show('Wait for awhile to connect...', Toast.SHORT);
            return;
        }
        setIsSendingFrames(prevState => !prevState); // Toggle the state
    };

    return (
        // <View className="flex-2/3 bg-black">
        <View style={{ flex: 1 }}>
            {/* <View style={{ flex: 1 / 2 }}>
                <Text>Selected Camera: {selectedCamera}</Text>
                <TouchableOpacity onPress={toggleCamera}>
                    <Text>Toggle Camera</Text>
                </TouchableOpacity>
            </View> */}
            {device ? (
                <View className="flex-4/5">
                    <Camera
                        style={{ flex: 1 }}
                        device={device}
                        isActive={true}
                        video={true}
                        // audio={true}
                        frameProcessorFps={5}
                        frameProcessor={frameProcessor}
                    />
                    <View className="absolute top-0 left-0 right-0 p-4">
                        <Text className="text-white">Camera Screen</Text>
                        {/* Button to toggle sending frames */}
                        {isWebSocketOpen && (
                            <TouchableOpacity
                                onPress={toggleSendingFrames}
                                className="bg-blue-500 rounded-md p-4 mt-4">
                                <Text className="text-white text-center">
                                    {isSendingFrames ? 'Stop Detecting' : 'Start Detecting'}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                    {/* <View className="flex-1/3"> */}
                    <View style={{ flex: 1 / 3 }}>
                        {fullChecklistString && <DisplayCheckedList fullChecklistString={fullChecklistString} />}
                    </View>
                </View>
            ) : (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>Camera not available</Text>
                </View>
            )}
        </View>
    );
}
