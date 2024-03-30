import React, {useState} from 'react';
import {View, Text, TextInput, Button} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';

export default function UploadVideo() {
  //   const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [inputLink, setInputLink] = useState('');
  const [pending, setPending] = useState(false);
  const navigation = useNavigation();

  async function upload(inputLink, navigation) {
    try {
      console.log('inputLink :', inputLink);
      // Make an HTTP POST request to your server to upload the video
      const response = await axios.post(
        'http://localhost:3001/api/uploadVideo',
        {
          inputLink,
        },
      );
      console.log('response in UploadVideo Component :', response);
      // Before navigating to the Checkbox screen,
      // Keep only the necessary data, solved the Error : "Non-serializable values were found in the navigation state"
      const responseDataOnly = response.data;
      // Navigate to the CheckboxScreen and pass the data as a parameter
      navigation.navigate('Checkbox', {
        responseData: responseDataOnly,
      });
    } catch (error) {
      console.error('Error uploading video:', error);
      setMessage('Upload failed'); // Move this line here
      throw new Error('Upload failed');
    }
  }

  const handleUpload = async () => {
    if (!inputLink.trim()) {
      // If inputLink is empty or contains only whitespace
      setMessage('Please paste your link');
      return;
    }

    setPending(true);
    try {
      // Call your upload action with inputLink
      await upload(inputLink, navigation);
      setMessage('Upload successful');
    } catch (error) {
      setMessage('Upload failed');
    } finally {
      setPending(false);
    }
  };

  return (
    <View className="flex flex-col justify-center items-center h-full">
      <Text>{message}</Text>
      {/* <ProgressBar progress={progress} color={'blue'} /> */}
      <TextInput
        placeholder="Paste Your Youtube Link"
        value={inputLink}
        onChangeText={setInputLink}
        className="my-2 py-2 px-4 border border-black w-4/5"
      />
      <Button
        title={pending ? 'Uploading...' : 'Upload'}
        onPress={handleUpload}
        disabled={pending}
      />
    </View>
  );
}
