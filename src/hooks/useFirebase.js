import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import storage from 'src/firebase';

const useFirebase = () => {
  const uploadImage = (data) => {
    if (!data?.length) {
      return false;
    }

    console.log('Imagen Data', data);

    const promises = data.map((photo) => {
      const { image, path } = photo;
      const fileRef = ref(storage, path);

      return uploadBytes(fileRef, image);
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
