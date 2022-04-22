import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import storage from 'src/firebase';

const useFirebase = () => {
  const uploadImage = (data) => {
    const { image, path } = data;

    const promises = image.map((photo) => {
      const fileRef = ref(storage, path);
      return uploadBytes(fileRef, photo);
    });

    return promises;
  };

  const getURLFile = (fileRef) => {
    const urlPromise = getDownloadURL(fileRef);
    return urlPromise;
  };

  return {
    getURLFile,
    uploadImage
  };
};

export default useFirebase;
