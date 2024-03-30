import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
// import {Text} from '../style/NativeWind';

export function DisplayCheckedList({ fullChecklistString }) {
    const [jsonData, setJsonData] = useState(fullChecklistString);

    useEffect(() => {
        try {
            setJsonData(prevData => {
                const newState = { ...prevData, ...fullChecklistString };
                console.log('newState:', newState);
                return newState;
            });
        } catch (error) {
            console.error('Error updating AI results:', error);
        }
    }, [fullChecklistString]);

    const renderChecklistItems = (checklistItems, checkboxStates) => {
        return Object.keys(checklistItems).map((item, index) => (
            <Text color="options" size="medium" key={index + 1}>
                {index + 1}. {item} - {checkboxStates[item] ? '✔' : null}
            </Text>
        ));
    };

    return (
        <ScrollView>
            <View>
                <Text>Current Step - Step {jsonData.current?.stepIndex + 1}</Text>
                <Text>Timestamp : {jsonData.current?.timestamp}</Text>
                <View>
                    <Text>Objects</Text>
                    {renderChecklistItems(
                        jsonData.current?.checklist.objects,
                        jsonData.current?.checklist.objects,
                    )}
                </View>
                <View>
                    <Text>Actions</Text>
                    {renderChecklistItems(
                        jsonData.current?.checklist.actions,
                        jsonData.current?.checklist.actions,
                    )}
                </View>
                {Object.keys(jsonData.current?.checklist.objects).every(
                    key => jsonData.current.checklist.objects[key],
                ) &&
                    Object.keys(jsonData.current?.checklist.actions).every(
                        key => jsonData.current.checklist.actions[key],
                    ) &&
                    Object.keys(jsonData.next?.checklist.objects).length === 0 &&
                    Object.keys(jsonData.next?.checklist.actions).length === 0 && (
                        <Text>You have finished all steps!</Text>
                    )}
                {Object.keys(jsonData.next?.checklist.objects).length === 0 &&
                    Object.keys(jsonData.next?.checklist.actions).length === 0 && (
                        <Text>No more steps ahead</Text>
                    )}
                <Text>
                    Next Step - Step
                    {Object.keys(jsonData.next?.checklist.objects).length === 0 &&
                        Object.keys(jsonData.next?.checklist.actions).length === 0
                        ? ' --'
                        : jsonData.current?.stepIndex + 2}
                </Text>
                <Text>Waiting to be detected next...</Text>
                <Text color="timestamp" size="small">
                    Timestamp :{' '}
                    {Object.keys(jsonData.next?.timestamp).length > 0
                        ? jsonData.next?.timestamp
                        : '--'}
                </Text>
                <View>
                    <Text>Objects</Text>
                    {Object.keys(jsonData.next?.checklist.objects).length > 0 ? (
                        Object.keys(jsonData.next?.checklist.objects).map(
                            (object, index) => (
                                <Text key={index + 1}>
                                    {index + 1}. {object}
                                </Text>
                            ),
                        )
                    ) : (
                        <Text>--</Text>
                    )}
                    <Text>Actions</Text>
                    {Object.keys(jsonData.next?.checklist.actions).length > 0 ? (
                        Object.keys(jsonData.next?.checklist.actions).map(
                            (action, index) => (
                                <Text key={index + 1}>
                                    {index + 1}. {action}
                                </Text>
                            ),
                        )
                    ) : (
                        <Text>--</Text>
                    )}
                </View>
            </View>
        </ScrollView>
    );
}
