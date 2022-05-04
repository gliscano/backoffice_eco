import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import storage from 'src/firebase';

const useFirebase = () => {
  /**
   * upload images to Storage
   * @param data - an array of objects that contain the image and the path to upload to
   * @returns An array of promises.
   */
  const uploadImage = (data) => {
    if (!data?.length) {
      return false;
    }

    const promises = data.map((photo) => {
      const { image, path } = photo;
      const fileRef = ref(storage, path);

      return uploadBytes(fileRef, image);
    });

    return promises;
  };

  /**
   * Download URL of the file from reference
   * @param fileRef - The file reference to the file you want to get the download URL for.
   * @returns A promise that resolves to the download URL of the file.
   */
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
