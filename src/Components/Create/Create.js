import React, { Fragment, useContext, useState } from 'react';
import './Create.css';
import Header from '../Header/Header';
import { AuthContext, FirebaseContext } from '../../store/Context';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import Swal from 'sweetalert2';

const Create = () => {
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('');
  const [productDetails, setProductDetails] = useState('');
  const [image, setImage] = useState(null);
  const [price, setPrice] = useState('');
  const [priceError, setPriceError] = useState('');

  const { user } = useContext(AuthContext);
  const { firebase } = useContext(FirebaseContext);
  const navigate = useNavigate();

  async function handleCreateAd(e) {
    e.preventDefault();
    if (!user) return alert('Please login to continue');

    if (parseFloat(price) < 0) {
      setPriceError('Price cannot be negative');
      return;
    }

    const date = new Date();
    try {
      // Upload image to Firebase Storage
      const storage = getStorage();
      const storageRef = ref(storage, `/image/${image.name}`);

      uploadBytes(storageRef, image).then((snapshot) => {
        getDownloadURL(storageRef).then(async (url) => {
          const productCollection = collection(firebase.db, "products");
          await addDoc(productCollection, {
            productName,
            category,
            productDetails,
            price,
            imageURL: url,
            userID: user.uid,
            createdAt: date.toDateString()
          }).then((docRef) => {
            Swal.fire({ position: 'top-center', icon: 'success', text: 'Ad created successfully', width: 340, showConfirmButton: false, timer: 1500 });
            navigate('/');
          }).catch((err) => { throw Error("Error creating ad"); });
        });
      });
    } catch (error) {
      console.error('Error creating ad:', error);
      alert('An error occurred while creating the ad.');
    }
  }

  return (
    <Fragment>
      <Header />
      <div className="row mx-5 p-4">
        <div className="col-12 col-md-4"></div>
        <div className="col-12 col-md-4 p-4 box">
          <div className="p-3">
            <form>
              <div className="col-12 mb-3">
                <label htmlFor="product_name" className="form-label">Product Name</label>
                <input type="text" className="form-control" name="product_name" placeholder="Enter the product name"
                  required value={productName} onChange={(e) => setProductName(e.target.value.trimStart())} />
              </div>
              {/* Category and product details inputs */}
              <div className="col-12 mb-3">
                <label htmlFor="Category" className="form-label">Category</label>
                <input type="text" className="form-control" name="Category" placeholder="Enter the category"
                  required value={category} onChange={(e) => setCategory(e.target.value.trimStart())} />
              </div>
              {/* Product description input */}
              <div className="col-12">
                <label htmlFor="description" className="form-label">Product Description</label>
                <textarea className="form-control" name="description" id="floatingTextarea2" style={{ height: 20 }}
                  required value={productDetails} onChange={(e) => setProductDetails(e.target.value)}></textarea>
                <label htmlFor="floatingTextarea2"></label>
              </div>
              {/* Product image input */}
              {image && <img src={image ? URL.createObjectURL(image) : ''} alt="post" className='mb-4 w-50' />}
              <div className="col-12 mb-4">
                <label htmlFor="product_image" className="form-label">Product Images</label>
                <input type="file" className="form-control" name="product_image" accept="image/*" multiple id="imageInput"
                  onChange={(e) => setImage(e.target.files[0])} />
              </div>
              {/* Selling price input */}
              <div className="col-md-4 mb-4">
                <label htmlFor="sellingPrice" className="form-label">Selling Price</label>
                <input type="number" step="0.01" className="form-control" id="sellingPrice" name="sellingPrice"
                  value={price} onChange={(e) => { setPrice(e.target.value); setPriceError(''); }} />
                {priceError && <div className="text-danger">{priceError}</div>}
              </div>
              {/* Submit button */}
              <br />
              <div className="text-center">
                <button className="btn btn-primary px-4 py-2" onClick={handleCreateAd}>Create AD</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Create;
